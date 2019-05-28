function MyVue (options) {
    this.$options = options;
    this.$data = options.data;
    this.$el = options.el;
    let vm = this;
    
    Object.keys(this.$data).forEach(key => {
        vm.proxyData(key);
    });
    
    this.init();
}
MyVue.prototype.init = function () {
    observer(this.$data);
    new Compile(this, this.$el);
}

MyVue.prototype.proxyData = function (key) {
    let self = this;
    Object.defineProperty(this, key, {
        enumerable: false,
        configurable: true,
        get: function proxyGetter(){
            return self.$data[key];
        },
        set: function proxySetter(newVal){
            self.$data[key] = newVal;
        }
    })
}