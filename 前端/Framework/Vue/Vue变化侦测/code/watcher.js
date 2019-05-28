function Watcher(vm, key, callback) {
    this.vm = vm;
    this.key = key;
    this.callback = callback;
    this.value = this.bindSub();
}

Watcher.prototype = {
    bindSub: function() {
        // 将自身指定为要添加的订阅者
        Dep.target = this;
        // 获取$data中的值时，自动调用了getter函数，从而添加了当前订阅者
        let val = this.vm.$data[this.key];
        // 释放当前要添加的订阅者缓存
        Dep.target = null;
        return val;
    },
    update: function() {
        let newVal = this.vm.$data[this.key];
        let oldVal = this.value;
        if (oldVal !== newVal) {
            this.value = newVal;
            this.callback.call(this.vm, newVal, oldVal);
        }
    }
}