- <!DOCTYPE>

  > **<!DOCTYPE> **不是html标签，是位于html文档第一行的声明，它是指示html标签使用哪个版本进行编写的指令

  在 HTML 4.01 中，<!DOCTYPE> 声明引用 DTD，因为 HTML 4.01 基于 SGML（标准通用标记语言），DTD 规定了标记语言的规则，这样浏览器才能正确地呈现内容 ；HTML5 不基于 SGML，所以不需要引用 DTD。 

  - HTML5

    ```html
    <!DOCTYPE html>
    ```

  - HTML4.01 Strict

    ```html
    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
    ```

  - HTML4.01 Transitional

    ```
    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" 
    "http://www.w3.org/TR/html4/loose.dtd">
    ```

  - HTML4.01 Frameset

    ```
    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" 
    "http://www.w3.org/TR/html4/frameset.dtd">
    ```

  - XHTML1.0也有以上三种分类

  - XHTML1.1等同于XHTML1.0 Strict，但允许添加模型

- DTD（Document Type Definition）

  > 可以看成一个或者多个XML文件的模板，在这里可以定义XML文件中的元素、元素的属性、元素的排列方式、元素包含的内容等等 

  组成：

  - 元素Element
  - 属性Attribute
  - 实体Entity
  - 注释Comments

- xmlns（XML命名空间）

  > xmlns 属性可以在文档中定义一个或多个可供选择的命名空间。该属性可以放置在文档内任何元素的开始标签中。该属性的值类似于 URL，它定义了一个命名空间，浏览器会将此命名空间用于该属性所在元素内的所有内容。 

  使用语法：``xmlns:prefix="namespaceURI" ``，其中prefix是命名空间的别名

  ```html
  <html xmlns="http://www.w3.org/1999/xhtml"></html>
  
  <html xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"></html>
  ```

  