在Array原型中，有很多好用的高阶函数可以使用，如： `Array.forEach()`, `Array.every()`, `Array.some()`, `Array.filter()`等，但是我们无法用它们直接来处理如`querySelectorAll()`,`childNodes`等返回的`NodeList`类型

### NodeList vs Array

NodeList和Array是两个完全不同的东西，NodeList事实上并不是JavaScript中的API，而是浏览器提供的用于访问DOM元素的API，其它语言也可以访问它。

### 如何将NodeList转化为Array

- `Array.prototype.slice()`

  ```javascript
  // Get all buttons as a NodeList
  var btns = document.querySelectorAll('button');
  
  // Convert buttons NodeList to an array
  var btnsArr = Array.prototype.slice.call(btns);
  ```

- `Array.from()`它可以从类数组对象中创建一个新数组

  ```javascript
  // Get all buttons as a NodeList
  var btns = document.querySelectorAll('button');
  
  // Convert buttons NodeList to an array
  var btnsArr = Array.from(btns);
  ```

  

