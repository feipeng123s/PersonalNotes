### focus-within

```html
    <div class="container">
        <input id="input" class="input" placeholder="username">
        <input class="input" placeholder="password">
    </div>
    <style>
        .container{
            height: 120px;
            width: 200px;
            text-align: center;
            border: 2px solid #bbb;
        }
        .container:focus-within{
            border-color: #1271E0;
        }
        .input:focus{
            outline: none;
        }
    </style>
```



### 近似实现

> 原理：把兄弟元素作为祖先元素使用

```html
    <div class="container">
        <input id="input" class="input" placeholder="username">
        <input class="input" placeholder="password">
        <label class="border" for="input"></label>
    </div>
    <style>
        .container{
            height: 120px;
            width: 200px;
            position: relative;
            z-index: 1;
            text-align: center;
        }
        .border{
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            z-index: -1;
            border: 1px solid #bbb;
        }
        .input:focus{
            outline: none;
        }
        /* 后面相邻的兄弟元素 */
        .input:focus + .border{
            border-color: #1271E0;
        }
        /* 后面任意位置的兄弟元素 */
        .input:focus ~ .border{
            border-color: #1271E0;
        }
    </style>
```



参考文章：

[神奇的选择器 :focus-within](http://web.jobbole.com/95025/)
[如何在CSS中实现父选择器效果？](https://www.zhangxinxu.com/wordpress/2016/08/css-parent-selector/)

