## 什么是过渡

>过渡用来定义css属性值在一段时间内平缓变化的效果。它是一个复合属性，由`transition-property`，`transition-duration`，`transition-timing-function`，`    transition-delay`构成。

## 过渡属性

### transition-property

> 指定在哪个css属性上使用过渡效果

#### 取值

- all：能够使用过渡的属性，一律用过渡体现
- none
- 具体属性名，如`transition-property:background;`

#### 能够使用过渡的属性

- 颜色属性（background，box-shadow等）
- 取值为数字的属性
- 转换属性
- visibility属性

### transition-duration

> 过渡时长（s或ms）

### transition-timing-function

> 过渡速度时间曲线函数

- ease 慢速开始，快速变快，慢速结束
- linear 匀速
- ease-in 慢速开始，加速结束
- ease-out 快速开始，慢速结束
- ease-in-out 慢速开始和结束，中间先加速再减速

### transition-delay

> 过渡延迟时间

## 过渡的触发

### 触发方式

- css伪类触发
- 媒体查询（@media）触发
- js触发

### 不能触发过渡的情况

- 没有初始值

  > 例如一个包含文本自适应div未指定高度，通过js将该div的高度设为0时，不会触发transition

- 属性值为auto

- display为none的元素

## 过渡事件

过渡只有一个`transitionend`事件

> 指定了同一个DOM对象多个属性的过渡效果时，会多次触发transitionend事件。

```javascript
element.addEventListener("transitionend", callback, false);
```



参考：[CSS3 transition 介绍](<https://juejin.im/entry/576b66d70a2b580058e84ac7>)