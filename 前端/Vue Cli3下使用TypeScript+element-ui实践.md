## 使用CLI3创建TypeScript项目

安装cli环境的部分这里就不说了。

> vue create my-project

## 使用axios封装http请求

```bash
npm i axios -S
npm i qs -S
# TypeScript definitions for qs
npm i @types/qs -S 
```

具体封装操作，未完待续。。。。。。

## 按需引入element-ui

- 安装

  ```bash
  npm i element-ui -S
  # 用来实现按需引入的插件
  npm i babel-plugin-component -D
  ```

- 配置`babel.config.js`如下：

  ```javascript
  plugins: [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ],
  ```

  官网中的指导的配置为：

  ```javascript
  {
    "presets": [["es2015", { "modules": false }]],
    "plugins": [
      [
        "component",
        {
          "libraryName": "element-ui",
          "styleLibraryName": "theme-chalk"
        }
      ]
    ]
  }
  ```

  这里的presets配置不能在typescript项目中使用，会报错，我们只需要添加plugins的配置就好了。

- 在`main.ts`中按需引入

  ```typescript
  import Vue from 'vue';
  import {Button} from 'element-ui';
  Vue.use(Button);
  ```

**注意**：若是按照上面的配置并使用组建后，发现css样式未能引入，先`import 'element-ui/lib/theme-chalk/index.css';`，重新运行一遍，然后再将这段引用去掉再运行，css就莫名其妙加载成功了，经build测试，是按需引入。

## 配置TSLint

运行`vue ui`命令打开图形界面，在插件这一栏安装`@vue/cli-plugin-eslint`插件，同时会自动安装以下这些依赖：

- `vue/eslint-config-standard`
- `vue/eslint-config-typescript`
- `babel-eslint`
- `eslint`
- `eslint-plugin-vue`

还会添加以下两个配置文件：

`.editorconfig`

```
[*.{js,jsx,ts,tsx,vue}]
indent_style = space
indent_size = 2
trim_trailing_whitespace = true
insert_final_newline = true
```

`.eslintrc.js`

```javascript
module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  }
}
```

选择autoFixOnSave，选择standard

完成安装后，就会按照eslint的方式来格式化ts及vue文件了。

