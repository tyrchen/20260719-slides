# 内容编辑指南

幻灯片文字、图形、样式和交互已经分开：

- `content.js`：62 页中文内容与页面顺序，日常改稿主要编辑这里。
- `visuals.js`：四张主题 SVG 视觉，可修改图形、标签和节点。
- `styles.css`：字体、颜色、间距、卡片与响应式规则。
- `app.js`：导航、全屏、总览和触控逻辑，一般无需修改。

## 修改一页

每页使用以下结构：

```js
S(
  '话题一 · Rustack',
  '页面标题',
  `<p class="lead">正文</p>${list(['要点一', '要点二'])}`,
  { kicker: '页眉小标题' }
)
```

可用的内容组件包括 `cards`、`list`、`flow`、`chip` 和 `evidence`。章节封面增加
`type: 'cover'`；需要主题图时增加 `visual: VISUALS.rustack`。

## 检查溢出

浏览器打开 `index.html?audit=1`。若存在纵向溢出，页面根节点会出现
`data-overflow="页码"`；无问题时为 `data-overflow="none"`。
