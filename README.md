# monine.github.io

> 我的博客地址

## 选文

- [SPA 遇到 bfcache 所引发的无解闪现](https://monine.github.io/#/article/27)

- [我对 babel 的理解和疑惑](https://monine.github.io/#/article/26)

- [从简单的例子看 webpack 模块加载机制及思考原理](https://monine.github.io/#/article/25)

- [webpack 源码探索之插件机制](https://monine.github.io/#/article/24)

- [基于 webpack 的前端多页工程](https://monine.github.io/#/article/21)

- [Vue SPA 工程三大优化](https://monine.github.io/#/article/20)

- [下拉加载（刷新）和滚动加载](https://monine.github.io/#/article/17)

- [动态数据绑定的理解 - Vue.js 早期源码](https://monine.github.io/#/article/16)

- [抛物线动画（仿饿了么APP添加到购物车动画）](https://monine.github.io/#/article/15)

- [我的 2016](https://github.com/Monine/monine.github.io/issues/12)

- [HTML5 跨域通信 API - window.postMessage()](https://monine.github.io/#/article/2)

## 如何利用 Github 搭建 Blog

请先看 Github 官方教程：[GitHub Pages](https://pages.github.com/)，介绍的非常清楚。按照教程做完，就已经有了最原始的 Blog 页面。

如果你打算和我一样在 username.github.io 这个仓库的 Issues 内写博文，那请在教程第一步 Create a repository 时选择 Public 选项，而不是 Private，这与后文介绍的 personal access token 访问权限有关。

我的 Blog 是使用 [vue-cli](https://github.com/vuejs/vue-cli) 生成工程模板 [vue-webpack-boilerplate](https://github.com/vuejs-templates/webpack) 打造的 SPA（单页应用），页面结构、样式都是自己设计并手工打造。

Blog 的内容写在 Issues 内，每个 Issue 就是一篇博文。

Blog 页面通过 [Github API 获取 Issues 数据](https://developer.github.com/v3/issues/)，拿到数据后通过 [marked](https://github.com/markedjs/marked) 将 markdown 格式内容转换为 html 格式内容。

Github API 有限流机制 [Rate limiting](https://developer.github.com/v3/#rate-limiting)，每小时 API 的调用次数是有限制的。在未认证的情况下是每小时 60 次，在已认证的情况下是每小时 5000 次。

如何认证？具体不详细描述，有兴趣可以去看文档。我的方式很简单，生成一个有访问 public repository 权限的 personal access token，调用 Github API 获取数据时在 Request URL 添加查询参数 `access_token=yourRersonalAccessToken` 即可。

生成访问 public repository 权限的 personal access token 方式请看下图：

![github-settings](http://oh8wftuto.bkt.clouddn.com/github-settings.jpg)
![github-personal-access-token](http://oh8wftuto.bkt.clouddn.com/github-personal-access-token.jpg)
![github-new-personal-access-token](http://oh8wftuto.bkt.clouddn.com/github-new-personal-access-token.jpg)

填写 Token description 并勾选 public_repo 之后将页面滚动到最底部点击绿色按钮 Generate token 生成 personal access token

### 注意！！！不要将 personal access token 完整的写入会提交到 Github repository 的文件内，不然提交后会导致 personal access token 立即失效。

假如 personal access token 是 0123456789，以 JS 为例，赋值给变量请写成 `const accessToken = '01234' + '56789'`。

这是 Github 的安全举措，当文件提交到 Github repository 时会被扫描，如果在提交的文件内容中发现你生成的 personal access token，则会立即使发现的 personal access token 失效。
