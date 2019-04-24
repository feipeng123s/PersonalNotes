# bind函数

## 定义

`Function.prototype.bind()`方法创建一个新的函数，在调用时设置`this`关键字为提供的值。并在调用新函数时，将给定参数列表作为原函数的参数序列的前若干项。

## 语法

```javascript
function.bind(thisArg[, arg1[, arg2[, ...]]])
```

**参数**

`thisArg`

调用绑定函数时作为`this`参数传递给目标函数的值。

`arg1, arg2, ...`

当目标函数被调用时，预先添加绑定函数的参数列表中的参数。

**返回值**

返回一个原函数的拷贝，并拥有指定的`this`值和初始参数。

## 应用

### 创建绑定函数

```javascript
var module = {
  x: 42,
  getX: function() {
    return this.x;
  }
}
var boundGetX = unboundGetX.bind(module);
console.log(boundGetX()); // 42
```



### 偏函数

```javascript
function add(a, b, c) {
    return a + b + c;
}
function newAdd = add.bind(null, 1);
newAdd(2, 3); // 6
```



### 配合setTimeout使用

> 在默认情况下，使用 `window.setTimeout()`时，回调函数中的`this` 关键字会指向 `window` （或`global`）对象。当类的方法中需要 `this` 指向类的实例时，你可能需要显式地把 `this` 绑定到回调函数，就不会丢失该实例的引用。

```javascript
function Foo() {
    this.name = 'foo';
}
Foo.prototype.test = function() {
    setTimeout(this.outputThis(), 1000);
    setTimeout(this.outputThis.bind(this), 1000);
}
Foo.prototype.outputThis = function() {
    console.log(this);
}

let foo = new Foo();
foo.test();
```



### 作为构造函数使用的绑定函数

> 使用`new`操作符去构造一个由目标函数创建的新实例。



## 实现一个bind函数

```javascript
  Function.prototype.mybind = function () {
    if (typeof this !== 'function') {
      throw new TypeError('bind方法必须由函数调用');
    }

    var funcToBind = this,
      objToBind = arguments[0]
      funcArgs = Array.prototype.slice.call(arguments, 1),
      console.log(funcArgs);
      fBound = function() {
        return funcToBind.apply(this instanceof fBound
          ? this
          : objToBind,
          funcArgs.concat(Array.prototype.slice.call(arguments)));
      }

    // 当绑定函数作作为构造函数调用时，维护原型
    // 创建一个空函数的目的是以防this.prototype不存在？
    // 直接让fBound.prototype = this.prototype貌似也是可以的
    var funcNOP = function () {};
    if (this.prototype) {
      funcNOP.prototype = this.prototype;      
    }
    
    fBound.prototype = new funcNOP();
    return fBound;
  };
```



# call/apply函数

## 定义及语法

> `call()` 方法使用一个指定的 `this` 值和单独给出的一个或多个参数来调用一个函数。
>
> `apply()` 方法调用一个具有给定`this`值的函数，以及作为一个数组（或类似数组对象）提供的参数。
>
> 它们的区别就是`call()`方法接受的是**参数列表**，而`apply()`方法接受的是**一个参数数组**。

```javascript
fun.call(thisArg, arg1, arg2, ...)
         
func.apply(thisArg, [argsArray])
```

## 应用

### 在不返回新数组的情况下向数组中添加数组

```javascript
var array = ['a', 'b'];
var elements = [0, 1, 2];
array.push.apply(array, elements);
console.info(array); // ["a", "b", 0, 1, 2]
```

添加数组使用concat方法也可以做到，但是concat函数会创建并返回一个新的数组。

### 在某些本来需要写成遍历数组变量的任务中使用内建的函数

```javascript
var numbers = [5, 6, 2, 3, 7];

/* 应用(apply) Math.min/Math.max 内置函数完成 Math.max([value1[, value2[, ...]]])	 */
var max = Math.max.apply(null, numbers); 
var min = Math.min.apply(null, numbers);
```

如果用上面的方式调用`apply`，会有超出JavaScript引擎的参数长度限制的风险

如果你的参数数组可能非常大，那么推荐使用这种策略来处理：将参数数组切块后循环传入目标方法

```javascript
function minOfArray(arr) {
  var min = Infinity;
  var QUANTUM = 32768;

  for (var i = 0, len = arr.length; i < len; i += QUANTUM) {
    var submin = Math.min.apply(null, arr.slice(i, Math.min(i + QUANTUM, len)));
    min = Math.min(submin, min);
  }

  return min;
}

var min = minOfArray([5, 6, 2, 3, 7]);
```

### 借用构造函数实现继承

```javascript
function Product(name, price) {
  this.name = name;
  this.price = price;
}

function Food(name, price) {
  Product.call(this, name, price);
  this.category = 'food';
}s
```

