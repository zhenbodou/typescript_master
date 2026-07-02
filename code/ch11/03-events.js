// 文件：code/ch11/03-events.js
// 演示 EventEmitter：Node 里"事件驱动"的核心机制。

import { EventEmitter } from "node:events";

// 1) 直接使用一个 EventEmitter 实例
const bus = new EventEmitter();

// on：注册监听器，同一个事件可以注册多个
bus.on("greet", (name) => {
  console.log(`你好，${name}！`);
});
bus.on("greet", (name) => {
  console.log(`（第二个监听器也收到了：${name}）`);
});

// once：只触发一次，之后自动移除
bus.once("boot", () => {
  console.log("系统启动，这句只会打印一次");
});

// emit：触发事件，后面的参数会传给监听器
bus.emit("greet", "小明");
bus.emit("boot");
bus.emit("boot"); // 第二次不会有反应

// 2) 自定义一个继承 EventEmitter 的类
class Downloader extends EventEmitter {
  start(url) {
    this.emit("start", url);
    // 模拟分块下载进度
    for (let percent = 25; percent <= 100; percent += 25) {
      this.emit("progress", percent);
    }
    this.emit("done", url);
  }
}

const d = new Downloader();
d.on("start", (url) => console.log(`开始下载：${url}`));
d.on("progress", (p) => console.log(`进度：${p}%`));
d.on("done", (url) => console.log(`下载完成：${url}`));
d.start("https://example.com/file.zip");
