###继承分类

- 基于对象的继承
- 基于类型的继承

###细分

- 原型链继承

  > 把子类的prototype设置为父类的实例，即完成了继承

  ```javascript
  function Person (name, age) {
      this.name = name || 'unknow'
      this.age = age || 0
  }
  
  Person.prototype.say = function() {
      console.log('I am a person')
  }
  
  function Student (name) {
      this.name = name
      this.score = 80
  }
  
  Student.prototype.study = function () {
      console.log('I am studing')
  }
  
  Student.prototype = new Person()
  
  var stu = new Student('lucy')
  
  console.log(stu.name)  // lucy    --子类覆盖父类的属性
  console.log(stu.age)   // 0       --父类的属性
  console.log(stu.score) // 80      --子类自己的属性
  stu.say()              // I am a person      --继承自父类的方法
  stu.study()            // I am studing       --子类自己的方法
  ```

  缺点：属性如果是引用类型的话，子类会共享引用类型

- 构造函数继承

  > 借用父类的构造函数来增强子类实例，等于是复制父类的实例属性给子类 。这是所有继承中唯一一个不涉及到prototype的继承。 

  ```javascript
  Person.call(this)
  ```

  缺点：

  - 父类的方法不能复用，子类实例的方法每次都是单独创建的 
  - 子类实例，继承不了父类原型上的属性。(因为没有用到原型)

- 组合继承

  > 原型式继承和构造函数继承的组合，兼具了二者的优点 

  ```javascript
  // 父类
  function Person() {
      this.hobbies = ['music','reading']
      this.fun = function(){console.log('fun')}
  }
  
  // 父类函数
  Person.prototype.say = function() {console.log('I am a person')}
  
  // 子类
  function Student(){
      Person.call(this)             // 构造函数继承(继承属性覆盖原型链中的属性)
  }
  // 继承
  Student.prototype = new Person()  // 原型链继承(继承方法)
  
  Student.prototype.constructor = Student(); //上一句导致重写了原型对象，所以要重新指定constructor的指向。
  
    // 实例化
  var stu1 = new Student()
  var stu2 = new Student()
  
  stu1.hobbies.push('basketball')
  console.log(stu1.hobbies)           // music,reading,basketball
  console.log(stu2.hobbies)           // music,reading
  
  console.log(stu1.say === stu2.say) // true
  ```

  缺点：调用了2次父类的构造方法，会存在一份多余的父类实例属性 

- 原型式继承

  > 其思想是借助原型，可以基于已有的对象创建新的对象，同时还不用创建自定义类型。 

  ```javascript
  function object(o){
    function F(){}
    F.prototype = o;
    return new F();
  }
  
  var person = {
      name: "Nicholas",
      friends: ["Shelby", "Court", "Van"]
  };
  
  var anotherPerson = object(person);
  anotherPerson.name = "Greg";
  anotherPerson.friends.push("Rob");
  
  var yetAnotherPerson = object(person);
  yetAnotherPerson.name = "Linda";
  yetAnotherPerson.friends.push("Barbie");
  alert(person.friends);   //"Shelby,Court,Van,Rob,Barbie"
  ```

  

  缺点：

  - 父类的引用属性会被所有子类实例共享
  - 子类构建实例时不能向父类传递参数

- 寄生式继承

  > 寄生继承的思想是创建一个用于封装继承过程的函数，该函数在内部以某种方式来增强对象 

  ```javascript
  function createAnother(original){ 
      var clone=object(original);    //通过调用函数创建一个新对象
      clone.sayHi = function(){      //以某种方式来增强这个对象
          alert("hi");
      };
      return clone;                  //返回这个对象
  }
  
  var person = {
      name: "Nicholas",
      friends: ["Shelby", "Court", "Van"]
  };
  
  var anotherPerson = createAnother(person);
  anotherPerson.sayHi(); //"hi"
  ```

  

- 寄生组合继承

  ```javascript
  function inheritPrototype(subType, superType){
      var prototype = object(superType.prototype); // 创建了父类原型的浅复制
      prototype.constructor = subType;             // 修正原型的构造函数
      subType.prototype = prototype;               // 将子类的原型替换为这个原型
  }
  
  function SuperType(name){
      this.name = name;
      this.colors = ["red", "blue", "green"];
  }
  
  SuperType.prototype.sayName = function(){
      alert(this.name);
  };
  
  function SubType(name, age){
      SuperType.call(this, name);
      this.age = age;
  }
  // 核心：因为是对父类原型的复制，所以不包含父类的构造函数，也就不会调用两次父类的构造函数造成浪费
  inheritPrototype(SubType, SuperType);
  SubType.prototype.sayAge = function(){
      alert(this.age);
  }
  ```

  

  ```javascript
  function Parent(name) {
      this.name = name; // 实例基本属性 (该属性，强调私有，不共享)
      this.arr = [1]; // (该属性，强调私有)
  }
  Parent.prototype.say = function() { // --- 将需要复用、共享的方法定义在父类原型上 
      console.log('hello')
  }
  function Child(name,like) {
      Parent.call(this,name,like) // 核心  
      this.like = like;
  }
  Child.prototype = Object.create(Parent.prototype) // 核心  通过创建中间对象，子类原型和父类原型，就会隔离开。
  
  <!--这里是修复构造函数指向的代码-->
  Child.prototype.constructor = Child
  
  let boy1 = new Child('小红','apple')
  let boy2 = new Child('小明','orange')
  let p1 = new Parent('小爸爸')
  ```

  完美解决之前的问题

  
