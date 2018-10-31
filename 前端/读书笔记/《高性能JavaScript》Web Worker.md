>自JavaScript诞生以来，还没有办法在浏览器UI线程之外运行代码。Web Workers API改变了这种状况，它引入了一个接口，能使代码运行且不占用浏览器UI线程时间。

### Worker运行环境

- navigator对象，只包含四个属性：appName、appVersion、user Agent和platform
- 一个location对象（与window.location相同，但所有属性都为只读）
- self对象，指向全局worker对象
- importScript方法，用来加载Worker所用到的JavaScript文件
  ```javascript
  // importScript方法的调用过程是阻塞式的，知道所有文件都加载并执行完成之后，脚本才会继续运行
  importScripts();                 /* 什么都不引入 */
  importScripts('foo.js');            /* 只引入 "foo.js" */
  importScripts('foo.js', 'bar.js');     /* 引入两个脚本 */
  ```
- 所有ECMAScript对象，诸如：Object、Array、Date等
- XMLHttpRequest构造器
- setTimeOut()和setInterval()方法
- close()方法，它能立刻停止Worker运行

### 与Web Worker通信
>通过postMessage方法给Worker传递数据，使用onmessage事件处理器来接收信息
```javascript
var worker = new Worker('code.js');
worker.onmessage = function (event) {
  alert(event.data);
}
worker.postMessage('Hello');

// code.js
self.onmessage = function (event) {
  self.postMessage('Recived message: ' + event.data);
}
```
