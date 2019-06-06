function Observer (data) {
    this.data = data;
    this.dep = new Dep ();
    this.walk(data);
}

Observer.prototype.walk = function (obj) {
    let keys = Object.keys(obj)
    keys.forEach(key => {
        defineReactive(obj, key)
    })
}

function defineReactive (data, key) {
    // 初始化发布者
    let dep = new Dep();
    let val = data[key];
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function getter() {
            // 添加订阅者
            if (Dep.target) {
                dep.addSub(Dep.target);
            }
            
            return val;
        },
        set: function setter(newVal) {
            if (newVal === val) return;
            val = newVal;
            // 通知订阅者
            dep.notify();
        }
    })
}


function Dep() {
    // 订阅者数组
    this.subs = [];
}

Dep.prototype = {
    addSub: function (sub) {
        this.subs.push(sub);
    },
    notify: function () {
        this.subs.forEach(sub => {
            sub.update();
        })
    }
}

Dep.target = null;