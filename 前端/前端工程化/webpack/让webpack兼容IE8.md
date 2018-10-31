公司项目原先使用regular框架时未考虑兼容IE8，后期又提出要兼容IE8的条件，只好在360兼容模式下一个个的解决报错

首先是regular-ui源文件中有部分不兼容IE8的报错：

- 有关default的报错，``SCRIPT1028: 缺少标识符、字符串或数字``

  > 原因：default为保留字，在IE8中无法作为key使用
  >
  > 解决方法：在使用default作为属性的key时要加上``""``双引号{ "default": obj },在调用该属性时不能用pro.default而应该用pro["default"]

- 有关 Object.defineProperty的报错

  好吧，还好该方法中定义的属性不多，只有一个，所以我手动一个一个方法替换(如下：未注释部分替换了注释部分)

  ```javascript
  //Object.defineProperty(exports, "__esModule", {
  //  value: true
  //});
  exports["__esModule"] = true;
  ```

好了，regular-ui改好了，没有报错了，但是regular组件打包的js文件又出现了这两个报错，那我总不能每次打包都去手动改吧，于是搜寻解决方法，最终两个问题的解决方案如下：

- 使用 [loose mode](https://www.npmjs.com/package/babel-preset-es2015-loose) 解决 Object.defineProperty 的问题

  ```bash
  $ npm install --save-dev babel-preset-es2015-loose babel-preset-es2015
  ```


- 使用[**es3ify-loader**](https://github.com/sorrycc/es3ify-loader)解决default报错的问题

  ```bash
  $ npm i es3ify-loader --save
  ```

我使用的是webpack3.6，webpack.config.js的相关配置如下：

```javascript
module: {
	rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: { //处理IE8中Object.defineProperty报错的问题
                    presets: ['es2015-loose']
                }
            },
            { 
                test: /\.js$/,
                enforce: 'post', // post-loader处理
                loader: 'es3ify-loader', //处理IE8中不能处理的保留字，如default
                exclude: /node_modules/
            }
      ]
}
```



[参考链接](http://blog.csdn.net/wulixiaoxiao1/article/details/61197001)