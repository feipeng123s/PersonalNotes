> 问题描述：在子元素中设置margin后，父元素高度塌陷，代码如下

```html
<div class="father">
    <div class="son"></div>
</div>
<style>
    .father {
        width: 400px;
        height: 600px;
        background: red;
    }
    .son {
        height: 300px;
        margin: 140px 90px;
        background: white;
        border: 1px solid black;
    }
</style>
```

> 问题原因：父子元素都为块级元素，它们发生了margin合并

####发生margin合并的条件

- 块级元素，但不包含浮动和绝对定位元素
- 只发生在和当前文档流方向垂直的方向上

####如何阻止margin合并：

- 设置垂直方向的border

- 设置垂直方向的padding

- 在合并的margin间添加内联元素进行分隔

  ```
  // 示例
  .no-collapse::before{
  	content: '';
  	display: table;
  }
  .no-collapse::after{
  	content: '';
  	display: table;
  }
  ```

- 设置块状格式化上下文元素（overflow:hidden）

#### margin合并计算规则

> 正正取大值；正负值相加；负负最负值。

参考书籍：《CSS世界》