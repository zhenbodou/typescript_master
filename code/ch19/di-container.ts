// 文件：code/ch19/di-container.ts
// 本章小项目：一个"迷你依赖注入容器"（Dependency Injection Container）。
//
// 目标：
//   - 用类装饰器 @Injectable() 标记"可被容器管理的类"，并声明它的依赖。
//   - Container 能 register / resolve：自动递归实例化依赖，并把每个类缓存成单例。
//
// 为什么不用 emitDecoratorMetadata 自动读构造函数参数类型？
//   自动读取参数类型依赖旧的实验装饰器 + reflect-metadata（需额外安装）。
//   为了在标准（Stage 3）装饰器 + tsx 下"开箱即跑"，我们改为在
//   @Injectable({ deps: [...] }) 里显式声明依赖——这也是很多真实框架支持的写法。

type Ctor<T = unknown> = new (...args: any[]) => T;

interface InjectableOptions {
  deps?: Ctor[]; // 该类构造函数需要的依赖（按顺序）
}

// 全局注册表：记录"哪些类被标记为可注入"以及"各自的依赖列表"。
// 用 WeakMap 以类为键，类被回收时元数据也随之释放，不会内存泄漏。
const INJECTABLE = new Set<Ctor>();
const DEPS = new WeakMap<Ctor, Ctor[]>();

// 类装饰器工厂：接收配置，返回真正的类装饰器。
// 用泛型 C 让"接收的类"和"返回的类"是同一个具体类型，
// 满足标准装饰器"返回值类型必须与被装饰类兼容"的要求。
export function Injectable(options: InjectableOptions = {}) {
  return function <C extends Ctor>(value: C, context: ClassDecoratorContext): C {
    if (context.kind !== "class") {
      throw new Error("@Injectable 只能用在类上");
    }
    INJECTABLE.add(value);
    DEPS.set(value, options.deps ?? []);
    return value; // 不改写类本身，原样返回
  };
}

export class Container {
  // 单例缓存：类 → 实例。
  private singletons = new Map<Ctor, unknown>();
  // 正在解析中的类，用来检测循环依赖。
  private resolving = new Set<Ctor>();

  // 允许手动注册（比如注册"接口 token → 具体实现"），本例用类自身当 token。
  register<T>(token: Ctor<T>): void {
    INJECTABLE.add(token);
    if (!DEPS.has(token)) DEPS.set(token, []);
  }

  resolve<T>(token: Ctor<T>): T {
    // 1) 命中缓存 → 直接返回同一个实例（单例语义）。
    if (this.singletons.has(token)) {
      return this.singletons.get(token) as T;
    }
    // 2) 没标记 @Injectable 也没手动注册 → 报错，避免"凭空造对象"。
    if (!INJECTABLE.has(token)) {
      throw new Error(`无法解析 ${token.name}：它没有被 @Injectable 标记或 register`);
    }
    // 3) 循环依赖检测。
    if (this.resolving.has(token)) {
      throw new Error(`检测到循环依赖：${token.name}`);
    }
    this.resolving.add(token);

    // 4) 递归解析每个依赖，再把它们按顺序传给构造函数。
    const deps = DEPS.get(token) ?? [];
    const args = deps.map((dep) => this.resolve(dep));
    const instance = new token(...args);

    this.resolving.delete(token);
    this.singletons.set(token, instance); // 缓存为单例
    return instance as T;
  }
}

// ---------------- 演示：三层依赖 ----------------

@Injectable()
class Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }
}

@Injectable({ deps: [Logger] })
class Database {
  constructor(private logger: Logger) {
    this.logger.log("数据库连接已建立");
  }
  query(sql: string): string[] {
    this.logger.log(`执行查询: ${sql}`);
    return ["row1", "row2"];
  }
}

@Injectable({ deps: [Logger, Database] })
class UserService {
  constructor(
    private logger: Logger,
    private db: Database,
  ) {}
  findAll(): string[] {
    this.logger.log("UserService.findAll 被调用");
    return this.db.query("SELECT * FROM users");
  }
}

const container = new Container();

const svc = container.resolve(UserService);
console.log("查询结果:", svc.findAll());

// 验证单例：两次 resolve 拿到同一个实例。
const svc2 = container.resolve(UserService);
console.log("UserService 是单例吗?", svc === svc2);

// 验证共享：UserService 与 Database 拿到的是同一个 Logger。
const logger = container.resolve(Logger);
const db = container.resolve(Database);
console.log("Logger 被复用吗?", logger === (db as any)["logger"]);

// 验证错误处理：解析一个未标记的类会抛错。
class NotRegistered {}
try {
  container.resolve(NotRegistered);
} catch (e) {
  console.log("预期的错误:", (e as Error).message);
}
