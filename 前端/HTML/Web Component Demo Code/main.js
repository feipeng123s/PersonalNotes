// word-count
class WordCount extends HTMLParagraphElement{
    constructor(){
        super();

        const wcParent = this.parentNode;
        console.log(wcParent.innerText || wcParent.textContent);

        function countWords(node){
            const text = node.innerText || node.textContent;
            // 按空格切割
            return text.split(/\s+/g).length;
        }

        const count = `Words: ${countWords(wcParent)}`;

        const shadow = this.attachShadow({mode: 'open'});

        const text = document.createElement('span');
        text.textContent = count;

        shadow.appendChild(text);

        setInterval(function(){
            const count = `Words: ${countWords(wcParent)}`;
            text.textContent = count;
        }, 200);
    }
}

customElements.define('word-count', WordCount, {extends: 'p'});

// popup-info
class PopUpInfo extends HTMLElement{
    constructor() {
        super();

        var shadow = this.attachShadow({mode: 'open'});

        var wrapper = document.createElement('span');
        wrapper.setAttribute('class', 'wrapper');
        var icon = document.createElement('span');
        icon.setAttribute('class', 'icon');
        icon.setAttribute('tabindex', 0);
        var info = document.createElement('span');
        info.setAttribute('class', 'info');
        
        // 将text属性的值，
        var text = this.getAttribute('text');
        info.textContent = text;

        // 插入图片元素
        var imgUrl;
        if (this.hasAttribute('img')) {
            imgUrl = this.getAttribute('img');
        } else {
            imgUrl = 'img/default.png';
        }
        var img = document.createElement('img');
        img.src = imgUrl;
        icon.appendChild(img);

        // 添加样式
        var style = document.createElement('style');

        style.textContent = `
        .wrapper {
            position: relative;
        }
        .info { 
            font-size: 0.8rem; 
            width: 200px; 
            display: inline-block; 
            border: 1px solid black; 
            padding: 10px; 
            background: white; 
            border-radius: 10px; 
            opacity: 0; 
            transition: 0.6s all; 
            position: absolute; 
            bottom: 20px; 
            left: 10px; 
            z-index: 3; 
        } 
        img { 
            width: 1.2rem 
        } 
        .icon:hover + .info, .icon:focus + .info { 
            opacity: 1; 
        }`;
        shadow.appendChild(style);1
        shadow.appendChild(wrapper);
        wrapper.appendChild(icon);
        wrapper.appendChild(info);
    }
}

customElements.define('popup-info', PopUpInfo);

// my-paragraph
customElements.define('my-paragraph',
  class extends HTMLElement {
    constructor() {
      super();
      let template = document.getElementById('my-paragraph');
      let templateContent = template.content;

      const shadowRoot = this.attachShadow({mode: 'open'})
        .appendChild(templateContent.cloneNode(true));
  }
})