最近又看 Blog 的装修不顺眼，花了些时间重新装修了一番，布局上没有做啥修改，主要是样式的调整和新增首页。过程中遇到一个难题，而且是无解的难题，如题，与 bfcache 有关，挺偏的一个问题。并且还促使我去 vue-router 源码探索了一番。

## 闪现场景

SPA 页面的切换加入动画效果，比如使用 animate.css 动画库 fadeIn fadeOut。

```js
<transition
  enter-active-class="animated fadeIn"
  leave-active-class="animated fadeOut"
  mode="out-in"
>
  <router-view />
</transition>
```

假如有 A、B 两页面，当前处于 A 页面，在未滚动页面情况下 `window.pageYOffset === 0` 点击链接进入 B 页面，此时滚动 B 页面任意距离，假如是 300 px `window.pageYOffset === 300`。再点击浏览器返回按钮，B 页面执行 fadeOut 动画（动画执行完成之后才会 destroy），注意！当你点击浏览器返回按钮的一瞬间，B 页面会立即滚动（闪现！）到页面顶部 `window.pageYOffset === 0`，为什么？因为返回的是 A 页面，而 A 页面在退出时的滚动值是 `window.pageYOffset === 0`。

![spa-bfcache-flash](http://oh8wftuto.bkt.clouddn.com/spa-bfcache-flash.gif)

_有兴趣可以去我的 [Blog](https://monine.github.io/) 参观参观_

## 尝试过的解决方案

1. 设置 `overflow: hidden;`

```css
*,
*::before,
*::after {
  overflow: hidden;
}
```

非常简单粗暴是吧，可是无效。

2. 页面切换时重新设置 scrollTop 值

```js
window.addEventListener('popstate', () => {
  document.scrollingElement.scrollTop = 300;
});
```

同样，无效。

3. 抱着试一试的心态尝试监听 unload 事件阻止 bfcache；

[Working_with_BFCache](https://developer.mozilla.org/en-US/docs/Archive/Misc_top_level/Working_with_BFCache)

```js
window.addEventListener('unload', () => {
  // ...
});
```

纯属侥幸心理，SPA 页面间的切换始终只是组件间的切换，页面不会注销。

## 换个思路

正常点击 router-link 切换页面不会出现闪现问题，那是不是可以代理浏览器前进、后退行为呢？也就是说阻止默认的浏览器前进、后退行为，用 router-link 切换页面的方式执行代理切换。

你可能只知道 `event.stopPropagation()` 可以阻止事件向父级和子级传播，但不知道 `event.stopImmediatePropagation()` 除了有相同功效之外还可以阻止事件在兄弟间传播。这里阻止默认的浏览器前进、后退行为就需要用到它。

```js
window.addEventListener('popstate', event => {
  event.stopImmediatePropagation();
});
```

然后考虑怎么实现行为代理，首先尝试了 vur-router 提供的编程式导航 `router.back()`、`router.forward()`。结果发现与浏览器默认行为一模一样，然后打开 vur-router 源码一看，发现我好天真。

以下 vue-router 源代码全部取自 node_modules/vue-router/dist/vue-router.esm.js（开发环境运行代码）

```js
VueRouter.prototype.go = function go(n) {
  this.history.go(n); // 原来都在你在干活
};

VueRouter.prototype.back = function back() {
  this.go(-1);
};

VueRouter.prototype.forward = function forward() {
  this.go(1);
};
```

`this.history` 是啥？看看 VueRouter 构造函数。

```js
var VueRouter = function VueRouter(options) {
  // ...
  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base);
      break;
    case 'hash':
      this.history = new HashHistory(this, options.base, this.fallback); // 使用 hash 模式
      break;
    case 'abstract':
      this.history = new AbstractHistory(this, options.base);
      break;
    default:
      if (process.env.NODE_ENV !== 'production') {
        assert(false, 'invalid mode: ' + mode);
      }
  }
};
```

再瞧瞧 HashHistory 原型上的 go 方法：

```js
HashHistory.prototype.go = function go(n) {
  window.history.go(n);
};
```

啪啪，脸好疼...

还是老老实实模拟点击 router-link 吧，找到 router-link 的 click 事件。

```js
// router-link click 事件是执行 handler 函数
var handler = function(e) {
  if (guardEvent(e)) {
    // 事件守卫，比如按住 ctrl 键再点击 router-link 此方法会返回 undefined，然后浏览器执行默认行为：新 tab 打开链接地址。
    if (this$1.replace) {
      router.replace(location);
    } else {
      router.push(location); // location 是 router-link 组件所设置的属性对象: path params query hash 等
    }
  }
};
```

VueRouter 原型上的 push 方法

```js
VueRouter.prototype.push = function push(location, onComplete, onAbort) {
  this.history.push(location, onComplete, onAbort); // 上文已提到 this.history 是 HashHistory 实例
};
```

HashHistory 原型上的 push 方法

```js
HashHistory.prototype.push = function push(location, onComplete, onAbort) {
  var this$1 = this;

  var ref = this;
  var fromRoute = ref.current;
  this.transitionTo(
    location,
    function(route) {
      pushHash(route.fullPath); // 使用 history.pushState 方法修改当前 url
      handleScroll(this$1.router, route, fromRoute, false); // vue-router scrollBehavior
      onComplete && onComplete(route);
    },
    onAbort
  );
};
```

push 方法内调用实例的 transitionTo 方法，发现它是 History 对象原型上的方法，而不是 HashHistory，猜测应该是继承关系，再次查看 HashHistory 构造函数。

```js
var HashHistory = (function(History$$1) {
  function HashHistory(router, base, fallback) {
    History$$1.call(this, router, base); //
    // check history fallback deeplinking
    if (fallback && checkFallback(this.base)) {
      return;
    }
    ensureSlash();
  }
  if (History$$1) HashHistory.__proto__ = History$$1;
  HashHistory.prototype = Object.create(History$$1 && History$$1.prototype);
  HashHistory.prototype.constructor = HashHistory;
  // ...
  return HashHistory;
})(History);
```

不出所料，一套原型继承代码如期所至。其实可以到 github 上 clone 一套 vue-router 的源码看看 ES6 语法会更清楚，但我懒...

看看 transitionTo 方法做了什么

```js
History.prototype.transitionTo = function transitionTo(
  location,
  onComplete,
  onAbort
) {
  var this$1 = this;

  var route = this.router.match(location, this.current); // 匹配当前路由信息对象
  this.confirmTransition(
    route,
    function() {
      this$1.updateRoute(route);
      onComplete && onComplete(route);
      this$1.ensureURL();

      // fire ready cbs once
      if (!this$1.ready) {
        this$1.ready = true;
        this$1.readyCbs.forEach(function(cb) {
          cb(route);
        });
      }
    },
    function(err) {
      if (onAbort) {
        onAbort(err);
      }
      if (err && !this$1.ready) {
        this$1.ready = true;
        this$1.readyErrorCbs.forEach(function(cb) {
          cb(err);
        });
      }
    }
  );
};
```

获取当前路由信息对象之后，又调用 confirmTransition 方法，这个方法才是真正干活的方法。

```js
History.prototype.confirmTransition = function confirmTransition(
  route,
  onComplete,
  onAbort
) {
  var this$1 = this;

  var current = this.current;
  var abort = function(err) {
    if (isError(err)) {
      if (this$1.errorCbs.length) {
        this$1.errorCbs.forEach(function(cb) {
          cb(err);
        });
      } else {
        warn(false, 'uncaught error during route navigation:');
        console.error(err);
      }
    }
    onAbort && onAbort(err);
  };
  if (
    isSameRoute(route, current) &&
    // in the case the route map has been dynamically appended to
    route.matched.length === current.matched.length
  ) {
    this.ensureURL();
    return abort();
  }

  var ref = resolveQueue(this.current.matched, route.matched);
  var updated = ref.updated;
  var deactivated = ref.deactivated;
  var activated = ref.activated;

  var queue = [].concat(
    // in-component leave guards
    extractLeaveGuards(deactivated),
    // global before hooks
    this.router.beforeHooks,
    // in-component update hooks
    extractUpdateHooks(updated),
    // in-config enter guards
    activated.map(function(m) {
      return m.beforeEnter;
    }),
    // async components
    resolveAsyncComponents(activated)
  );

  this.pending = route;
  var iterator = function(hook, next) {
    if (this$1.pending !== route) {
      return abort();
    }
    try {
      hook(route, current, function(to) {
        if (to === false || isError(to)) {
          // next(false) -> abort navigation, ensure current URL
          this$1.ensureURL(true);
          abort(to);
        } else if (
          typeof to === 'string' ||
          (typeof to === 'object' &&
            (typeof to.path === 'string' || typeof to.name === 'string'))
        ) {
          // next('/') or next({ path: '/' }) -> redirect
          abort();
          if (typeof to === 'object' && to.replace) {
            this$1.replace(to);
          } else {
            this$1.push(to);
          }
        } else {
          // confirm transition and pass on the value
          next(to);
        }
      });
    } catch (e) {
      abort(e);
    }
  };

  runQueue(queue, iterator, function() {
    var postEnterCbs = [];
    var isValid = function() {
      return this$1.current === route;
    };
    // wait until async components are resolved before
    // extracting in-component enter guards
    var enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);
    var queue = enterGuards.concat(this$1.router.resolveHooks);
    runQueue(queue, iterator, function() {
      if (this$1.pending !== route) {
        return abort();
      }
      this$1.pending = null;
      onComplete(route);
      if (this$1.router.app) {
        this$1.router.app.$nextTick(function() {
          postEnterCbs.forEach(function(cb) {
            cb();
          });
        });
      }
    });
  });
};
```

乌央乌央很长一串，细节不做分析，了解大概是做什么。首先明白主角是 queue 对象和 runQueue 方法，顾名思义，就是一个队列和它的运行器，队列内都是一些钩子函数和异步组件。因此可以大致推测其行为就是执行与路由相关的生命周期事件，也就是加载和卸载路由相对应的组件，更新页面显示内容。

至此，原理和轮廓大致清晰，模拟点击 router-link 的方式其实早已确定，`router.push(location)` 就行了。location 参数如何获得？很简单，监听 popstate 方法，执行其回调时当前 url 地址已经变成目标路由地址，截取 hash 部分，调用 `router.resolve` 方法即可。

当我写完相关代码测试时，发现一个致命的错误！模拟点击 router-link 这套方案根本行不通，因为我永远是往 history 队列里加入路由，这样会导致两个错误。

1. 前进按钮永远不可点击
2. 连续点击两次返回按钮则路由错误

这是我之前并未考虑到的情况，仔细一想发现我最开始的想法就不可行。把浏览器当前 tab 的 historys 当成一个栈，点击链接是往栈内压入新的链接信息，指针指向新压入的链接信息。后退按钮只是简单的把指针指向上一个链接信息，而我模拟点击 router-link 则是一直在往栈内压入新的链接信息，错误显而易见。

```
// 浏览器执行后退操作正常行为
[a, b, c] => [a, b, c] => [a, b, c]
       ^         ^         ^

// 模拟点击 router-link 执行后退操作
[a, b, c] => [a, b, c, b] => [a, b, c, b, c]
       ^               ^                  ^
```

心很累，这么简单的错误我之前居然没想到。

另外值得注意的是当执行过后退操作之后，再点击新的链接则会抛弃栈内当前链接信息之上的所有链接信息，再压入新的链接信息，并将指针指向新的链接信息。也就是说前进按钮不再可点击，老旧的历史记录被删除。

```
// 返回到 a 后点击新的链接 d
[a, b, c] => [a, b, c] => [a, b, c] => [a, d]
       ^         ^         ^               ^
```

## 最后

试了这么多方案，最终还是没能找到一个可行方案，且已经黔驴技穷。最后思考的点是：我能够修改浏览器的历史记录吗？或者说 BOM 对象有提供修改历史记录的接口吗？
