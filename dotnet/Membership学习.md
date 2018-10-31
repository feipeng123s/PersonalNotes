> Membership是什么？
>
> Membership是ASP.NET为我们提供的一套验证和存储用户凭证的框架。它可以帮助我们快速的开发用户登录、管理以及权限验证相关的模块。

#### Provider(提供程序模型)

要素：

- 具有良好定义的共有API（用抽象方法或接口方法暴露出特定功能）
- 要有一种配置机制（将具体的Provider与我们定义的功能集绑定起来）
- 需要一种加载机制



####使用ProfileProvider来扩展用户信息

它和MebershipProvider, RoleProvider一起组成了用户信息，权限管理这样一套完整的框架。



#### Simple Membership Provider

让用户不必再依赖于ProfileProvider去扩展用户信息



#### ASP.NET Identity（MVC5引入）

