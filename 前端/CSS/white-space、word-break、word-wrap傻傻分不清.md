## white-space

### normal

> 合并空格，自动换行，换行符（回车）不起作用

### nowrap

> 合并空格，不会自动换行，换行符（回车）不起作用

### pre

> 保留原有空格，不会自动换行，换行符（回车）起作用

### pre-wrap

> 保留原有空格，自动换行，换行符（回车）起作用

### pre-line

> 合并空格，自定换行，换行符（回车）起作用

### 表格总结

| 属性名/能否起作用 | 换行符(回车) | 空格       | 自动换行 | **\</br>、nbsp;** |
| ----------------- | ------------ | ---------- | -------- | ----------------- |
| normal            | 否           | 否（合并） | 是       | 是                |
| nowrap            | 否           | 否（合并） | 否       | 是                |
| pre               | 是           | 是         | 否       | 是                |
| pre-wrap          | 是           | 是         | 是       | 是                |
| pre-line          | 是           | 否（合并） | 是       | 是                |



white-space决定了文字是否自动换行，word-break和word-wrap则是用来**控制单词（也指连续的中文）如何被拆分换行的**

## word-break

### normal

> 不拆分单词换行

### keep-all

> 只能在半角空格或连字符处换行，不强制拆分单词

### break-all

> 单词碰到边界就拆分换行



## word-wrap

>`word-wrap`属性原本属于微软的一个私有属性，在css3现在的文本规范草案中已经被重命名为`overflow-wrap`。word-wrap现在被当做overflow-wrap的“别名”。稳定的Chrome和Opera浏览器版本支持这种新语法。

### normal

> 不拆分单词换行

### break-word

> 不是直接拆分单词换行，而是直接将超出边界的单词放到下一行，只有当一整行都放不下该单词时，才会拆分单词换行。



**注意：只有当`white-space`的取值不为`pre`和`nowrap`时，`word-break`属性和`word-wrap`属性才能生效。**

参考：

1. [CSS 的空格处理](<http://www.ruanyifeng.com/blog/2018/07/white-space.html>)

2. [彻底搞懂word-break、word-wrap、white-space](https://www.cnblogs.com/dfyg-xiaoxiao/p/9640422.html)