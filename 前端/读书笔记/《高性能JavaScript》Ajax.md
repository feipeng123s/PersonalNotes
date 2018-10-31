### 五种常用于向服务器请求数据的技术

- XMLHTTPRequest(XHR)
- 动态脚本注入

  >可以跨域请求数据，不能设置请求的头信息，参数传递也只能使用GET方式
- iframes
- Comet
- Multipart XHR

  >由于MXHR响应消息体积较大，因此有必要在每个资源收到时就立刻处理，而不是等到整个响应消息接收完后。可以通过**监听readyState为3**的状态来实现（**流功能**）。

### Comet

>Comet是一种用于web的推送技术，能使服务器实时地将更新的信息传送到客户端，而无需客户端发出请求
- 实现方式
  - 长轮询
  - iframe流
  - WebSocket

### Data URLs
[MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/data_URIs

>前缀为 data: 协议的的URL，其允许内容创建者向文档中嵌入小文件
>####语法
>Data URLs 由四个部分组成：前缀(data:)、指示数据类型的MIME类型、如果非文本则为可选的base64标记、数据本身：
>``data:[<mediatype>][;base64],<data>``

### Beacons（信标）

>与动态脚本注入类似（动态脚本用来请求数据，Beacons用来发送数据）。使用JS创建一个新的Image对象，并把scr属性设置为服务器上脚本的URL
```
var url = '/status_tracker.php';
var params = [
  'step = 2'.
  'time = 1248027314'
];

var beacon = new Image();
beacon.src = url + '?' + params.join('&');

beacon.onload = function () {
  if (this.width === 1) {
   // success
  } else if (this.width === 2) {
   // failed，请重试并创建另一个信标
  }
}
beacon.onerror = function () {
  // error,请重试并创建另一个信标
}
```

### JSON-P(JSON with padding，JSON填充)
在使用动态脚本注入时，JSON数据被当做另一个JavaScript文件并作为原生代码执行。