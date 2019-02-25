众所周知，CSS transition 对 display 属性是没有效果的，那带有 display 属性的元素 transition 该如何实现？Vue 有内置的 transition 组件配合 v-show 实现，React 该如何实现？

## 前言

React 本身不提供类似 Vue 的 transition 组件，关于如何实现动画效果，官方给出的回答是使用 React 社区插件 [React Transition Group](https://github.com/reactjs/react-transition-group) 和 [React Motion](https://github.com/chenglou/react-motion)。

Gitstars 项目中的一些过渡动效都是使用 Vue 的 CSS 过渡，所以使用 React Transition Group 中的 CSSTransition 组件的钩子函数 组件比较合适，但这其中有个坑，CSSTransition 组件并没有解决 dispay 过渡无效的问题。

众所周知，CSS transition 对 display 属性是没有效果的.

Vue 的 transition 组件配合 v-show 是没有上面这个问题的，看来 React 需要靠自己实现。

## 原理

实现的关键问题在于如何解决 display 对 transition 动效的破坏，究其原因是因为 display 的值从 none 到 block 的过程是没有是没有中间计算值的，这个中间计算值就类似于从 0 到 1 中间的 0.1、0.2、0.3...

举个例子：`transform: translateX(600px); transition: transform 1s linear;`

元素 1 秒钟匀速偏移 600px 距离，那其实在浏览器渲染引擎内部执行过渡动效之前，已经把元素每一帧的位置都计算出来。

因为显示器的刷新速率一般为 60 帧/秒 (60FPS)，所以元素每一帧的偏移距离是 `600 / 60 = 10px`。

上例每一帧的偏移距离就是过渡动效的中间计算值

那到底如何解决 display 对 transition 动效的破坏了？看下面示例代码：

```html
<style>
  #box {
    width: 100px;
    height: 100px;
    background-color: wheat;
    transition: transform 1s;
  }

  #box.hide {
    transform: scale(0);
  }

  .dn {
    display: none;
  }
</style>

<div id="box"></div>
<button type="button" id="btn">click</button>

<script>
  (() => {
    const btn = document.getElementById('btn');
    const box = document.getElementById('box');

    btn.addEventListener('click', () => {
      if (box.classList.contains('hide')) {
        // 隐藏状态下先移除 display none 显示元素
        // 元素此时处于缩放状态 `scale(0)`
        box.classList.remove('dn');

        // 当下一个执行栈执行时再移除 hide 从而执行过渡动效
        setTimeout(() => box.classList.remove('hide'));
      } else {
        // 显示状态下先添加 hide 执行过渡动效
        box.classList.add('hide');

        // 过渡动效结束立即添加 display none 隐藏元素
        setTimeout(() => box.classList.add('dn'), 1000);
      }
    });
  })();
</script>
```

## 结论

一句话描述就是：当元素从显示到隐藏，先执行过渡动效，过渡结束后立即添加 display none 属性隐藏元素；当元素从隐藏到显示，先移除 display none 属性显示元素，在下一个执行栈再执行过渡动效。

## React 实现

在 React 项目实践中，对 React Transition Group 中的 CSSTransition 组件再包装一层，让其能够通用于 display 特性的过渡动效。

```js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

class DisplayCSSTransition extends Component {
  constructor(props) {
    super(props);

    this.state = { isWillShow: false, isShow: props.in };

    this.handleEnter = this.handleEnter.bind(this);
    this.handleExited = this.handleExited.bind(this);
  }

  componentWillReceiveProps({ in: isWillShow }) {
    if (isWillShow !== this.props.in) this.setState({ isWillShow });
  }

  handleEnter() {
    this.setState({ isShow: true });

    const { onEnter } = this.props;
    if (onEnter) onEnter();
  }

  handleExited() {
    this.setState({ isShow: false });

    const { onExited } = this.props;
    if (onExited) onExited();
  }

  render() {
    const { props, state, handleEnter, handleExited } = this;
    const { style: propStyle, children } = props;
    const { isWillShow, isShow } = state;
    const style =
      isWillShow || isShow
        ? propStyle
        : Object.assign({}, propStyle, { display: 'none' });

    return (
      <CSSTransition
        {...props}
        onEnter={handleEnter}
        onExited={handleExited}
        style={style}
      >
        {children}
      </CSSTransition>
    );
  }
}

DisplayCSSTransition.propTypes = {
  in: PropTypes.bool.isRequired,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
  style: PropTypes.object,
};

DisplayCSSTransition.defaultProps = {
  style: {},
};

export default DisplayCSSTransition;
```

DisplayCSSTransition 组件的使用与 React Transition Group 的 CSSTransition 完全一样，借助两个状态 isWillShow 和 isShow 来确定元素的 display 值。  
在 React 的生命周期函数 componentWillReceiveProps 中确定状态 isWillShow 的值，以此确定元素的下一状态是执行从显示到隐藏还是隐藏到显示的过渡。  
在 CSSTransition 组件的钩子函数 onEnter 中设置状态 isShow 的值为 true，保证过渡动效之前当前元素处于显示状态。  
在 CSSTransition 组件的钩子函数 onExited 中设置状态 isShow 的值为 false，保证过渡动效结束之后当前元素处于隐藏状态。
