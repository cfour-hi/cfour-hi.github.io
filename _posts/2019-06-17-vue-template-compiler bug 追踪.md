---
title: vue-template-compiler 动态插槽名 bug 追踪
categories: [技术]
tags: [Vue, vue-template-compiler, debug, Range, 源码]
---

问题来自于上周六 @彭泽华 开发 CRM 项目，带他一步一步调试找到问题的根本原因，并在后续向 vue 提 issue 协助推进解决问题。

[https://github.com/vuejs/vue/issues/10165](https://github.com/vuejs/vue/issues/10165)

## 调试过程

简化后的模板代码如下图，动态插槽名都是变量 propertyName，最终只会渲染 propertyName 为 goalAmountMonth 的内容。

![Vbb0Gq.png](https://s2.ax1x.com/2019/06/18/Vbb0Gq.png)

通过 debugger 和 条件断点 找到问题点原因是在 vue renderSlot 方法中，父组件 vm 的 \$scopedSlots 对象中只有 goalAmountMonth，当动态插槽名为 achieveRatioMonth 时 renderSlot 方法返回的值为 null。

![VbbfiR.png](https://s2.ax1x.com/2019/06/18/VbbfiR.png)
![VbqGf1.png](https://s2.ax1x.com/2019/06/18/VbqGf1.png)

那为什么 \$scopedSlots 对象只有 goalAmountMonth 呢？继续查找 \$scopedSlots 对象内的数据是如何来的。  
通过全局搜索 Vue 项目源码 \$scopedSlots 关键词，找到 \$scopedSlots 的赋值语句在 src/core/instants/render.js 文件内。

![VbOYqO.png](https://s2.ax1x.com/2019/06/18/VbOYqO.png)

通过条件断点运行到 \$scopedSlots 赋值语句，进入 normalizeScopedSlots 方法，可以发现 \_parentVnode.data.scopedSlots 就已经确定了只有 goalAmountMonth，也就是说还要再往上找。

![VbjkuV.png](https://s2.ax1x.com/2019/06/18/VbjkuV.png)
![Vbjij0.png](https://s2.ax1x.com/2019/06/18/Vbjij0.png)

往上继续查找 \_parentVnode 的 scopedSlots 数据是从哪来的，条件断点继续添加条件。  
终于找到问题的根节点是在 render 函数，只有动态插槽名为 goalAmountMonth 的 scopedSlots。💀

![Vbv2dO.png](https://s2.ax1x.com/2019/06/18/Vbv2dO.png)

动态插槽名为 achieveRatioMonth 的 scopedSlots 哪去了？  
这里很容易就能想到，render 函数是 [vue-loader](https://github.com/vuejs/vue-loader) 对 .vue SFC 编译后的结果，vue-loader 编译 .vue SFC 使用的是 [vue-template-compiler](https://github.com/vuejs/vue/tree/dev/packages/vue-template-compiler)。

## vue-template-compiler 源码调试

想要继续探索问题原因就需要深入 vue-template-compiler 源码调试，但是编译时要怎么调试呢？  
也不是不能调试编译时，只是太麻烦，没必要。  
先概览了一遍 vue-template-compiler 文档和源码，知道就是调用 compile 方法传入模板，就会输出一个包含 render 属性的对象。我的目的就是要调试这段过程，所以更简单的方法就是跑一个 node 脚本，引入 vue-template-compiler，调用 compile 方法传入模板，进入 compile 方法进行调试即可。

使用 VSCode 可以轻松做到，代码如下：

![Vq9RGF.png](https://s2.ax1x.com/2019/06/18/Vq9RGF.png)

先看最终执行结果：

[![VqCCIf.png](https://s2.ax1x.com/2019/06/18/VqCCIf.png)](https://imgchr.com/i/VqCCIf)

render 属性 with 代码块内代码格式化后如下，对比之前运行时的 render 函数，结果是一致的。

![VqClJU.png](https://s2.ax1x.com/2019/06/18/VqClJU.png)
![Vbv2dO.png](https://s2.ax1x.com/2019/06/18/Vbv2dO.png)

证实我是可以使用这段 node 脚本进行调试的，调试过程中有几个关键函数调用节点需要关注：

- baseCompile
- parse
- parseHTML

parseHTML 函数内需要关注 stack 对象，此对象储存模板解析过程中的 HTML 标签信息。

[![VqP69U.md.png](https://s2.ax1x.com/2019/06/18/VqP69U.md.png)](https://imgchr.com/i/VqP69U)

解析两个 template 标签时的 stack 内对象如下：

![Vq6OhQ.png](https://s2.ax1x.com/2019/06/18/Vq6OhQ.png)
![Vq6Ltg.png](https://s2.ax1x.com/2019/06/18/Vq6Ltg.png)

调试过程中观察 stack 对象信息，定位到问题的关键函数 closeElement：

![VqIy28.png](https://s2.ax1x.com/2019/06/18/VqIy28.png)

这是解析第一个 tempalte 结束时 closeElement 方法执行的地方，可以看到 currentParent.scopedSlots 就是保存 动态具名插槽 的对象，以 name 作为 key，name 取的是 element.slotTarget，值为 `propertyName`。

OK，以上都没问题，但是当解析到第二个 template 结束时，再瞧瞧 closeElement 方法执行到这个地方是怎样的。未执行关键步骤时，监视对象内的 element 和 currentParent.scopedSlots 值如下图所示：

![VqTY0H.png](https://s2.ax1x.com/2019/06/18/VqTY0H.png)

当执行完关键步骤之后，currentParent.scopedSlots.propertyName 被直接覆盖了！  
 因为 element.slotTarget 值与第一个 template 解析时的值是一样的，都是 `propertyName`，所以后者覆盖了前者。  
 问题的终点就在此处，也不需要继续往下调试了，后续也就是根据 root tag 对象生成代码对象了。
