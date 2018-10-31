>在浏览器中修改DOM之后，会触发浏览器重绘和重排，而重绘和重排又是十分耗性能的，因此，在批量修改DOM时应最小化重绘和重排

### 批量修改步骤

1. 使元素脱离文档流
2. 对其应用多重改变
3. 把元素带回文档流中

### 三种使DOM脱离文档流的方法

- 隐藏元素，应用修改，重新显示
  ```javascript
    <ul data-uid="ul"></ul>
    
    <script>
        let ul = document.querySelector(`[data-uid='ul']`);

        ul.style.display = 'none';

        const browserList = [
            "Internet Explorer", 
            "Mozilla Firefox", 
            "Safari", 
            "Chrome", 
            "Opera"
        ];

        browserList.forEach(function (val) {
            let li = document.createElement('li');
            li.textContent = val;
            ul.appendChild(li);
        });

        ul.style.display = 'block';
    </script>
  ```
- 使用文档片段（document fragment）在当前DOM之外构建一个子树，再把它拷贝回文档
  	```javascript
    <ul data-uid="ul"></ul>
    
    <script>
        let ul = document.querySelector(`[data-uid='ul']`),
            fragment = document.createDocumentFragment();

        const browserList = [
            "Internet Explorer", 
            "Mozilla Firefox", 
            "Safari", 
            "Chrome", 
            "Opera"
        ];

        browserList.forEach(function (val) {
            let li = document.createElement('li');
            li.textContent = val;
            fragment.appendChild(li);
        });

        ul.appendChild(fragment);
    </script>
   ```
- 将原始元素拷贝到一个脱离文档的节点中，修改副本，完成后再替换原始元素
  ```javascript
  <ul data-uid="ul"></ul>
    
  <script>
      let ul = document.querySelector(`[data-uid='ul']`);

  	let clone = ul.cloneNode(true);

  	const browserList = [
          "Internet Explorer", 
          "Mozilla Firefox", 
          "Safari", 
          "Chrome", 
          "Opera"
      ];

  	browserList.forEach(function (val) {
          let li = document.createElement('li');
          li.textContent = val;
          clone.appendChild(li);
      });

  	ul.parentNode.replaceChild(clone, ul);
  </script>
  ```