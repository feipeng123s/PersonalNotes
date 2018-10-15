RequireJS优化工具主要做两件事：

- 合并相关联的js脚本，并使用UglifyJS（默认）或者Closure Compiler来缩小代码体积
- 通过将``@import``注解引用的css文件插入到一行中和删除注释来优化CSS

###注意事项：

> 优化器只会合并传递给顶级require和define调用的字符串数组中指定的模块，或者在简化的CommonJS上下文中（比如define函数中）通过require('name')调用的模块。所以，它无法找到通过变量名加载的模块：
>
> ```javascript
> // 这段代码中引用的模块不会被合并
> var modules = [
>     'lib/vue',
>     './app'
> ];
> require(modules, function(Vue, App){});
> 
> // 下面这两种方式是可以的
> requrie(['lib/vue', './app']);
> 
> define(['lib/vue', './app'], function(Vue, App) {});
> ```

以上参考[REQUIREJS OPTIMIZER](https://requirejs.org/docs/optimization.html)

### 举例说明

刚开始用r.js时，直接在已有的requirejs项目中配置使用，由于各种原因综合起来出现问题无法解决 ；后面看到司徒正美的教程（[r.js打包——司徒正美](https://www.cnblogs.com/rubylouvre/p/4262569.html)），重新开始一个简单的项目，由简入繁，理解起来就容易了许多。

- 例子1：优化某个指定的js文件

  首先开始一个官方文档中提到过的例子，one,two,three.js

  ```javascript
  // one.js
  define(function(){
      return 1
  })
  ```

  ```javascript
  // two.js
  define(function(){
      return 2;
  })
  ```

  ```javascript
  // three.js
  define(function(require){
      var two = require("two");
      return two + 1;
  })
  ```

  ```javascript
  // main.js
  require(["one", "three"], function (one, three) {
      console.log(one + three);
  });
  ```

  ```javascript
  // build.js
  ({
      baseUrl: ".",
      name: "main",
      out: "main-built.js"
  })
  ```

  ```html
  // index.html
  <!DOCTYPE html>
  <html>
      <head>
          <title>App</title>
          <script data-main="main-built" src="scripts/lib/require.js"></script>
      </head>
      <body>
          <h1>App</h1>
      </body>
  </html>
  ```

- 例子2：优化整个项目的js

  ```javascript
  // 优化整个项目的主要build.js配置
  ({
      modules: [
          {
              name: 'main'
          }
      ],
      paths: {
          "jquery": "lib/jquery-3.3.1.min"
      },
      dir: "../dist",
      removeCombined: true,
      fileExclusionRegExp: /^(r|build)\.js$/
  })
  ```

  - 这里原先的name参数只能指定一个模块，改为modules可以指定多个模块；
  - 原先out参数指定单个输出文件，改为dir指定输出目录
  - removeCombined：是否删除输出目录中已合并的文件
  - fileExclusionRegExp：指定那些js不打包的匹配规则

  以上参考[RequireJS - 使用 r.js 实现模块、项目的压缩合并（压缩js、css文件）](http://www.hangge.com/blog/cache/detail_1704.html)

- 例子3：优化css

  > 1. 官方文档中指定的优化css方式是通过@import注解来优化css。需要在html中引入打包后的css文件

  - 优化指定css文件：在build.js中通过cssIn配置指定
  - 优化打包整个项目中的css：通过optimizeCss配置（可选值[standard,keepLines,keepWhitespace]）

  > 2. 使用require-css引用css的情况下会报错`Error: ENOENT: no such file or directory, open '....\dist\lib\css-builder.js'`

  - 首先你得确保你的目录中有`css.js`的依赖脚本`css-builder.js`和`normalize.js`

  - 然后将定义在paths中的``css.js``改到map中

    ```javascript
    // 由
    paths: {
        'css': 'lib/css.min'
    }
    // 改为
    map: {
    	'*': {
    		'css': 'lib/css.min'
    	}
    }
    ```

  以上参考[path error during optimize via r.js](https://github.com/guybedford/require-css/issues/120)



###[打包整个项目（js+css）示例](./rjsDemo)

