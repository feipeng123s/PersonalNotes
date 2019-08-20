### 1. 如何调整element-ui组件的样式

#### Vue中CSS作用域

- scoped CSS

  > 当 `<style>` 标签有 `scoped` 属性时，它的 CSS 只作用于当前组件中的元素。 

  **子组件的根元素**

  > 使用 `scoped` 后，父组件的样式将不会渗透到子组件中。不过一个子组件的根节点会同时受其父组件的 scoped CSS 和子组件的 scoped CSS 的影响。这样设计是为了让父组件可以从布局的角度出发，调整其子组件根元素的样式。 -------------**在scope中无法更改子组件的原因**

- 深度作用选择器

  如果你希望 `scoped` 样式中的一个选择器能够作用得“更深”，例如影响子组件，你可以使用 `>>>` 操作符： 

  ```html
  <style scoped>
  .a >>> .b { /* ... */ }
  </style>
  ```

  有些像 Sass 之类的预处理器无法正确解析 `>>>`。这种情况下你可以使用 `/deep/` 操作符取而代之——这是一个 `>>>` 的别名，同样可以正常工作。

#### 解决方案

- 使用全局样式去修改子组件样式，此时我们可以给父级定义一个类名或者Id来增加命名空间，达到不影响组件样式的目的。 

  ```css
  #id{ 
      .el-table { //element-ui 元素
        text-align: right;
      }
  }
  ```

- 使用深度作用选择器

参考链接：[Scoped CSS](https://vue-loader.vuejs.org/zh/guide/scoped-css.html)



### 2. 在使用el-table时，希望在列表数据在DOM中更新后再选中状态为“已使用”的row

> 问题的关键在于我们想在DOM状态更新后做点什么

- 方法一：在更新数据后，是用setTimeout等待DOM更新完成后来执行选中row的操作
- 方法二：在声明周期钩子updated中来执行选中row的操作
- 方法三：使用Vue.nextTick ()（异步更新队列）

方法一由于数据量的大小不同，我们无法掌控setTimeout的延迟时间；方法二当前页面的任何数据更新后都会执行选中row的操作；只有方法三是在列表数据更新后才出发选中操作，目前最优雅的解决方式

```javascript
vm.toBeConfirmedData = doneList.concat(notExpendList)
// 使用异步更新队列，更优雅
vm.$nextTick(function () {
    vm.toBeConfirmedData.forEach(row => {
        if (row.used) {
            vm.$refs.toBeConfirmedTable.toggleRowSelection(row, true)
        }
    })
})
```

参考链接：[深入响应式原理](https://cn.vuejs.org/v2/guide/reactivity.html)

### 3. keep-alive

> `<keep-alive>` 是用在其一个直属的子组件被开关的情形。如果你在其中有 `v-for` 则不会工作。如果有上述的多个条件性的子元素，`<keep-alive>` 要求同时只有一个子元素被渲染。 ----[出处](https://cn.vuejs.org/v2/api/#keep-alive)

- 在动态组件中使用keep-alive

  ```vue
  <keep-alive>
    <component :is="view"></component>
  </keep-alive>
  ```

- 在条件判断子组件中使用keep-alive

  ```vue
  <keep-alive>
    <comp-a v-if="a > 1"></comp-a>
    <comp-b v-else></comp-b>
  </keep-alive>
  ```

- 在vue-router中使用keep-alive

  ```vue
  <keep-alive>
      <router-view v-if="$route.meta.keepAlive">
          <!-- 这里是会被缓存的视图组件，比如 Home！ -->
      </router-view>
  </keep-alive>
  
  <router-view v-if="!$route.meta.keepAlive">
      <!-- 这里是不被缓存的视图组件，比如 Edit！ -->
  </router-view>
  
  // 在路由中增加router.meta属性
  {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        keepAlive: true // 需要被缓存
      }
  }
  ```


### 4. 可复用元素

> Vue 会尽可能高效地渲染元素，通常会复用已有元素而不是从头开始渲染。  Vue 为你提供了一种方式来表达“这两个元素是完全独立的，不要复用它们”。只需添加一个具有唯一值的 `key` 属性即可 
>
> ​									——[[用 `key` 管理可复用的元素](https://cn.vuejs.org/v2/guide/conditional.html#%E7%94%A8-key-%E7%AE%A1%E7%90%86%E5%8F%AF%E5%A4%8D%E7%94%A8%E7%9A%84%E5%85%83%E7%B4%A0)]



 ### 5. Vue不能检测对象上增加或删除的属性

>由Vue双向绑定的原理可知：Vue通过递归的方式向data每个属性及其后代属性做了**数据劫持**，而新增和删除对象的属性并没有调用该属性的set方法，故不能触发视图更新。这时候需要使用`Vue.set( target, key, value )`和`Vue.delete(target, key, value)`方法来更新属性所在对象（或数组）的值来触发。



### 6. router和route

> 在Vue Router中有`this.$route`和`this.$router`这两个东西，刚开始容易弄混。
>
> route代表当前路由，可以获取`params、query、hash`等属性
>
> router代表路由器，即VueRouter的实例对象，可以调用其中的`push()、go()`等方法。

### 7. vue在行内样式中设置background

需要在url('image path')中加上require方法

`backgroundImage: "url(" + require("../../static/img/icon2.png") + ") "`

### 8.  vue自定义事件传参问题

> 问题描述：在子组件中通过`$emit`向父组件传递了一个参数，在父组件的响应函数中还需要父组件中的额外参数，这时应该如何传递？

- 解决方案一

  在子组件中用事件抛出一个值，当我们在父组件监听这个值的时候，我们可以通过`$event`来访问到被抛出的这个值。如果这个事件处理函数是一个方法，那么这个值将会作为第一个值传入这个方法。[使用事件抛出一个值](https://cn.vuejs.org/v2/guide/components.html#%E4%BD%BF%E7%94%A8%E4%BA%8B%E4%BB%B6%E6%8A%9B%E5%87%BA%E4%B8%80%E4%B8%AA%E5%80%BC)

- 解决方案二

  也可以在事件处理函数中使用箭头函数`value => handler(value, other)`，这样就把子组件中的数据传递出来了

> 如果子组件用事件抛出多个值呢？

- 可以将多个值合并到一个对象中抛出来（勉强的解决方案）
- 使用arguments接受参数，再传到事件处理函数中去（严格模式下不能使用）
- 使用箭头函数

#### 综上

> 最佳解决方案解决方案为箭头函数



