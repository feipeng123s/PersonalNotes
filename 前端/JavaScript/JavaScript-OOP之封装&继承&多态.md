## 面向对象三大特性

- 封装
- 继承
- 多态



## 封装

> 将一个事物的属性和功能集中定义在一个对象（类）中，我们称之为封装。



### 在JavaScript中实现类

#### 通过构造函数实现

通过定义构造函数的形式来定义一个**对象类型**，通过`new`通过操作符来创建**对象实例**。

- 简单示例

    ```javascript
    function Car(make, model, year) {
        this.make = make;
        this.model = model;
        this.year = year;
    }
    
    var car1 = new Car('Eagle', 'Talon TSi', 1993);
    console.log(car1.make); // Eagle
    ```
    
- 对象属性为其它对象

    ```javascript
    function Person(name, age, sex) {
       this.name = name;
       this.age = age;
       this.sex = sex;
    }
    
    function Car(make, model, year, owner) {
       this.make = make;
       this.model = model;
       this.year = year;
       this.owner = owner;
    }
    
    var ken = new Person("Ken Jones", 39, "M");
    var car2 = new Car("Nissan", "300ZX", 1992, ken);
    ```

- 在构造函数中定义方法

    ```javascript
    function Car(make, model, year) {
        this.make = make;
        this.model = model;
        this.year = year;
        this.getAge = function () {
            var currentYear = new Date().getFullYear();
            return currentYear - this.year;
        };
    }
    
    var car1 = new Car('Eagle', 'Talon TSi', 1993);
    console.log(car1.make); // Eagle
    console.log(car1.getAge);
    ```

    **强烈不推荐**使用上面这种方式在构造函数内定义方法，这样在每次使用`new`实例化对象时，都会产生一个该方法的副本，占用内存空间，这是没有必要的。我们应该将方法定义在构造函数的原型`prototype`中：

    ```javascript
    function Car(make, model, year) {
        this.make = make;
        this.model = model;
        this.year = year;
    }
    Car.prototype.getAge = function () {
        var currentYear = new Date().getFullYear();
        return currentYear - this.year;
    };
    var car1 = new Car('Eagle', 'Talon TSi', 1993);
    console.log(car1.make); // Eagle
    console.log(car1.getAge());
    ```

#### 通过class关键字实现

使用ES6中的`class`关键字来定义类，使用`new`操作符来创建类的实例。

> ES2015中引入的JavaScript类实质上是JavaScript现有的基于原型的继承的语法糖。
>
> 类实际上是个“特殊的函数”，就像你能够定义的函数表达式和函数声明一样，类语法有两个组成部分：类表达式和类声明。

```javascript
class Car{
    constructor(make, model, year) {
        this.make = make;
    	this.model = model;
    	this.year = year;
    }
    // 不需要function关键字
    getAge() {
        var currentYear = new Date().getFullYear();
    	return currentYear - this.year;
    }
}

var car1 = new Car('Eagle', 'Talon TSi', 1993);
console.log(car1.make); // Eagle
console.log(car1.getAge());
```



## 继承

> 通过继承，子类可以使用父类中的一些属性和功能，而无需重复定义。
>
> 由于函数没有签名，在ECMAScript中无法实现接口继承。ECMAScript只支持实现继承，而且其实现继承主要是依靠原型链来实现的。



### 原型和原型链

> JavaScript中每个对象都拥有一个**原型对象(prototype object)**，对象以其原型为模板，从原型继承方法和属性。原型对象也可能有用原型，并从中继承方法和属性，一层一层，以此类推。这种关系常被称为**原型链(prototype chain)**。
>
> 准确地说，这些属性和方法定义在Object的构造函数之上的`prototype`属性上。而非对象实例本身。
>
> 在传统的OOP中，首先定义“类”，此后创建对象实例时，类中定义的所有属性和方法都被复制到实例中。在JavaScript中并不如此复制——而是在对象实例和它的构造器之间建立一个联系（就是`__proto__`属性，是从构造函数的`prototype`属性派生的）,之后通过上溯原型链，在构造器中找到这些属性和方法。

```javascript
console.log(Car.prototype === car1.__proto__); // true
```

上面这段代码表明，`__proto__`属性指向构造函数的`prototype`。



### 构造函数、原型和实例的关系

