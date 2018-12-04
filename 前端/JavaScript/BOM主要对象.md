## window

> 在浏览器中，window具有双重角色，它既是通过JavaScript访问浏览器窗口的一个接口，有事ECMAScript规定的Global对象。



使用var声明的全局变量（window属性）有一个名为[[Configurable]]的特性，这个特性的值被设置为`false`，因此这样定义的属性不可以通过delete操作符删除。而直接定义在window对象上的属性可以。

let声明的全局变量不再是window对象的属性

> 为了保持兼容性，`var`命令和`function`命令声明的全局变量，依旧是顶层对象的属性；另一方面规定，`let`命令、`const`命令、`class`命令声明的全局变量，不属于顶层对象的属性。也就是说，从 ES6 开始，全局变量将逐步与顶层对象的属性脱钩。

- top对象：指向浏览器窗口
- parent对象：始终指向当前框架（frame）的直接上层框架
- `clientWidth`、`clientHeight`
- 使用`window.open()`方法既可以导航到一个特定的URL，也可以打开一个新的浏览器窗口
- `alert()`、`confirm()`、`prompt()`

## location

- `window.location`和`document.location`引用的是同一个对象。
- `location.search`返回问好到URL末尾的所有内容
- `location.assign()`方法等价于直接给`location.href`或`window.location`设置一个URL值
- `location.replace()`
- `location.reaload()`接受一个boolean参数，表示是否从服务器重新加载



## navigator

`navigator.userAgent`浏览器用户代理字符串

## history

- `history.go()`
- `history.back()`
- `history.forward()`
- `history.lenght`保存的历史记录数量