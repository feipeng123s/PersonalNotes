# 背景交代
> 最近在工作中使用到了函数防抖、函数节流的东西，碰到了在setTimeout函数中使用this的问题，类似于如何在Vue中使用函数防抖，特此记录

防抖函数如下：
```javascript
function debounce(fn, timeout) {
  let timer = null;
  return function() {
    clearTimeOut(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, timeout);
  }
}
```
当原函数`fn`中有`this`时，在Vue中应该如何使用防抖函数？
```javascript
methods:{
    vueFun: debounce(function() {
        this.todo()
    }, 100)
}
```
# 归纳总结
> 超时调用代码都是在全局作用域中执行的，因此函数中this的值在非严格模式下指向window对象，在严格模式下时undefined

> setTimeout中有两个this，第一个this是调用环境下的this；第二个是延迟执行函数中的this；第一个this的指向需要根据上下文来确定，第二个就是指向window

> 通常，我们需要解决的问题就是让延迟执行函数中的this指向setTimeout调用环境下的this

## 解决方案
- 使用call,apply,bind改变方法中this指向(一般用于已经定义好的方法)
- 使用箭头函数，因为箭头函数中的this默认指向父级作用域中的this
- 使用变量缓存this，在延迟执行函数中使用该变量而不是this

## 在setTimeout中调用对象方法
> 需要在setTimeout中调用对象obj的fn方法，且fn中有this需要指向obj上下文
- 使用wrapper function
  ```javascript
  setTimeout(function() {
      obj.fn()
  }, 100)
  ```
- 使用call,apply,bind改变方法中this指向
  ```javascript
  setTime(obj.fn.call(obj), 100)
  setTime(obj.fn.apply(obj), 100)
  setTime(obj.fn.bind(obj), 100)
  ```