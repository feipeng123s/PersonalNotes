前后端之间的数据传递说到底是建立在HTTP协议的基础之上，那么首先，我们先介绍一些HTTP的相关知识。

## HTTP报文

### 定义

HTTP报文是在HTTP应用程序之间发送的数据块。这些数据块以一些文本形式的元信息开头，这些信息描述了报文的内容及含义，后面跟着可选的数据部分。

### 组成部分

不论是`请求报文`还是`响应报文`，它们都由三个部分组成：

- 起始行（start line）：所有HTTP报文都以一个起始行作为开始。请求报文的起始行说明要做些什么。响应报文的起始行说明发生了什么。
- 首部（header）：HTTP首部字段向请求和响应报文中添加了一些附加信息。本质上来说，他们只是一些名/值对的列表。
- 主体（body）：可选的实体主体部分是HTTP报文的负荷，即HTTP要传输的主要内容。

其中，首部又分为`通用首部`、`请求首部`，`响应首部`、`实体首部`、`扩展首部`。实体首部提供了有关实体及其内容的大量信息，可以告知报文的接受者它在对什么进行处理。实体首部中的**内容首部**提供了与实体内容有关的特定信息，说明了其类型、尺寸以及处理它所需的其他有用信息。而与今天问题有关的`content-type`即属于内容首部。

## Content-Type

Content-Type首部说明了报文中对象的媒体类型，常见的是MIME媒体类型、字符集（charset）等。例如：`'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'`

在HTTP请求中，常见的媒体类型如下：

- `application/json`
- `application/x-www-form-urlencoded`
- `multipart/form-data`
- `text/plain`、`text/html`、`text/css`

在前后端数据交互中，最常用的是前两个，`multipart/form-data`通常只在上传、下载文件或提交表单时才会用到。

## 前后端数据交互适配方案

这里后台为Java的Spring框架，前端AJAX请求使用`axios.js`：

- 对于一些简单类型的数据（如：`id=1`），我们通常使用`application/x-www-form-urlencoded`格式来传递，后台中使用`@RequestParams('id')`注解来接收参数。

- 对于需要传递数量较多的参数，我们可以使用`application/json`格式来传递，后台中先定义一个用来接收这个参数对象的DTO，然后使用`@RequestBody`注解来接收参数。

### 参数中含有数组的情况

> 我们经常会遇到简单类型的参数和数组类型参数一起传递的情况（如`a=1`，`b=[1,2,3]`）

1. 我们可以用`application/json`格式来传递，然后定义一个DTO来接收参数
2. 有时没有定义DTO的必要，这时就要使用`application/x-www-form-urlencoded`格式来传递：
   - 方式一：使用`JSON.stringfy()`将数组参数作为字符串传递，后台接收解析再使用
   - 方式二：将数组参数按照`path?b[]=1&b[]=2&b[]=3`的格式传递给后台（可以使用[qs](https://github.com/ljharb/qs)库的`stringify`方法，并使用`arrayFormat: 'brackets'`选项），后台使用`@RequestParam('b[]') Int[] b`接收即可。



