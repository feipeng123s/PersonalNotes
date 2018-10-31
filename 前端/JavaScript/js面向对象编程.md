## OOP

> JS对象在底层就是一个关联数组

#### 封装——创建对象

```javascript
// 1.使用直接量
var obj = {}
// 2.使用new
var obj = new Object()
// 3.使用构造函数（规定一类对象统一结构的函数）
```

#### 继承

##### 原型对象

- 创建

  > 定义构造函数的同时，已经自动创建了该类型的原型对象；构造函数的prototype属性指向原型对象；原型对象的constructor指回构造函数。

  每创建一个新子对象，都会自动设置子对象的\_\_proto__继承构造函数的原型对象

- 添加成员

  > 构造函数.prototype.成员=值 

##### 原型链

> 当谈到继承时，JavaScript 只有一种结构：对象。每个实例对象（object ）都有一个私有属性（称之为 \_\_proto__）指向它的原型对象（**prototype**）。该原型对象也有一个自己的原型对象 ，层层向上直到一个对象的原型对象为 `null`。根据定义，`null` 没有原型，并作为这个**原型链**中的最后一个环节。 

- 作用域链中的变量不用.可直接访问；原型链上的属性必须用“对象.”才能访问。
- 通过原型链判断对象类型

##### Object.create()

```javascript
// 语法
Object.create(proto, [propertiesObject])

var child=Object.create(father,{
    //defineProperties
    属性名:{四大特性},
          ... : ...
})

var o;
// 创建一个原型为null的空对象
o = Object.create(null);

o = {};
// 以字面量方式创建的空对象就相当于:
o = Object.create(Object.prototype);

// 模拟实现Object.create()
Object.create = function(father,props){
    var Fun = function(){};
    Fun.prototype = father;
    var child = new Fun();
    
    if(props!=undefined){
        for(var key in props){
            child[key]=props[key].value;
        }
    }
    return child;
}
```

[props参数参见](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties)

#### 多态

> 方法重载与重写

### 属性描述符

> 描述符必须是以下这两种形式之一；不能同时是两者 。
>
> 如果一个描述符不具有value,writable,get 和 set 任意一个关键字，那么它将被认为是一个数据描述符 

#### 数据描述符

[参考链接](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

> **数据描述符**是一个具有值的属性，该值可能是可写的，也可能不是可写的 

- configurable
- enumerable
- value
- writable

#### 存取描述符

>**存取描述符**是由getter-setter函数对描述的属性 

- configurable
- enumerable
- get
- set

## Function

### 创建

- 直接声明

  ```javascript
  function fun(args){
      函数体;
      return 返回值;
  }
  // 缺点：会被声明提前，打乱程序执行顺序
  ```

  >变量提升：在开始执行程序前，引擎会首先查找var声明的变量和function声明的函数，将其提前到当前作用域的顶部集中创建，赋值留在原——[参考链接](https://developer.mozilla.org/zh-CN/docs/Glossary/Hoisting)

- 赋值

  ```
  var 函数名 = function(){}
  ```

- new

  ```
  var 函数名=new Function("参数名1","参数名2",...,"函数体; return 返回值")
  ```

### 作用域

> 变量的可用范围

- 全局作用域（window）
- 函数作用域（AO）

### 作用域链

> 由各级作用域逐级引用，形成的链式结构，保存着所有的变量，控制着变量的使用顺序

### 闭包

>形成原因：外层函数调用后，外层函数的作用域对象(AO)，无法释放，被内层函数对象的scope引用着

## Error

