---
title: 聊聊 input file 之文件上传
categories: [技术]
tags: [浏览器, input, 文件上传]
---

近期移动端项目用到了图片上传的功能，之前一直没有接触过，不知道原来在不需要后端的情况下前端就能够做那么多事情，再次感叹 HTML5 的强大。在近期移动端这个项目中用到的东西不多，不过应该是满足了平时的基本需求，包括按钮样式、文件多选、事件监听、文件类型、大小限制、图片预览和上传。

首先推荐张鑫旭大神的以下这两篇文章

- [HTML input type=file 文件选择表单元素二三事](http://www.zhangxinxu.com/wordpress/?p=5071)
- [基于 HTML5 的可预览多图片 Ajax 上传](http://www.zhangxinxu.com/wordpress/?p=1923)

不得不感叹一句 “前人栽树，后人乘凉”，真心要感谢这些前辈对行业发展作出的贡献，没有他们的付出，就没有咱这些后人的便捷。

## 按钮样式

`<input type="file">` 的默认样式简直丑到爆！而且还很不好控制，在项目中简直不可能使用。还好 input 这种货色并不是不能替代，给它一个 id，你就能用 label 标签替代它干活，样式问题自然就交给 label 标签也是很 OK 的。

## 支持多选

只要在 `<input type="file">` 上添加一个叫做 multiple 的属性名就能够支持文件多选，HTML5 简直了...

## 文件类型

前端做久了，深刻的感受到用户的行为是不可控的。拿上传图片来说，我们希望用户上传的是图片资源，可尼玛有些用户就是不听指挥，上传一些种子资源，这尼玛情何以堪。

_用户的操作我们不能控制，但是我们可以做到限制。_

so... accept 这个属性就要隆重登场啦，它指定浏览器接受的文件类型。例如我们限制用户只能上传图片，只要在 input 元素上添加属性 `accept="image/*"`，打开系统选择文件弹框的时候右下角文件类型选项显示的就是 “图片文件” 啦。

多种文件格式 accept 值使用逗号隔开： `accept="image/*, video/*, audio/*"`。OK，到此我们 html 里面的代码就应该是下面这样的。

```html
<label for="uploadFileBtn"></label>
<input id="uploadFileBtn" type="file" accept="image/*" multiple />
```

## 事件监听

在 input 元素上监听 change 事件就能获取到用户上传的文件信息，包括文件名、上传时间、文件大小等等，通过 FileReader 我们还可以将图片文件转换成 base64 编码格式实现预览图片功能。

在 change 事件监听的函数内，`event.target.files` 就是用户上传的图片信息。

## 文件大小

实际情况下，我们不可能让用户随意上传太大的文件，所以这里我们也需要对文件大小做一些限制。

在获取到的文件信息中有个 size 的属性就是文件的大小，单位是 B。也就是说，如果我们限制用户上传的单个文件最大为 3M，那么 size 属性的值就应该不大于 3 x 1024 x 1024 = 3145728。

## 图片预览

上面已经说到了，图片预览就是将用户上传的图片格式转换成 base64 格式，然后将它设置为 img 标签的 src 属性值添加到 DOM 中去。

那么怎么实现了？

FileReader 提供 readAsDataURL 方法可以实现我们的需求，当 FileReader 的实例把图片通过 readAsDataURL 方法转换为 base64 格式之后，会触发 onload 方法，此方法内的 `event.target.result` 就是我们所需要的 base64 格式图片。

```js
function previewImgFile(event, files, index) {
  var _files = files || event.target.files;
  var _index = index || 0;
  var reader = new FileReader();

  reader.onload = function (event) {
    var eImg = document.createElement("img");
    eImg.src = event.target.result;
    document.body.appendChild(eImg);

    if ((_index += 1) < _files.length) previewFiles(event, _files, _index);
  };

  reader.readAsDataURL(_files[_index]);
}

document
  .querySelector("#uploadFileBtn")
  .addEventListener("change", previewImgFile, false);
```

## 图片上传

这里有个非常重要的点需要明白，图片上传不同于普通表单数据提交，它们需要的编码格式是不一样的。

普通表单数据的编码类型为 `application/x-www-form-urlencoded`，而对于文件上传，编码类型应该使用 `multipart/form-data`。

也就是说，如果使用 form 表单上传文件（比如图片），那么 form 元素需要添加属性 `enctype="multipart/form-data"`。

还有一种方式是在 js 中使用 FormData 和 XMLHttpRequest 实现上传

- `FormData` 用来保存文件数据
- `XMLHttpRequest` 提供发送数据请求

```js
function uploadUserFile(event) {
  var files = event.target.files;
  var formData = new FormData();
  var request = new XMLHttpRequest();

  for (var i = 0, len = files.length; i < len; i++) {
    formData.append("userUploadFile", files[i]);
  }

  request.open("POST", "a/p/i");
  request.send(formData);

  request.onload = function (event) {
    var oResponse = JSON.parse(event.target.response);
    // do something
  };
}

document
  .querySelector("#uploadFileBtn")
  .addEventListener("change", uploadUserFile, false);
```
