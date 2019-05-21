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
}
```

### 高度自适应textarea

<https://segmentfault.com/q/1010000000095238>

```html
<div class="expandingArea">
    <pre><span></span><br></pre>
    <textarea placeholder="输入文字"></textarea>
</div>
<style>
.expandingArea{
    position:relative;
}
textarea{
    position:absolute;
    top:0;
    left:0；
    height:100%;
}
pre{
    display:block;
    visibility:hidden;
}
</style>
```

> pre以块形式存在，并且不可见，但是是占用空间的，不像display:none;什么空间也不占。这时需要把textarea中的内容实时同步到pre里的span标签中，因为pre没有`postion:absolute`所以它的高度会一直影响expandingArea的高度。总结原理就是：pre会随内容的高度变化而变化，`expandingArea`的高度又随pre变化，因为`textarea`的高度100% `textarea`的高度会随`expandingArea`变化，只要同步`textarea`的内容到pre中，就达到一个`textarea`随内容高度变化的目的了。