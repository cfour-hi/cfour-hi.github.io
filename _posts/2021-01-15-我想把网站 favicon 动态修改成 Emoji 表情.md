---
title: 我想把网站 favicon 动态修改成 Emoji 表情
---

网站的 favicon 由 `link[rel="icon"]` 标签提供，修改 href 的 url 地址，即可更新网站标签的 favicon。

![sr1iAe.jpg](https://s3.ax1x.com/2021/01/16/sr1iAe.jpg)

我们可以写一个函数动态改变 favicon。

```js
const setFavicon = function (url) {
  // 找到 favicon 标签
  const favicon = document.querySelector('link[rel="icon"]');
  if (favicon) {
    // 更新 favicon 图标
    favicon.href = url;
  } else {
    // 创建 link 标签
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = url;

    // 添加到 head 标签内
    document.head.appendChild(link);
  }
};
```

提供 url 作为参数给到 setFavicon 方法即可，比如使用百度的 favicon 地址。

```js
setFavicon('https://www.baidu.com/favicon.ico');
```

[![sU5vcV.gif](https://s3.ax1x.com/2021/01/14/sU5vcV.gif)](https://imgchr.com/i/sU5vcV)

## 使用 emoji 作为 favicon

2010 年，Unicode 6.0 版开始收录 emoji，它会被渲染为图形，但本质上还是文字。  
`link[rel="icon"]` 只能使用 url，文字如何生成 url？  
我们需要借助 canvas 渲染文字内容，以获取 emoji 的 url。

```js
const setEmojiFavicon = function (emoji) {
  // 创建 canvas 标签
  const canvas = document.createElement('canvas');
  canvas.height = 64;
  canvas.width = 64;

  // 获取 canvas 上下文
  const context = canvas.getContext('2d');
  context.font = '64px serif';
  context.fillText(emoji, 0, 64);

  // 获取 emoji url
  const url = canvas.toDataURL();

  // 更新 favicon
  setFavicon(url);
};
```

将 emoji 作为参数传入 setEmojiFavicon 方法即可，比如 "❤️"。

```js
setEmojiFavicon('❤️');
```

[![sUFmZQ.gif](https://s3.ax1x.com/2021/01/13/sUFmZQ.gif)](https://imgchr.com/i/sUFmZQ)

同样，我们也可以将 favicon 设置成任何文字，比如 “爷青回” 的 "爷"。

```js
setEmojiFavicon('爷');
```

[![sUAAHg.gif](https://s3.ax1x.com/2021/01/13/sUAAHg.gif)](https://imgchr.com/i/sUAAHg)

经过简单测试，浏览器标签的 favicon 区域最多能容纳一个中文文字或者两个英文字母。

## 设置动画效果 favicon

我们可以利用定时器，将一组图循环播放，将 favicon 做成动画效果。

```js
const group = ['🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔'];
let i = 0;

setInterval(() => {
  setEmojiFavicon(group[i]);
  if (i < group.length - 1) {
    i += 1;
  } else {
    i = 0;
  }
}, 300);
```

[![sUVKmT.gif](https://s3.ax1x.com/2021/01/13/sUVKmT.gif)](https://imgchr.com/i/sUVKmT)
