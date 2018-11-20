## 严格模式(use strict)

> 严格模式可以应用到**整个脚本**或**个别函数**中。不要在封闭大括弧 `{}` 内（代码块内）这样做，在这样的上下文中这么做是没有效果的。 

### 严格模式中的变化

- 禁止给未声明的变量赋值
- 静默失败升级为错误（删除不可删除的属性、函数参数名不唯一等）
- 禁止八进制数字语法
- ECMAScript 6中的严格模式禁止设置[primitive](https://developer.mozilla.org/en-US/docs/Glossary/primitive)值的属性 
- 禁用with
-  arguments, arguments.callee不推荐使用
- 对于一个开启严格模式的函数，指定的`this`不再被封装为对象，而且如果没有指定`this`的话它值是`undefined` 
- 待续......



## 对象

### 属性

#### 命名属性

> 可直接用属性访问器（.   []）访问到的属性

##### 数据属性

> 实际存储属性值得属性

- 四大特性

  - value：属性值
  - writable：true/false是否可修改
  - enumerable：true/false是否可被for-in遍历
  - configurable：true/false是否可被删除，是否可修改前两个属性（一旦更改为false，不可逆）

- 获取四大属性

  ```javascript
  var obj = {
      a: 1,
      b: 'haha'
  };
  var attr = Object.getOwnPropertyDescriptor(obj,'a');
  console.log(attr); 
  // 输出为：{ value: 1, writable: true, enumerable: true, configurable: true }
  ```

- 修改四大属性

  ```javascript
  //修改一个属性的四大特性
  Object.defineProperty(obj,'a',{writable: false});
  
  //修改多个属性的四大特性
  Object.defineProperties(obj,{
      a: {
          enumerable: false
      },
      b: {
          enumerable: false
      }
  });
  
  console.log(Object.getOwnPropertyDescriptor(obj,'a')); 
  // { value: 1, writable: false, enumerable: false, configurable: true }
  
  console.log(Object.getOwnPropertyDescriptor(obj,'b'));
  // { value: 'haha', writable: true, enumerable: false, configurable: true }
  ```

- 四大属性默认值

  - 用.添加的新属性，特性的默认值为true
  - 用defineProperty/defineProperties添加的新属性，特性默认值为false


##### 访问器属性

> 不存储数据，专门提供对其他数据/变量的保护

- 试图用访问器属性读取受保护的值时，自动调用get方法
- 视图用访问器属性修改受保护的值时，自动调用set方法
- 如省略set方法，则相当于只读属性

#### 内部属性

> 不能用属性访问器（.   []）访问到的属性

- \_\_proto\_\_

  ```
  Object.getPrototypeOf(obj);
  Object.setPrototypeOf(obj, prototype);
  ```

#### 防扩展

> 禁止添加新属性

  ```
extensible:true/false
Object.isExtensible(obj);
Object.preventExtensions(obj); //设置extensible为false
  ```

#### 密封

> 防扩展的同时禁止删除现有属性（configurable:false）

```
Object.isSealed(obj);
Object.seal(obj); // 密封对象
```

#### 冻结

> 在密封的同时禁止修改所有属性的值（writable:false）

```
Object.Object.isFrozen(obj);
Object.freeze(obj); // 冻结对象
```



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
  ```

  [参考链接](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)