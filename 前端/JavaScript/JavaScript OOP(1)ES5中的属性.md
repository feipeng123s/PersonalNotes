## 属性类型

> ECMAScript中有两种属性：数据属性和访问器属性。

### 数据属性

- 定义

  > 数据属性我们可以理解为我们平时定义对象时赋予的属性，它包含一个数据值的位置，在这个位置可以进行读取和写入值。

- 数据属性的四大特性

  > ES5中定义了一些特性，这些特性是用来描述属性的各种特征，特性是内部值，不能直接访问到。特性通过用两对方括号表示，比如`[[Enumerable]]`。属性的特性会有一些默认值，要修改特性的默认值，必须使用ES5定义的新方法`Object.defineProperty`方法来修改。

  - value：属性的值
  - writable：true/false是否可修改
  - enumerable：true/false是否可通过for-in来枚举出属性
  - configurable：true/false是否可被delete删除，是否可修改前两个属性（一旦更改为false，不可逆）

- 四大特性默认值

  - 使用`defineProperty/defineProperties`定义的属性，在未指定这些特性值时，默认为false和undefined
  - 使用`.`添加的属性，或者直接通过字面量定义的属性，特性值默认为true和给定的value

- 获取数据属性的特性值

  ```javascript
  var obj = {
      a: 1,
      b: 'haha'
  };
  var attr = Object.getOwnPropertyDescriptor(obj,'a');
  console.log(attr); 
  // 输出为：{ value: 1, writable: true, enumerable: true, configurable: true }
  ```

- 修改数据属性的特性值

  ```javascript
  //修改一个属性的内部属性
  Object.defineProperty(obj,'a',{writable: false});
  
  //修改多个属性的内部属性
  Object.defineProperties(obj,{
      a: {
          enumerable: false
      },
      b: {
          enumerable: false
      }
  });
  
  console.log(Object.getOwnPropertyDescriptor(obj,'a')); // { value: 1, writable: false, enumerable: false, configurable: true }
  
  console.log(Object.getOwnPropertyDescriptor(obj,'b')); // { value: 'haha', writable: true, enumerable: false, configurable: true }
  ```

  

### 访问器属性

> 访问器属性不包含数据值，和数据属性的区别在于，它没有数据属性的[[Writable]]和[[Value]]两个特性，而是拥有一对getter和setter函数。
>
> [[Get]]：读取属性时调用的函数，默认是undefined
> [[Set]]：设置属性时调用的函数，默认是undefined

- getters和setters允许你定义对象访问器（计算属性）

  ```javascript
  var person = {
    firstName: "John",
    lastName : "Doe",
    get fullName() {
      return this.firstName + " " + this.lastName;
    }
  };
  console.log(person.fullName); // John Doe
  console.log(person);
  ```

  输出结果如下图：
  ![](/Users/feipeng123s/Documents/Code/PersonalNotes/%E5%89%8D%E7%AB%AF/JavaScript/img/ES5-output1.png)

  ```javascript
  var person = {
    firstName: "John",
    lastName : "Doe",
    language : "NO",
    get lang() {
      return this.language;
    },
    set lang(value) {
      this.language = value;
    }
  };
  
  person.lang = 'EN';
  console.log(person.lang); // EN
  console.log(person.language); // EN
  console.log(Object.getOwnPropertyDescriptor(person, 'lang')); // {get: ƒ, set: ƒ, enumerable: true, configurable: true}
  ```

- `Object.defineProperty()` 方法也可以用来定义访问器属性

  ```javascript
  // Define object
  var person = {
    firstName: "John",
    lastName : "Doe",
    language : "EN" 
  };
  
  // Change a Property
  Object.defineProperty(person, "language", {
    get : function() { return language },
    set : function(value) { language = value.toUpperCase() }
  });
  
  // Define a new Property
  Object.defineProperty(person, "age", {
    get : function() { return age },
    set : function(value) { age = value }
  });
  
  // Define a computed Property
  Object.defineProperty(person, "fullName", {
    get : function () {return this.firstName + " " + this.lastName;}
  });
  
  person.age = 18;
  person.language = 'haha';
  console.log(person);
  ```

  输出结果如下图，可以看到，在对象中出现了对应的get、set，与第一种方式定义的结果类似

  ![](/Users/feipeng123s/Documents/Code/PersonalNotes/%E5%89%8D%E7%AB%AF/JavaScript/img/ES5-output2.png)

  

- 试图用访问器属性读取受保护的值时，自动调用get方法

- 试图用访问器属性修改受保护的值时，自动调用set方法

- 严格模式下，必须同时设置get和set

- 非严格模式下，可以只设置其中一个，如果只设置get，则属性是只读的，如果只设置set，属性则无法读取

### 防扩展，密封，冻结

#### 防扩展

> - 无法添加新属性，但可以删除已有属性
> - 原型对象上还是可以添加属性的

```
Object.isExtensible(obj);
Object.preventExtensions(obj); 
```

#### 密封

> - 无法添加新属性或删除已有属性
> - 无法修改除了value以外的四大特性

```
Object.isSealed(obj);
Object.seal(obj); // 密封对象
```

#### 冻结

> 无法添加、删除、修改属性（包括四大特性），即这个对象无法被修改。

```
Object.isFrozen(obj);
Object.freeze(obj); // 冻结对象
```

