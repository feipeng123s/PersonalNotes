### 0.5px边问题

分隔边hr：

```css
.hr{
    height: 1px;
    background: #c6c6c6;
    transform: scaleY(0.5);
    transform-origin: 50% 100%;
}
```

边框：

```css
your-class:after{
	content: ''；
    position: absolute；
    width: 200%；
    height: 200%；
    top: 0；
    left: 0；
    transform-origin: 0 0；
    transform: scale(0.5, 0.5)；
    box-sizing: border-box；
    z-index: 1；  
    pointer-events:none； // 让点击事件穿透当前元素
}
```

### flex布局遇上文字省略

正常情况下的文字超出省略：

```html
<div class="wrap ellipsis">
    我有一只小毛驴
</div>
<style>
    .wrap{
        width: 100px;
        background-color: yellowgreen;
        border: 1px solid red;
    }
    .ellipsis{
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
</style>
```

但是在flex布局的元素上使用`.ellipsis`样式时，没有出现省略的样式，如下，我们给warp加上一个`display:flex`，就会发现文字超出省略失效了：

```css
<div class="wrap ellipsis">
    我有一只小毛驴
</div>
<style>
    .wrap{
        display: flex;
        width: 100px;
        background-color: yellowgreen;
        border: 1px solid red;
    }
    .ellipsis{
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
</style>
```

**原因：`text-overflow`这个属性只对那些在块级元素(block和inline-block)溢出的内容有效**

所以解决方案是在文字外面嵌套一层块级元素，然后新增的这层元素上使用溢出省略样式。

```html
<div class="wrap">
    <span class="ellipsis">
        我有一只小毛驴
    </span>
</div>
<style>
    .wrap{
        display: flex;
        width: 100px;
        background-color: yellowgreen;
        border: 1px solid red;
    }
    .ellipsis{
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    span{
        display: inline-block;
    }
</style>
```



### 相对于父元素的fixed定位

> 需求：在父元素拖动滚动条滑动时，要相对于父元素所显示的区域固定定位

解决方案一：父元素不设置定位属性，在父元素外套一层祖先元素，让需要固定定位的元素相对于祖先元素绝对定位

```html
<div class="ancestor">
    <div class="parent">
        <div class="child">
            滚动内容
        </div>
        <div class="fixed">
            固定内容
        </div>
    </div>
</div>
<style>
    .ancestor{
        position: relative;
        width: 1000px;
        height: 500px;
        background-color: yellowgreen;
    }
    .parent{
        width: 100%;
        height: 100%;
        overflow-y: auto;
    }
    .child{
        height: 800px;
    }
    .fixed{
        background-color: red;
        width: 100px;
        height: 50px;
        position: absolute;
        top: 100px;
        left: 200px;
    }
</style>
```

解决方案二：利用transform属性限制`position:fixed`的跟随效果，变成position:absolute的表现。（在IE上的兼容性不太好）

> 正常情况下，`position: fixed`是通过指定元素相对于屏幕视口(viewport)的位置来指定元素的位置。`fixed` 属性会创建新的层叠上下文。当元素祖先的 `transform`  属性非 `none` 时，容器由视口改为该祖先。 [position——MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position)

```html
<div class="absolute">
  absolute content
  <div class="content"></div>
  <div class="fixed">fixed</div>
</div>
<style>
body { background: #ccc;height: 2000px ; transform:translateZ(0); -webkit-transform:translateZ(0);/*重点样式*/}
.absolute{
	height: 600px;
    width: 650px;
    background: green;
    overflow: auto;
    position: relative;
    left:200px;
    top:100px;
}
.fixed{
	background-color: #ddd;
    width: 300px;
    height: 100px;
    position: fixed;
  	top:200px;
    /*不要设置top,left,bottom,right*/
}
.content{ /*为了撑起absolute的高度*/
  float:left;
  height:1800px;
}
</style>
```





