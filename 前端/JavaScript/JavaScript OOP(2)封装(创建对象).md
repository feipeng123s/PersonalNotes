>  最简单的创建对象的方式就是通过Object的构造函数或者对象字面量，但这两种方式在使用同一个接口创建多个对象时会产生大量重复代码。

## 工厂模式

```javascript
function createPerson(name, age, job) {
  var o = new Object();
  o.name = name;
  o.age = age;
  o.job = job;
 	o.sayName = function() {
    alert(this.name);
  }
  return o;
}

var person = createPerson('zhangsan', 20, 'FrontEnd Engineer');
```

> 工厂模式解决了创建多个相似对象的问题，但没有解决对象识别的问题（即怎样知道一个对象的类型）。

## 构造函数模式

```javascript
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = function() {
    alert(this.name);
  }
}

var person = new Person('zhangsan', 20, 'FrontEnd Engineer');
```

要创建Person的新实例，必须使用new操作符。通过new调用构造函数会经历一下4个步骤：

1. 创建一个新对象
2. 指定该对象的构造函数(constructor)为当前函数
3. 将构造函数的作用域赋给新对象（this就指向了这个新对象）
4. 如果该函数没有返回对象，返回新对象

> 构造函数模式解决了工厂模式的问题，但是也有缺点，它的主要问题是每个方法都要在每个实例上重新创建一遍。

## 原型模式

> 每个函数都有一个prototype（原型）属性，它的用途是包含可以由特定类型的所有实例共享的属性和方法。

```javascript
function Person() {
}
Person.prototype.name = 'zhangsan';
Person.prototype.age = 20;
Person.prototype.job = 'FrontEnd Engineer';
Person.prototype.sayName = function() {
  alert(this.name);
}

var person = new Person('zhangsan', 20, 'FrontEnd Engineer');
```

> 缺点：原型中的所有属性是被很多实例共享的，这种共享对于函数非常合适。

## 组合使用构造函数和原型模式

```javascript
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
}
Person.prototype.sayName = function() {
  alert(this.name);
}

var person = new Person('zhangsan', 20, 'FrontEnd Engineer');
```

> 这种模式是目前在ECMAScript中使用最广泛，认同度最高的一种创建自定义类型的方法。

## 动态原型模式

> 把所有信息都封装在了构造函数中，在构造函数中初始化原型（仅在必要的情况下）。

```javascript
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
  if (typeof this.sayName !== 'function') {
    Person.prototype.sayName = function() {
      alert(this.name);
    }
  }
}

var person = new Person('zhangsan', 20, 'FrontEnd Engineer');
```

## 寄生构造函数模式

> 基本思想是创建一个函数，该函数的作用仅仅是封装创建对象的代码，然后再返回新创建的对象；但从表面上看，这个函数又很像是典型的构造函数。除了使用new操作符并把使用的包装函数叫做构造函数之外，这个模式跟工厂模式其实是一摸一样的。

```javascript
function Person(name, age, job) {
  var o = new Object();
  o.name = name;
  o.age = age;
  o.job = job;
 	o.sayName = function() {
    alert(this.name);
  }
  return o;
}

var person = new Person('zhangsan', 20, 'FrontEnd Engineer');
```

**注意**：使用这种模式返回的对象与构造函数或者构造函数的原型属性之间没有关系；也就是说，构造函数返回的对象与在构造函数外部创建的对象没有什么不同。（请优先使用其它模式）

## 稳妥构造函数模式

> 稳妥对象：没有公共属性，且其方法也不引用this的对象。
>
> 稳妥构造函数遵循与寄生构造函数类似的模式，但有两点不同：
>
> 1. 创建新对象的实例方法不引用this
>
> 2. 不使用new操作符调用构造函数

```javascript
function Person(name, age, job) {
  var o = new Object();
  // 可以在这里定义私有变量和函数
  
  // 添加方法
 	o.sayName = function() {
    alert(name);
  }
  return o;
}

var person = Person('zhangsan', 20, 'FrontEnd Engineer');
console.log(person.sayName());
```

稳妥构造函数模式提供的这种安全性，使得它非常适合在某些安全执行环境下使用。