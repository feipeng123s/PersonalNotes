### 概念

`keep-alive`是一个vue内置的抽象组件，它自身不回渲染一个DOM元素，也不会出现在父组件链中。使用`keep-alive`包裹动态组件时，会缓存不活动的组件实例，而不是销毁（destory）它们。（`keep-alive`缓存内部的第一个组件及该组件内件内部的子组件）

### 生命周期

当组件在`keep-alive`内被切换时，它的`activated`和`deactivated`这两个生命周期钩子函数将会被对应执行。

### keep-alive的组件属性

- include & exclude

  二者都可以用逗号分隔的字符串、正则或数组来表示。`exclude`的优先级高于`include`，即当二者同时存在时，以exclude为准。

- max

  最多可以缓存多少组件实例。

**keep-alive不会在[函数式组件](https://cn.vuejs.org/v2/guide/render-function.html#%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6)中正常工作，因为它们没有缓存实例**

> 我们可以把函数式组件想像成组件里的一个函数，入参是渲染上下文(render context)，返回值是渲染好的HTML
>
> 对于函数式组件，可以这样定义：
>
> - Stateless(无状态)：组件自身是没有状态的
> - Instanceless(无实例)：组件自身没有实例，也就是没有this



### keep-alive与二级嵌套路由

示例路由如下，我们以created方法是否被执行判断页面是否重新渲染：

```javascript
routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      redirect: '/a',
      children: [
        {
          path: 'a',
          component: A
        },
        {
          path: 'b',
          component: B
        },
        {
          path: 'c',
          component: C
        }
      ]
    },
    {
      path: '/d',
      component: D,
      redirect: '/d/e',
      children: [
        {
          path: 'e',
          component: E
        }
      ]
    }
  ]
```

- 在没有keep-alive的情况下

  `/a`到`/b`到`/c`之间任意切换，`HelloWorld`只在第一次加载时被渲染，A，B，C在每次切换时都会重新加载；

  `/a`到`/d`之间切换，HelloWorld，A与D，E每次切换时都会重新加载。

- 在一级路由的`router-view`中使用keep-alive

  `/a`到`/b`到`/c`之间任意切换，情况同上

  `/a`到`/d`之间切换，HelloWorld，A与D，E只在第一次加载时被渲染

- 在一级路由、二级路由的`router-view`中都使用keep-alive

  `/a`到`/b`到`/c`之间任意切换，`HelloWorld`，A，B，C都只在第一次加载时被渲染

  `/a`到`/d`之间切换，HelloWorld，A与D，E只在第一次加载时被渲染



### vue中实现前进刷新，后退不刷新

- 直接使用keep-alive

  这是肯定不行的，keep-alive会缓存所有加载过的页面，无法再后退之后销毁前一个页面，做到前进到这个页面时再刷新。

- [vue-navigation](https://juejin.im/entry/597ed87c51882555bf61b38e)

  在嵌套路由中还存在问题

  在使用路由进行Tab页切换时就没有所谓的前进后退，使用vue-navigation就存在问题

- 利用vue-router中的**scrollBehavior**（**这个功能只在支持 `history.pushState` 的浏览器中可用，第三个参数 `savedPosition` 当且仅当 `popstate`导航 (通过浏览器的 前进/后退 按钮触发，或者在地址栏输入url回车时触发) 时才可用。**）

#### scrollBehavior

> scrollBehavior只在HTML5 history模式下可用？实验了hash模式下好像也是可以用的

`savedPosition` 取值有三种情况：

- null：每次pushstate的时候key值都是最新的，没有缓存所以返回null，而执行popstate的时候state里面的key都有缓存，则返回上次离开时候的滚动坐标。
- undefined
- {x: 0, y: 0}

`vue-router`源码中获取`savedPosition`的源码为：

```javascript
function getScrollPosition (): ?Object {
  const key = getStateKey()
  if (key) {
    return positionStore[key]
  }
}
```

> 当`positionStore`里面没有找到对应当前key的数据时就会返回`undefined`。为什么会没找到当前key呢，因为在刷新页面之后，vue-router会进行初始化，当前路由状态没有在history上注册，即`window.history.state`为null。此时在进行前进后退操作时，会触发popstate来获取当前页面信息，但是由于前面所说的路由状态未注册，所以无法找到匹配的位置信息，返回`undefined`

刷新导致的scrollBehavior问题，在vue-router2.8版本中修复见[issue1585](https://github.com/vuejs/vue-router/issues/1585)

#### 利用scrollBehavior实现前进刷新，后退不刷新

app.vue

```vue
<template>
  <div id="app">
    <img src="./assets/logo.png">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"/>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"/>
  </div>
</template>
<!-- 也可以在router.afterEach修改keep-alive的include -->
```

route/index.js

```javascript
scrollBehavior (to, from, savedPosition) {
    if (savedPosition) { // 点击前进后退按钮或者手动输入地址
      from.meta.keepAlive = typeof from.meta.keepAlive === 'undefined' ? undefined : false
      to.meta.keepAlive = typeof to.meta.keepAlive === 'undefined' ? undefined : true
      return savedPosition
    } else if (typeof savedPosition === 'undefined') { // 刷新页面后点击前进后退按钮或者手动输入地址
      from.meta.keepAlive = typeof from.meta.keepAlive === 'undefined' ? undefined : false
      to.meta.keepAlive = typeof to.meta.keepAlive === 'undefined' ? undefined : true
    } else { // 非手动输入的路由跳转
      from.meta.keepAlive = typeof from.meta.keepAlive === 'undefined' ? undefined : true
      to.meta.keepAlive = typeof to.meta.keepAlive === 'undefined' ? undefined : false
    }
  }
```

由于移动端一般不会手动输入路由地址或者点击前进按钮，只有点击返回键触发后退操作时savedPosition才会有值，故可以用来判断当前路由是前进还是后退，从而结合keep-alive实现前进刷新，后退不刷新。



参考文章：

[《Vue.js技术揭秘》之keep-alive](https://ustbhuangyi.github.io/vue-analysis/extend/keep-alive.html)

[内置组件——keep-alive](https://cn.vuejs.org/v2/api/#keep-alive)

[**vue vue-router 完美实现前进刷新，后退不刷新**](https://www.imooc.com/article/47625?block_id=tuijian_wz)