> 每个构造函数都有一个原型对象(`prototype`)，原型对象都包含一个指向构造函数的指针，而实例都包含一个指向原型对象的内部指针(`__proto__`)。



### 重写原型对象实现继承

```javascript
function Truck(load) {
    // 载重
    this.load = load;
}

Truck.prototype = new Car('JieFang', 'DongFeng', 1960);

var truck1 = new Truck(25);
console.log(truck1.getAge());
```

**存在的问题**：

- 原型指向的实例instance中含有引用类型的属性

  在更改实例instance的应用类型属性（非直接重新赋值），会影响所有继承的实例。

- 原型对象中的属性会被所有实例共享。

  上面这个例子中，所有的Truck实例的name都为'JieFang'，也不能在不影响其它实例的情况下，自定义truck1实例的name属性。这样，我们继承过来的属性就失去了意义。



### 借用构造函数实现继承

```javascript
function Truck(load, make, model, year) {
  Car.call(this, make, model, year);
  this.load = load;
}

var truck1 = new Truck(25, 'JieFang', 'DongFeng', 1960);
console.log(truck1.getAge()); // Uncaught TypeError: truck1.getAge is not a function
```

**存在的问题**：

借用构造函数解决了前面原型链继承的问题，但是方法必须定义在构造函数中，而不是原型对象上，否则就报上面这个错误，但是这就**无法实现函数的复用**了。



### 组合继承

> 使用原型链实现对原型属性和方法的继承，而通过借用构造函数来实现对实例属性的继承。

```javascript
function Truck(load, make, model, year) {
  Car.call(this, make, model, year);
  this.load = load;
}

Truck.prototype = new Car();
Truck.prototype.constructor = Truck;

var truck1 = new Truck(25, 'JieFang', 'DongFeng', 1960);
console.log(truck1.getAge());
```

**存在的问题**：调用了2次父类的构造方法，会存在一份多余的父类实例属性 。



### 原生式继承

> 借助原型可以基于已有的对象创建新对象，同时还不必因此创建自定义类型

```javascript
function object(o) {
    function F() {}
    F.prototype = o;
    return new F();
}
```

本质上讲，object()对传入其中的对象执行了一次浅复制。

ES5通过新增`Object.create()`规范化了原型继承：

```javascript
var truck1 = Object.create(new Car('JieFang', 'DongFeng', 1960));
truck1.load = 25;
console.log(truck1.getAge());
```

> 在没有必要兴师动众地创建构造函数，而只想让一个对象与另一个对象保持类似的情况下，原型式继承是完全可以胜任的。注意：**包含应用类型值的属性始终都会共享相应的值**



### 寄生式继承

> 与原生式继承非常相似，即使基于某个对象或某些信息创建一个对象，然后增强对象，最后返回对象。

```javascript
function createAnother(original) {
    var clone = object(original);
    clone.sayHi = function() {
        alert('hi');
    }
    return clone;
}

var person = {
    name: 'Nicholas',
    friends: ['shelby', 'Court', 'Van']
};
var anotherPerson = createAnother(person);
anotherPerson.sayHi(); // 'Hi'
```



### 寄生组合继承

> 寄生组合继承解决了组合继承所存在的问题（两次调用构造函数）。通过借用构造函数来继承属性，通过原型链的混成形式来继承方法。不必为了子类型的原型而调用超类型的构造函数。

```javascript
function object(o){
  function F(){}
  F.prototype = o;
  return new F();
}

// 用寄生式创建原型对象
function inheritPrototype(subType, superType) {
  var prototype = object(superType.prototype); // 可使用Object.create()代替
  prototype.constructor = subType;
  subType.prototype = prototype;
}

function Truck(load, make, model, year) {
    Car.call(this, make, model, year);
  	this.load = load;
}
inheritPrototype(Truck, Car);

var truck1 = new Truck(25, 'JieFang', 'DongFeng', 1960);
console.log(truck1.getAge());
```



## 多态

> 同一方法，在不同情况下，表现出不同的状态	

- 重载

  JavaScript没有真正意义上的重载，只能在同一个方法中传递不同的参数去模仿重载。

- 重写（override）

  在子对象中重写父对象中的方法。



参考文档：

[MDN——new运算符](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new>)

[MDN——类](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes>)

《JavaScript高级程序设计》——面向对象的程序设计