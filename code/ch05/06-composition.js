// 文件：code/ch05/06-composition.js
// 组合优于继承：用"拼装能力"代替"深层继承"

// 每个能力就是一个函数，接收一个对象，往它身上加方法
const canFly = (obj) => ({
  fly() {
    return `${obj.name} 正在飞`;
  },
});

const canSwim = (obj) => ({
  swim() {
    return `${obj.name} 正在游`;
  },
});

const canWalk = (obj) => ({
  walk() {
    return `${obj.name} 正在走`;
  },
});

// 用工厂函数按需组合能力，而不是设计庞大的继承树
function createDuck(name) {
  const duck = { name };
  // Object.assign 把多个能力对象的方法合并到 duck 上
  return Object.assign(duck, canFly(duck), canSwim(duck), canWalk(duck));
}

function createFish(name) {
  const fish = { name };
  return Object.assign(fish, canSwim(fish));
}

const donald = createDuck("唐老鸭");
console.log(donald.fly()); // 唐老鸭 正在飞
console.log(donald.swim()); // 唐老鸭 正在游
console.log(donald.walk()); // 唐老鸭 正在走

const nemo = createFish("尼莫");
console.log(nemo.swim()); // 尼莫 正在游
// nemo 没有 fly，因为我们没给它组合这个能力 —— 灵活、无需背负继承树

export { createDuck, createFish };
