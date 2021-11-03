---
title: HTML5 跨域通信 API 之 window.postMessage()
categories: [技术]
tags: [浏览器, 跨域, iframe, postMessage]
---

最近遇到一个可以说是非常头疼的问题，微信的 API 在 iframe 内无法调用，然后因为业务需求又必须解决这个问题。查阅相关资料发现在 iframe 内使用 `window.parent.wx.xxx()` 可以调用微信 API 方法，但是！如果当前页面与嵌入的 iframe 不在同一域名**（跨域）**情况下，这尼玛简直就是坑爹的需求！

## 遇到问题

好在哥还算是比较机智的少年，再加上有我军哥的引导，发现 HTML5 的新 API `window.postMessage()` 貌似是能够解决俺这个问题的。so... 随即进行一系列研究测试。

参考: [MDN - Window.postMessage()](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)

语法: `otherWindow.postMessage(message, targetOrigin, [transfer])`

- `message` 你要发送的信息（字符串和对象都可以）
- `targetOrigin` 你要发送信息的目标域名
- `transfer` 可选参数，具体啥意思还没做深入了解，也暂时都还没用到过。

MDN 介绍的 `window.postMessage()` 是针对在一个页面使用 `window.open()` 动态打开新的页面而进行的跨域通信，非常详细，Demo 也很实用，但是对我而言貌似还欠缺什么东西。

在 `var targetPage = window.open('http://target.com')` 打开新页面之后需要等到 http://target.com 页面加载完成之后才能进行 postMessage 跨域通信，但是在跨域的情况下我们是无法对 targetPage 进行 onload 事件监听的，所以这里只能做延迟 setTimeout 或者定时 setInterval 处理。
同样的，在页面内嵌入 iframe 页面的情况下，我们也需要等到页面内的 iframe 加载完成之后进行 postMessage 跨域通信。

