## ES5新特性概览

参见：https://www.w3schools.com/js/js_es5.asp

![](./img/ES5.png)

## 严格模式(use strict)

> 严格模式可以应用到**整个脚本**或**个别函数**中。不要在封闭大括弧 `{}` 内（代码块内）这样做，在这样的上下文中这么做是没有效果的。 

在使用严格模式时：

- 禁止给未声明的变量赋值
- 静默失败升级为错误（删除不可删除的属性、函数参数名不唯一等）
- 禁止八进制数字语法
- ECMAScript 6中的严格模式禁止设置[primitive](https://developer.mozilla.org/en-US/docs/Glossary/primitive)值的属性 
- 禁用with
-  arguments, arguments.callee不推荐使用
- 对于一个开启严格模式的函数，指定的`this`不再被封装为对象，而且如果没有指定`this`的话它值是`undefined` 
- [更多...](https://www.w3schools.com/js/js_strict.asp)





## Function

> 只要函数中的this不是想要的，就可用call/apply/bind替换

### Function.prototype.call() &&Function.prototype.apply()

> 二者的作用完全一样，只是接受参数的方式不太一样 。call 和 apply 都是为了改变某个函数运行时的 context 即上下文而存在的，换句话说，就是为了改变函数体内部 this 的指向。 当一个object没有某个方法，但是其他的有，我们可以借助call或apply用其它对象的方法来操作。 

```javascript
fun.call(thisArg, arg1, arg2, ...)
func.apply(thisArg, [argsArray])

// 示例
function Product(name, price) {
  this.name = name;
  this.price = price;
}

function Food(name, price) {
  Product.call(this, name, price);
  this.category = 'food';
}

console.log(new Food('cheese', 5).name);
// expected output: "cheese"
```



### Function.prototype.bind()

> **`bind()`**方法创建一个新的函数, 当被调用时，将其`this`关键字设置为提供的值，在调用新函数时，在任何提供之前提供一个给定的参数序列。 

```javascript
var module = {
  x: 42,
  getX: function() {
    return this.x;
  }
}

var unboundGetX = module.getX;
console.log(unboundGetX()); // The function gets invoked at the global scope
// expected output: undefined

var boundGetX = unboundGetX.bind(module);
console.log(boundGetX());
// expected output: 42
```





## ES5中的数组API

- **Array.prototype.every()**

  > every（）方法测试数组中的所有元素是否都通过了由提供的函数实现的测试。

  ```javascript
  // arr.every(callback[, thisArg])
  var arr = [1,2,3,4,5,6,7,8,9,0];
  var result1 = arr.every(function(currentValue,index,array){
      return currentValue%2 === 0;
  });
  console.log(result1); // false
  ```

  空数组调用该方法时始终返回true

- **Array.prototype.some()**

  > some（）方法测试数组中是否至少有一个元素通过了由提供的函数实现的测试。

  ```javascript
  // arr.some(callback[, thisArg])
  var result2 = arr.some(function(currentValue,index,array){
      return currentValue >= 0;
  });
  console.log(result2); // true
  ```

  空数组调用该方法时始终返回false

- **Array.prototype.forEach()**

  > forEach（）方法为每个数组元素执行一次提供的函数。

  ```javascript
  arr.forEach(function(currentValue,index,array){
      console.log(currentValue);
  });
  ```

- **Array.prototype.map()**

  > map（）方法创建一个新数组，其结果是在调用数组中的每个元素上调用提供的函数。

  ```javascript
  var result3 = arr.map(function(currentValue,index,array){
      return  ++currentValue;
  });
  console.log(result3); // [ 2, 3, 4, 5, 6, 7, 8, 9, 10, 1 ]
  ```

- **Array.prototype.filter()**

  > filter（）方法创建一个新数组，其中包含通过所提供函数实现的测试的所有元素。

  ```javascript
  var result4 = arr.filter(function(currentValue,index,array){
      return currentValue > 5;
  })
  console.log(result4); // [ 6, 7, 8, 9 ]
  ```

- **Array.prototype.reduce()**

  > reduce（）方法对累加器和数组中的每个元素（从左到右）应用函数以将其减少为单个值。

  ```javascript
  var result5 = arr.reduce(function(accumulator,currentValue,index,array){
      return accumulator + currentValue;
  });
  console.log(result5); // 45
  // 若未给accumulator设置初始值，默认取数组的第一项作为初始值，但在数组为空时会报错。
  // 设置初始值：arr.reduce(callback[, initialValue])。
  // 未设置初始值，从index=1开始遍历；设置了初始值，从index=0开始遍历。
  ```

  [利用reduce方法实现分组汇总](https://stackblitz.com/edit/js-rjenmk)



## 其它新的Object方法

- `Object.getPrototypeOf(obj)`：原型对象`__proto__`
- `Object.getOwnPropertyNames(object)`：获取自有属性，返回一个数组
- `Object.keys(object)`：获取enumerable为true的属性，返回一个数组



参考文章

[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)

[详解JavaScript中的Object对象](http://www.cnblogs.com/lrzw32/p/5225218.html)