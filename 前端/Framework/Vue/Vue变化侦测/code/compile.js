function Compile(vm, el) {
    this.vm = vm;
    // Vue实例挂载元素
    this.el = document.querySelector(el);
    this.init();
}

Compile.prototype = {
    init: function() {
        if (this.el) {
            // 将挂载元素的子元素转移到Fragment中操作，提高性能
            this.fragment = this.nodeToFragment();
            // 编译Fragment
            this.compileFragment(this.fragment);
            // 将编译好的Fragment插入到挂载点
            this.el.appendChild(this.fragment);
        } else {
            console.log('DOM元素不存在');
        }
    },
    nodeToFragment: function() {
        let fragment = document.createDocumentFragment();
        let child = this.el.firstChild;
        while (child) {
            // Node.appendChild(),如果被插入的节点已经存在于当前文档的文档树中,
            // 则那个节点会首先从原先的位置移除,然后再插入到新的位置。
            // 故继续调用firstChild时会获取到el的下一个子元素。
            fragment.appendChild(child);
            child = this.el.firstChild;
        }
        return fragment;
    },
    compileFragment: function(fragment) {
        let childNodes = fragment.childNodes;
        let self = this;
        Array.prototype.slice.call(childNodes).forEach(node => {
            let reg = /\{\{(.*)\}\}/;
            let text = node.textContent;
            console.log(text,reg.exec(text));
            
            if (self.isElementNode(node)) { // 编译元素节点中的指令
                self.compileElement(node);
            } else if (self.isTextNode(node) && reg.test(text)) { // 编译文本节点中的双括号{{}}
                self.compileText(node, text, reg.exec(text)[1]);
            }
            
            // 递归编译子节点
            if (node.childNodes && node.childNodes.length) {
                self.compileFragment(node);
            }
        });
    },
    compileElement: function (node) {
        let nodeAttrs = node.attributes;
        let self = this;
        Array.prototype.forEach.call(nodeAttrs, attr => {
            let attrName = attr.name;
            if (self.isDirective(attrName)) {
                var varName = attr.value;
                var dir = attrName.substring(2);
                if (self.isEventDirective(dir)) {  // 事件指令
                    self.compileEvent(node, self.vm, varName, dir);
                } else {  // v-model 指令
                    self.compileModel(node, varName);
                }
                node.removeAttribute(attrName);
            }
        })
    },
    compileText: function (node, text, varName) {
        let self = this;
        let replaceTxt = `{{${varName}}}`;
        this.updateText(node, text, replaceTxt, this.vm[varName]);
        // 使用Watcher订阅此处变量的变化
        new Watcher(this.vm, varName, function (value) {
            self.updateText(node, text, replaceTxt, value);
        });
    },
    compileModel: function (node, varName) {
        let self = this;
        let val = this.vm[varName];
        self.modelUpdater(node, val);
        // 使用Watcher订阅v-model绑定的变量变化
        new Watcher(this.vm, varName, function (value) {
            self.modelUpdater(node, value);
        });
        
        // 监听input输入变化
        node.addEventListener('input', function(e) {
            var newValue = e.target.value;
            if (val === newValue) {
                return;
            }
            self.vm[varName] = newValue;
            val = newValue;
        });
    },
    compileEvent: function (node, vm, varName, dir) {
        var eventType = dir.split(':')[1];
        var cb = vm.methods && vm.methods[varName];

        if (eventType && cb) {
            node.addEventListener(eventType, cb.bind(vm), false);
        }
    },
    updateText: function (node, text, replaceTxt, value) {
        text = text.replace(replaceTxt, value);
        node.textContent = typeof text == 'undefined' ? '' : text;
    },
    modelUpdater: function(node, value) {
        node.value = typeof value == 'undefined' ? '' : value;
    },
    isDirective: function (attr) {
        return attr.indexOf('v-') === 0;
    },
    isEventDirective: function (dir) {
        return dir.indexOf('on:') === 0;
    },
    isElementNode: function (node) {
        return node.nodeType === 1;
    },
    isTextNode: function (node) {
        return node.nodeType === 3;
    }
}