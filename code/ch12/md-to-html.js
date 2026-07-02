// 文件：code/ch12/md-to-html.js
// 运行：node code/ch12/md-to-html.js
// 本章小项目：Markdown -> HTML 迷你解析器（教学玩具）。
// ⚠️ 这是用来"体会正则"的玩具，真实项目请用 marked、markdown-it 等成熟库。
// 支持：标题 # ## ###、粗体 **x**、斜体 *x*、行内代码 `x`、
//       链接 [t](url)、无序列表 - item、段落。

// ---------- 1) 行内元素：在一行文本内部做替换 ----------
function renderInline(text) {
  // 行内代码要最先处理：先把 `x` 抠出来，避免里面的 * 被误当成粗体。
  // (?:...) 非捕获，`([^`]+)` 捕获反引号之间的内容（不含反引号本身）。
  text = text.replace(/`([^`]+)`/g, "<code>$1</code>");

  // 链接 [文字](地址)：\[ \] \( \) 都要转义，因为它们是元字符。
  // ([^\]]+) 抓方括号里的文字；([^)]+) 抓圆括号里的地址。
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // 粗体 **x**：必须放在斜体之前，否则单个 * 会先把 ** 拆掉。
  // \*\* 匹配两个星号；(.+?) 非贪婪，抓最短的中间内容。
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // 斜体 *x*：单个星号包裹。此时 ** 已经被换成 <strong>，不会再干扰。
  text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");

  return text;
}

// ---------- 2) 块级元素：按行扫描 ----------
function mdToHtml(md) {
  const lines = md.split(/\r?\n/); // 兼容 Windows 的 \r\n 和 Unix 的 \n
  const out = []; // 收集输出的 HTML 片段
  let inList = false; // 当前是否正处在一个 <ul> 里

  // 遇到非列表行时，如果之前在列表中，先把 </ul> 补上并关闭状态。
  const closeListIfOpen = () => {
    if (inList) {
      out.push("</ul>");
      inList = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd(); // 去掉行尾空白，行首缩进先保留

    // 空行：结束段落/列表，不产生标签
    if (/^\s*$/.test(line)) {
      closeListIfOpen();
      continue;
    }

    // 标题：^(#{1,3})\s+(.+)$
    //   (#{1,3}) 抓 1~3 个井号，井号个数决定 h 几；\s+ 至少一个空格；(.+) 标题文字
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      closeListIfOpen();
      const level = heading[1].length; // 井号个数
      out.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      continue;
    }

    // 无序列表项：^\s*-\s+(.+)$
    //   行首可有空格，然后是 "- " 再跟内容
    const item = line.match(/^\s*-\s+(.+)$/);
    if (item) {
      if (!inList) {
        out.push("<ul>");
        inList = true;
      }
      out.push(`<li>${renderInline(item[1])}</li>`);
      continue;
    }

    // 其它非空行：当作段落
    closeListIfOpen();
    out.push(`<p>${renderInline(line.trim())}</p>`);
  }

  closeListIfOpen(); // 文档结尾若列表未关，补上
  return out.join("\n");
}

// ---------- 3) 试跑 ----------
const sample = `# 我的笔记

这是一个**粗体**和*斜体*的段落，还有 \`inline code\`。
访问 [示例站点](https://example.com) 了解更多。

## 待办清单

- 学习 **正则表达式**
- 写一个 *小* 解析器
- 阅读 \`md-to-html.js\`

### 结束

普通段落一段话。`;

console.log(mdToHtml(sample));

export { mdToHtml, renderInline };
