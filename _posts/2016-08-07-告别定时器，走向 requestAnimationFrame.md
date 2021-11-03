---
title: 告别定时器，走向 requestAnimationFrame
categories: [技术]
tags: [浏览器, setTimeout, requestAnimationFrame]
---

以前有做过一些 HTML5 canvas 动画，但一直也没有仔细去了解过，而且也都是使用定时器 setTimeout 和 setInterval 方法去刷新 canvas。然而定时器延迟是无法保证准确的，因为所有的 JavaScript 在单线程中执行，只有当前面队列（代码）执行完毕且轮到了自己才能被执行，而且页面定时器可能不只有一个是吧，定时器越多延迟也就越严重。也就是说，无法保证帧速率达到显示器的刷新速率 **60 帧/秒 (60FPS)**。

## 前言

浏览器厂商可能也因为市场需求（上诉原因导致）原生支持了 requestAnimationFrame 方法，此方法基本上能保证帧速率达到 60FPS。但是此方法在还没形成标准之前，很多低版本浏览器是不支持的，比如：IE9 以及以下版本，不过谷歌和火狐都用私有的方法名实现了 requestAnimationFrame 方法。比如：谷歌 webkitRequestAnimationFrame、火狐 mozRequestAnimationFrame。形成标准后，IE10 才开始支持，由于 IE10 支持的是标准的 requestAnimationFrame 方法，因此它没有私有前缀。

- [MDN - window.requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame/)
- [requestAnimationFrame for Smart Animating](http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/)

## 那么

如何使用了？首先解决兼容性问题，先贴一段 [大神](https://github.com/darius/requestAnimationFrame/) 的代码：

```js
if (!Date.now)
  Date.now = function () {
    return new Date().getTime();
  };

(function () {
  "use strict";

  var vendors = ["webkit", "moz"];
  for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
    var vp = vendors[i];
    window.requestAnimationFrame = window[vp + "RequestAnimationFrame"];
    window.cancelAnimationFrame =
      window[vp + "CancelAnimationFrame"] ||
      window[vp + "CancelRequestAnimationFrame"];
  }
  if (
    /iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || // iOS6 is buggy
    !window.requestAnimationFrame ||
    !window.cancelAnimationFrame
  ) {
    var lastTime = 0;
    window.requestAnimationFrame = function (callback) {
      var now = Date.now();
      var nextTime = Math.max(lastTime + 16, now);
      return setTimeout(function () {
        callback((lastTime = nextTime));
      }, nextTime - now);
    };
    window.cancelAnimationFrame = clearTimeout;
  }
})();
```

好啦，现在就不用管兼容性问题啦。有兴趣的同学可以好好去理解上面这段代码。

流程大概是这样的

```js
  // 每一帧执行的动画
  function frameAnimation() {
    // 是否继续执行动画
    if (Boolean) return;

    // 执行动画操作具体细节
    ...

    // 继续执行动画
    window.requestAnimationFrame(frameAnimation)
  }

  // 开始执行动画
  window.requestAnimationFrame(frameAnimation)
```

我觉得这比定时器要简单的多，不用关心动画的执行的时间间隔，因为它是跟着显示器的刷新速率走的，绝对的稳定。而且我们有个很清晰的概念：每一帧动画是做什么。

另外，如果在一个浏览器标签页里运行一个动画，当这个标签页不可见时，浏览器会暂停它，这会减少 CPU，内存的压力，节省电池电量。

[查看 Demo](http://znlbwo.github.io/study/demo/requestAnimationFrame.html/)

当然，requestAnimationFrame 并不能完全替代定时器，有所长也必有所短，如果我们的需求是类似视频的 快进/快退 之类需要不同的速率执行动画，那还是回到定时器的怀抱吧，requestAnimationFrame 貌似并不能做到。

## 最后

上周三 8 月 17 号是我入职智云 70 度正好一年的时间，后知后觉才记起，打算整理下从我入职以来所做的事情，应该说给咱 70 度制作平台添加的功能。写这篇文章的源头是我以前做的一个叫环境的特效功能，引入的这段特效的 js 代码头部有一段 requestAnimationFrame 的代码，当时太菜所以没关注，现在回过头来整理理解，也算是发现了一块新大陆。

本想着写一段抒情的话语说说过去的这一年，算了，实在不够矫情。前端的路还很长，继续加油！
