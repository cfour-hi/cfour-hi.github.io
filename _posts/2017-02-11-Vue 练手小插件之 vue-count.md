---
title: Vue 练手小插件之 vue-count
---

年前有两天不那么忙的时间，就想着写一个 Vue 的插件练练手。刚好项目中有一个计数功能需要实现，就是显示一个数字，让这个数字在一定时间内从 0 到实际数值的动画。项目中使用的是 [countUp.js](https://github.com/inorganik/countUp.js) 插件，就索性实现一个这样的 Vue 小插件吧。

## 参考阅读

- [官方教程](https://cn.vuejs.org/v2/guide/plugins.html)
- [Creating Custom Vue.js Plugins](https://alligator.io/vuejs/creating-custom-plugins/)
- [Creating a Vuejs Plugin](https://medium.com/@sadickjunior/creating-a-vuejs-plugin-a90c6eb17ea5)

## 插件简介

[插件（vue-count）地址](https://github.com/Monine/vue-count)

插件功能并不多，没有 countUp.js 的特性那么丰富，也并没打算做那么丰富。

两个必须参数：

- `min` 最小值
- `max` 最大值

四个可选参数：

- `duration` 持续时间，默认 2 秒。
- `reverse` true 为从大到小，false 为从小到大，默认为 false。
- `decimal` 小数点后保留位数，默认为 0。
- `useGroup` 是否使用 “,” 分隔数字，默认为 false。

### 具体实现

了解原理有助于理解代码，整改动画效果可以理解为一个进度条，在每个进度显示对应的数值。
这是动画效果实现的核心概念，大部分动画实现其实都是这样，只是我们好像并没有关注过这每一帧的细节。如果 canvas 和 requestAnimationFrame 使用的多同学应该会比较熟悉。canvas 实现效果需要不断绘制每一帧的画面，requestAnimationFrame 则是对应显示器的刷新速率 60FPS。

CSS3 animation－timing－function 和 transition-timing-function 属性有预定义的的几个速度曲线值和三次贝塞尔（Cubic Bezier）函数，其实底层实现也都是对每一帧的求值。

- `linear` 以相同速度开始至结束的效果（cubic-bezier(0,0,1,1)）
- `ease` 默认。以慢速开始，然后加快，然后慢速结束的效果（cubic-bezier(0.25,0.1,0.25,1)）
- `ease-in` 以慢速开始的效果（cubic-bezier(0.42,0,1,1)）
- `ease-out` 以慢速结束的效果（cubic-bezier(0,0,0.58,1)）
- `ease-in-out` 以慢速开始和结束的效果（cubic-bezier(0.42,0,0.58,1)）
- `cubic-bezier(n,n,n,n)` 在 cubic-bezier 函数中自己的值。可能的值是从 0 到 1 的数值。

[cubic-bezier 在线生成](http://yisibl.github.io/cubic-bezier)

插件的实现就使用到了 requestAnimationFrame 方法，在 requestAnimationFrame 方法传入的回调函数的参数为一个时间戳（timestamp）Date.now() 的值，利用这个时间戳，可以知道当前进度（progress）。使用 max 与 min 的差值（diff）和 动画持续时间（duration）就可以得到动画当前帧的计算公式：`min + diff * (progress / duration)`，如果可选参数 reverse 为 true，则动画当前帧的计算公式为 `max - diff * (progress / duration)`，就是这么简单。

### 使用插件

插件的功能都实现好了，那怎么让别人使用了？就像我 vue-router 那样，`import VueRouter from 'vue-router'` 之后使用 `Vue.use(VueRouter)` 就能使用。首先看看官方教程是怎么描述的：

> Vue.js 的插件应当有一个公开方法 install 。这个方法的第一个参数是 Vue 构造器 , 第二个参数是一个可选的选项对象:

```js
MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或属性
  Vue.myGlobalMethod = function () {
    // 逻辑...
  }
  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
    ...
  })
  // 3. 注入组件
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
    ...
  })
  // 4. 添加实例方法
  Vue.prototype.$myMethod = function (options) {
    // 逻辑...
  }
}
```

其实看完官方教程我还是不太明白该如何去写，就只知道我要给我的插件添加一个 install 方法，可是这里面做什么事情了？官方教程所描述的 4 点貌似我都不需要做，实在没想明白，就跑去看 vue-router 的源码，看大神是怎么写的。

[vue-router 的 install 方法](https://github.com/vuejs/vue-router/blob/dev/dist/vue-router.js#L434-L464)

稍微琢磨一下就明白啦，我只需要注册组件就 OK 啦。如下所示：

```js
VueCount.install = function(Vue) {
  if (this.install.installed) return;
  this.install.installed = true;

  Vue.component('vue-count', VueCount);
};
```

然后再添加一个自动使用插件的判断：

```js
if (typeof Vue !== 'undefined') {
  Vue.use(VueCount);
}
```

就酱，我的插件到此也就全部完成啦，发布到 npm 之后就大功告成。
