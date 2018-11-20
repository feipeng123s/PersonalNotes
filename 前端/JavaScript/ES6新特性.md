# JS相关知识点积累

## 一、解构

> **解构赋值**是一个Javascript表达式，这使得可以将**值从数组**或**属性从对象**提取到不同的变量中。

[MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#%E8%A7%A3%E6%9E%84%E5%AF%B9%E8%B1%A1)

### 解构数组

- 默认值：为了防止从数组中取出一个值为`undefined`的对象，可以为这个对象设置默认值 

  ```javascript
  var a, b; 
  [a=5, b=7] = [1];
  ```

- 变换变量（等同于swap）

  ```javascript
  var a = 1;
  var b = 3;
  [a, b] = [b, a];
  ```


### 解构对象

- 无声明赋值

  ```javascript
  var a, b;
  ({a, b} = {a: 1, b: 2});
  // 你的( .. ) 表达式需要一个分号在它前面，否则它也许会被当成上一行中的函数来执行。
  ```

- 默认值

  > 生效的条件是，对象的属性值严格等于`undefined`



## 剩余参数Rest

> 如果函数的最后一个命名参数以`...`为前缀，则它将成为一个数组，其中从`0`（包括）到`theArgs.length`（排除）的元素由传递给函数的实际参数提供 

