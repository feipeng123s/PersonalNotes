### 层叠上下文(stacking context)

> **层叠上下文**是HTML元素的三位概念，这些HTML元素在一条假象的相对于面向（电脑屏幕的）视窗或者网页的用户的z轴上延伸，HTML元素依据其自身属性按照优先级顺序占用层叠上下文的空间。

### 形成条件

HTML文档中的层叠上下文由满足一下任一条件的元素形成：

- 根元素(`<html>`)
- `z-index`值不为`auto`的绝对/相对定位
- `z-index`值不为`auto`的flex布局（flex、inline-flex）里面的子元素
- `opacity`值小于1的元素
- `transform`值不为`none`的元素
- `position: fixed`
- `isolation: isolate`(该属性定义当前元素是否必须穿点一个新的stacking context)
- [...更多详见MDN](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Understanding_z_index/The_stacking_context)

### 层叠水平(stacking level)

层叠水平决定了同一个层叠上下文中元素在z轴上的显示顺序。

普通元素的层叠书评优先由层叠上下文决定，因此，层叠水平的比较只在当前层叠上下文元素中有意义。

### 层叠顺序(stacking order)

> 层叠上下文和层叠水平是概念，层叠顺序是规则

按一下顺序从里到外排列：

- 层叠上下文(background/border)
- 负z-index
- block块状水平盒子
- float浮动盒子
- inline/inline-block水平盒子
- z-index:auto或看成z-index:0
- 正z-index

[深入理解CSS中的层叠上下文和层叠顺序](https://www.zhangxinxu.com/wordpress/2016/01/understand-css-stacking-context-order-z-index/)

