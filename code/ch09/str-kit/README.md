# str-kit

几个常用的字符串小工具：`capitalize` / `slugify` / `truncate`。

## 安装

```bash
npm install str-kit
```

## 使用

```javascript
import { capitalize, slugify, truncate } from "str-kit";

capitalize("hello world"); // "Hello world"
slugify("Hello World! 你好"); // "hello-world-你好"
truncate("这是一段很长很长的文字", 6); // "这是一段…"
```

## API

- `capitalize(str)`：首字母大写。
- `slugify(str)`：转成 URL 友好的 slug。
- `truncate(str, maxLength = 20, ellipsis = "…")`：超长截断并加省略号。

## License

MIT
