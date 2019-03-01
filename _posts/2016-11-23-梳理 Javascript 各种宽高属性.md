---
title: 梳理 Javascript 各种宽高属性
---

上周在掘金看到一篇关于 [JavaScript 中的各种宽高属性](https://segmentfault.com/a/1190000007515034) 的文章获益良多。之前脑海中对这些知识都是非常模糊的概念，看完这篇文章之后觉得有必要对其进行一些总结，梳理这些知识点。So... 一堆干货来袭。

在了解宽高属性之前，咱必须得先完全明白 CSS Box Model，请看下图：

![](https://picabstract-preview-ftn.weiyun.com:8443/ftn_pic_abs_v2/299c2c9459ef12440da80f45d4beb0dde39f42c1dfa2c8d805de712d2c218b64b639c4ef409a77bd348d41b035fa9275?pictype=scale&from=30013&version=2.0.0.2&uin=287531381&fname=css-box-model.png&size=1024*1024)

## window 上的宽高属性

### window.outerWidth / window.outerHeight

浏览器的 (宽 / 高) 度

### window.innerWidth / window.innerHeight

浏览器可提供给页面展示使用的 (宽 / 高) 度，不包含开发者工具和浏览器外边框，这是页面真正的宽高度。

![](https://picabstract-preview-ftn.weiyun.com:8443/ftn_pic_abs_v2/b9386e7aa37090144de0f40e2ed6124c32f4471e84cd5a281d1eb580257baaa71a95e48e75057ed4db6dcdfecccbb222?pictype=scale&from=30013&version=2.0.0.2&uin=287531381&fname=inner-outer.png&size=1024*1024)

### window.screen.width / window.screen.height

电脑屏幕的 (宽 / 高) 度

### window.screen.availWidth / window.screen.availHeight

电脑屏幕可提供给浏览器展示使用的 (宽 / 高) 度

最常见的就是 windows 系统底部任务栏会占据一定的屏幕高度，导致给浏览器可展示使用的高度会比电脑屏幕要小一个任务栏的高度。也就是说，`window.screen.availHeight = widnow.screen.height - 任务栏高度`。

### window.screenTop / window.screenLeft

浏览器距离屏幕 (上 / 左) 侧的位移值，无视任务栏 (如果你的任务栏在左侧或者顶部)。

![](https://picabstract-preview-ftn.weiyun.com:8443/ftn_pic_abs_v2/97f50d04b585df5e88ef1a41d4bc4f5855ae26cd58ff7f8e7559987aaaa13e8454f812d35a10252832ebbb0989566cc0?pictype=scale&from=30013&version=2.0.0.2&uin=287531381&fname=screen-avail.png&size=1024*1024)

## element 上的宽高属性

### clientWidth / clientHeight

- `clientWidth = width + padding - scrollBar`
- `clientHeight = height + padding - scrollBar`

元素 (宽 / 高) 度 + padding - 滚动条 (宽 / 高) 度

### clientTop / clientLeft

- `clientTop = borderTop`
- `clientLeft = borderLeft`

元素 (上 / 左) 侧 border (高 / 宽) 度

### offsetWidth / offsetHeight

- `offsetWidth = width + padding + border`
- `offsetHeight = height + padding + border`

元素内容 (宽 / 高) 度 + padding + border  
其实这里可以看出来，以 `offsetWidth` 为例，可以看出：`offsetWidth = clientWidth + scrollBar + border`

![](https://picabstract-preview-ftn.weiyun.com:8443/ftn_pic_abs_v2/219c1dcba870fa136ac7776504674b58d50e2018e343ae9ebae8ab5a26e762e56c55ed41dadff1a378b8ec0d854c9357?pictype=scale&from=30013&version=2.0.0.2&uin=287531381&fname=client-offsett.png&size=1024*1024)

### offsetParent 和 offsetTop / offsetLeft

- `offsetTop = offsetParent.marginTop + offsetParent.borderTop + offsetParent.paddingTop + marginTop`
- `offsetLeft = offsetParent.marginLeft + offsetParent.borderLeft + offsetParent.paddingLeft + marginLeft`

offsetParent 是距离 element 最近且有 css 定位属性 (position: relative || absolute || fixed) 的父级元素，如果 element 的所有父级元素都没有 css 定位属性的话，offsetParent 则为 `document.body` 元素。

### scrollWidth / scrollHeight

如果是 `body` 元素，分为一下几种情况：

在没有滚动条的情况下：

- `scrollWidth = window.innerWidth`
- `scrollHeight = window.innerHeight`

在有滚动条的情况下：

- `scrollWidth = width + padding + border + margin`
- `scrollHeight = height + padding + border + margin`

如果是其他元素

在没有滚动条的情况下：

- `scrollWidth = clientWidth`
- `scrollHeight = clientHeight`

在有滚动条的情况下跟 `body` 元素是一样的。

### scrollTop / scrollLeft

滚动条滑动的距离

![](https://picabstract-preview-ftn.weiyun.com:8443/ftn_pic_abs_v2/15fd22ead9f757021bef6482f4e2e8236fa1fbe175a2776a9532463293f1a1cf95d1ca352c9f31a0dfce8da4f9f3f421?pictype=scale&from=30013&version=2.0.0.2&uin=287531381&fname=client-offset-scroll.png&size=1024*1024)
