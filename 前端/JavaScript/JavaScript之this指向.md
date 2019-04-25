### 全局执行上下文

无论是否在严格模式下，在全局执行上下文中（在任何函数体外部）``this``都指代全局对象

```javascript
// 在浏览器中，window对象同时也是全局对象
console.log(this===window); // true
```

### 函数上下文

在函数内部，``this``的值取决于函数被调用的方式

- 简单调用

    ```
    // 非严格模式
    function f1(){
      return this;
    }
    //在浏览器中：
    f1() === window;   //在浏览器中，全局对象是window

    //在Node中：
    f1() === global;

    // 严格模式
    function f2(){
      "use strict"; 
      return this;
    }

    f2() === undefined; // true
    ```

- 如果要想把 `this` 的值从一个上下文传到另一个，就要用 `call` 或者`apply` 方法。

- 调用`f.bind(someObject)`会创建一个与`f`具有相同函数体和作用域的函数，但是在这个新函数中，`this`将永久地被绑定到了`bind`的第一个参数，无论这个函数是如何被调用的

- 在**箭头函数**中，`this`与封闭词法上下文的`this`保持一致。

- 作为对象里的方法被调用时，它们的 `this` 是调用该函数的对象

- 当一个函数用作构造函数时（使用[new](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new)关键字），它的`this`被绑定到正在构造的新对象。

- 当函数被用作事件处理函数时，它的`this`指向触发事件的元素



参考文章：
[this](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)
[Node.js环境下JavaScript中this的问题](https://segmentfault.com/q/1010000005128554)