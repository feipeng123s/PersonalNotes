### 引用类型

- Object类型
- Array类型
- Date类型
- RegExp类型
- Function类型
- 基本包装类型
  - Boolean类型
  - Number类型
  - String类型
- 单体内置对象
  - Global对象
  - Math对象

### 类型检测方式

1. typeof
     > 众所周知，在JavaScript中有`typeof`操作符用来检测类型。虽然在检测基本数据类型时`typeof`是非常得力的助手，但是在检测引用类型的值时。这个操作符的用处不大。通常，我们并不是想知道某个值是对象，而是想知道它是什么类型的对象。为此，ECMAScript提供了`instanceof`操作符，其语法如下所示：

     ```javascript
     result = variable instanceof constructor
     ```
     **使用`typeof`操作符检测函数时，会返回`"function"`**


2. 通过原型链来判断

   ```javascript
   obj.__proto__ = Array.prototype;
   Array.prototype.isPrototypeOf(obj);
   ```

3. 通过构造函数来判断

   ```javascript
   obj.constructor = Array;
   obj instanceof Array;
   ```
   **存在的问题：**根据规定，所有引用类型的值都是Object的实例。因此，在检测一个引用类型值和Object构造函数时，instanceof操作符总会返回true。通过原型链来检测也会有相似的问题。

4. Object.prototype.toString.call(obj)

   **jQuery中就是使用该方法进行类型检测**，推荐使用该方法。

   ```javascript
   var class2type = {
       "[object Boolean]": "boolean",
       "[object Number]": "number",
       "[object String]": "string",
       "[object Function]": "function",
       "[object Array]": "array",
       "[object Date]": "date",
       "[object RegExp]": "regexp",
       "[object Object]": "object",
       "[object Error]": "error",
       "[object Symbol]": "symbol"
   }
   var toString = Object.prototype.toString;
   
   jQuery.type = function (obj) {
       if (obj == null) {
           return obj + "";
       }
       return 
         typeof obj === "object" || typeof obj === "function" ? 
           class2type[toString.call(obj)] || "object" : 
           typeof obj;
   }
   ```

   简写方式：

   ```javascript
   Object.prototype.toString.call(obj).slice(8,-1)
   ```

   

参考：
1. 《JavaScript高级程序设计》第3版 4.4.4节 检测类型

2. [jQuery源码解析](https://github.com/songjinzhong/JQuerySource/tree/master/01-%E6%80%BB%E4%BD%93%E6%9E%B6%E6%9E%84)