缕缕思路，写了一些小 Demo，使用 window.open() 动态打开新的页面使用 postMessage 跨域通信是 OK 的（[干货代码](#———-干货代码-———)），但是在页面内嵌入 iframe 还是实现不了，Chrome Console 内经常这样报错：

```
Failed to execute 'postMessage' on 'DOMWindow': The target origin provided ('http://192.168.198.157:8000') does not match the recipient window's origin ('http://192.168.198.157:3000').
```

- PageA: http://192.168.198.157:8000
- PageB: http://192.168.198.157:3000

PageA 页面内嵌入 iframe PageB

## 思考思考

半个小时都没有解决，这个时候觉得应该放一放，再仔细思考思考是哪里出问题了，一定是有没弄明白的地方，然后也 Google 了许多资料详细查看，讲讲思路吧。

- 解决问题要从问题源头出发，我现在遇到的问题归根究底就是两个不同域名的页面如何进行通信？
- 浏览器的同源政策不允许跨域，然而 HTML5 API window.postMessage() 就是用来实现跨域通信的。
- 那么通信的原理是怎样的了？
- 如果有两个页面 PageA 和 PageB，PageA 页面内嵌入 iframe PageB，那么理论上是应该可以实现双向通信的。

其实非常简单，就是 PageA 通过 `window.postMessage()` 发送一个信息给 PageB，PageB 在 window 上添加一个事件监听绑定 message 事件可以接收到来自任何不同域名通过 postMessage 方法发送过来的信息，当 PageB 接收到 PageA 发送过来的信息时执行监听事件就 OK，在监听事件的 event 参数中包含了所有 message 事件接收到的相关数据。包括发送信息的内容 `event.data`，发送信息的域名 `event.origin` 等等。

同样的，在 PageA 内添加一个事件监听绑定 message 事件，在 PageB 内通过 postMessage 方法发送信息给 PageA 一样可以进行跨域通信。

大概就是以上的思考，然后继续写 Demo...

## 干货代码

PageA

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Page A</title>
  </head>
  <body>
    <h1>This is Page A</h1>
    <button id="openNewWindowBtn" type="button">Open New Window</button>
    <button id="postMessageBtn" type="button">Post Message</button>
    <p id="message"></p>
    <iframe
      id="receiverIframe"
      src="http://192.168.198.157:3000/pageB.html"
      frameborder="1"
      width="800"
      height="500"
    ></iframe>
    <script>
      window.onload = function () {
        var receiver = document.getElementById("receiverIframe").contentWindow;
        var postBtn = document.getElementById("postMessageBtn");
        var openBtn = document.getElementById("openNewWindowBtn");
        var messageEle = document.getElementById("message");

        function sendMessage() {
          receiver.postMessage(
            "Hello Page B.. This is page A.. You are my iframe",
            "http://192.168.198.157:3000"
          );
        }

        function openNewWindow() {
          var pageB = window.open("http://192.168.198.157:3000/pageB.html");
          setTimeout(function () {
            pageB.postMessage(
              "Hello Page B.. This is Page A.. (form PageA window.open())",
              "http://192.168.198.157:3000"
            );
          }, 500);
        }

        function receiveMessage(event) {
          console.log(event);
          if (event.origin !== "http://192.168.198.157:3000") return;
          messageEle.innerHTML = "Message Received: " + event.data;
        }

        postBtn.addEventListener("click", sendMessage, false);
        openBtn.addEventListener("click", openNewWindow, false);
        window.addEventListener("message", receiveMessage, false);
      };
    </script>
  </body>
</html>
```

PageB

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Page B</title>
  </head>
  <body>
    <h1>This is Page B</h1>
    <button id="postMessageBtn" type="button">Post Message</button>
    <p id="message"></p>
    <script>
      window.onload = function () {
        var postBtn = document.getElementById("postMessageBtn");
        var messageEle = document.getElementById("message");

        function receiveMessage(event) {
          console.log(event);
          if (event.origin !== "http://192.168.198.157:8000") return;
          messageEle.innerHTML = "Message Received: " + event.data;
          // 接收 PageA 的任何消息都自动回复并加上时间戳
          event.source.postMessage(
            "Hello Page A.. This is page B.. (from PageB autoreply) timestamp = " +
              new Date().getTime(),
            event.origin
          );
        }

        function sendMessage() {
          // 这里需要特别注意！！！
          // 直接打开 PageB (当前页面) 是无法向 PageA 发送跨域信息的！！！
          // 只有当 PageB (当前页面) 处于 PageA 页面内的 iframe 中的时候才能发送跨域信息
          // 而且此处不能使用 window.postMessage()
          // 因为 PageB (当前页面) 是 PageA 页面内嵌入的 iframe
          // 此时 PageB 的 window 指向的是 PageA 内 iframe 框架内的 window
          // 而当前情况需要指向父级 window (即 top 或者 parent) 才能进行 postMessage
          top.postMessage(
            "Hello Page A.. This is page B..",
            "http://192.168.198.157:8000"
          );
        }

        postBtn.addEventListener("click", sendMessage, false);
        window.addEventListener("message", receiveMessage, false);
      };
    </script>
  </body>
</html>
```

## 踩过的坑

**PageB 需要特别注意的地方**

- 直接在浏览器中打开 PageB 页面是无法向 PageA 页面发送跨域信息的！
- PageB 页面的 receiveMessage 方法自动回复了所有来自 PageA 页面的 postMessage 信息并且加上了时间戳。
- 为什么 PageB 页面内的 sendMessage 方法使用的是 `top.postMessage()` 发送跨域信息？

答案就在下面的结论中

如果不是使用 `window.open()` 打开的页面或者 iframe 嵌入的页面，就跟当前页面扯不上任何关系，是无法使用 `window.postMessage()` 进行跨域通信的！

描述的貌似不是很清楚，举个栗子：

- 如果你打开浏览器，输入一个页面地址 PageA，然后打开一个新的标签页，又输入一个页面地址 PageB，那么这两个页面是无论如何都不能使用 `window.postMessage()` 来进行跨域通信的，他们并没有任何血缘关系...

- 同样，打开浏览器，输入一个页面地址 PageA，然后通过 PageA 动态打开 PageB (当然，不是通过 PageA 内的 a 标签链接打开)，或者 PageA 内嵌入了 iframe PageB，那么这个时候就厉害了，它两有血缘关系啦！PageB 这个时候是不是就相当于是 PageA 是崽崽？是因为有了 PageA，所以才有了 PageB 的出现。然后理所当然的，PageA 拥有了控制 PageB 的某些权限，其中就包括 `window.postMessage()`。

## 得出结论

Q: `window.postMessage()` 中的 window 到底是什么呢？

A: 始终是你要通信的目标页面的 window

第一种情况，PageA 页面内嵌入 `iframe` PageB 页面

- PageA 页面向 PageB 页面发送跨域信息，window 为 PageB 页面的 window，即 `iframe.contentWindow`。
- PageB 页面向 PageA 页面发送跨域信息，window 为 PageA 页面的 window，即 top 或者 parent。

第二种情况，PageA 页面内代码使用 `window.open()` 打开 PageB 页面

- PageA 页面向 PageB 页面发送跨域信息，window 为 `var pageB = window.open('http://192.168.197.157:3000/pageB.html')` 中的变量 pageB。
- PageB 页面无法主动给 PageA 页面发送跨域信息，必须先接收到 PageA 页面发送过来的 message 然后再通过 `event.source` 发送给 PageA，没错... 此时的 window 就是 `event.source`，即 PageA 的 window。

## 最后最后

请无论如何在监听 message 事件的函数内对 `event.origin` 进行过滤，不然来自未知站点的 `window.postMessage()` 可以对你的站点为所欲为。
