####AMD规范

```
define(id?, dependencies?, factory);
```

> require 方法里的这个字符串数组参数可以允许不同的值，当字符串是以”.js”结尾，或者以”/”开头，或者就是一个 URL 时，RequireJS 会认为用户是在直接加载一个 JavaScript 文件，否则，当字符串是类似”my/module”的时候，它会认为这是一个模块，并且会以用户配置的 baseUrl 和 paths 来加载相应的模块所在的 JavaScript 文件。

#### 载入 require.js

```
<script data-main="js/main" src="scripts/require.js"></script>
```



```
npm install requirejs-text // 加载html
npm install require-css // 加载css
```

#### 配置

- paths
- shim：为那些没有使用define()来声明依赖关系、设置模块的"浏览器全局变量注入"型脚本做依赖和导出配置

[示例代码](./requireDemo)