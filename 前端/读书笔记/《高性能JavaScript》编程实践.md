### 避免双重求值

>JavaScript像其他很多脚本语言一样，允许你在程序中提取一个包含代码的字符串，然后动态执行它。有四种方法可以实现：
- eval()
- Funciton()构造函数
- setTimeout()
- setInterval()
```javascript
let num1 = 5,
   num2 = 6,
   
   result = eval('num1 + num2'),
   
   sum = new Function('arg1', 'arg2', 'return arg1 + arg2');
   
setTimeout('sum = num1 + num2', 100);

setInterval('sum = num1 + num2', 100);
```
当你在JavaScript代码中执行另一段JavaScript代码时，都会导致双重求值的性能消耗。此代码会首先以正常方式求值，然后在执行过程中对包含于字符串中的代码发起另一个求值运算。

### 避免重复工作
最常见的重复工作就是浏览器探测:

```javascript
function addHandler(target, eventType, handler) {

    if (target.addEventListener) { // DOM2 Events
        target.addEventListener(eventType, handler, false);
    } else { // IE
        target.attachEvent('on' + eventType, handler);
    }
}

function removeHandler(target, eventType, handler) {

    if (target.removeEventListener) {
        target.removeEventListener(eventType, handler, false);
    } else { 
        target.detachEvent('on' + eventType, handler);
    }
}
```
#### 消除重复工作的方法

- 延迟加载
  ```javascript
  function addHandler(target, eventType, handler) {
  
    // 复写现有函数
    if (target.addEventListener) { // DOM2 Events
        addHandler = function (target, eventType, handler) {
            target.addEventListener(eventType, handler, false);
        };
    } else { // IE
        addHandler = function (target, eventType, handler) {
            target.attachEvent('on' + eventType, handler);
        };
    }
  
    // 调用新函数
    addHandler(target, eventType, handler);
  }
  
  function removeHandler(target, eventType, handler) {
  
    // 复写现有函数
    if (target.removeEventListener) {
        removeHandler = function (target, eventType, handler) {
            target.removeEventListener(eventType, handler, false);
        };
    } else { 
        removeHandler = function (target, eventType, handler) {
            target.detachEvent('on' + eventType, handler);
        };
    }
  
    // 调用新函数
    removeHandler(target, eventType, handler);
  }
  ```
- 条件预加载
  ```javascript
  var addHandler = document.body.addEventListener ?
                 function(target, eventType, handler){
                    target.addEventListener(eventType, handler, false);
                 } :
                 function(target, eventType, handler){
                    target.attachEvent('on' + eventType, handler);
                 };
  ```

### 位操作

>JavaScript中的数字都依照IEEE-754标准以64位格式存储。在位操作中，数字被转换为有符号的32位格式。

``2的4次幂 = 1<<4 ``