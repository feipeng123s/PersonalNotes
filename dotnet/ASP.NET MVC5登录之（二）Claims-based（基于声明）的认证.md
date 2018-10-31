> 对比我们传统的Windows认证和Forms认证，claims-based认证这种方式将认证和授权与登录代码分开，将认证和授权拆分成另外的web服务。服务调用者不需要关注如何去认证，如果用户登录成功，认证服务会返回一个令牌，令牌当中包含了服务调用者所需的信息（用户名、角色信息等）

- 实现登录只需一下几行代码

```c#
var _user = userService.Find(loginViewModel.UserName);
var _identity = userService.CreateIdentity(_user, DefaultAuthenticationTypes.ApplicationCookie);
AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
AuthenticationManager.SignIn(new AuthenticationProperties(){IsPersistent = loginViewModel.RememberMe},_identity);
```

```C#
/*UserService.cs*/
public ClaimsIdentity CreateIdentity(User user,string authenticationType)
{
	ClaimsIdentity _identity = new ClaimsIdentity(DefaultAuthenticationTypes.ApplicationCookie);
  	_identity.AddClaim(new Claim(ClaimTypes.Name,user.UserName));
  	_identity.AddClaim(new Claim(ClaimTypes.NameIdentifier,user.UserID.ToString()));
  	_identity.AddClaim(new   						Claim("http://schemas.microsoft.com/accesscontrolservice/2010/07/claims/identityprovider", "ASP.NET Identity"));
  	_identity.AddClaim(new Claim("DisplayName", user.DisplayName));
    return _identity;
}
```
- 使用基于声明的认证时，需要如下配置：

```C#
   /*Startup.Auth.cs*/
	public partial class Startup
    {
        public void ConfigureAuth(IAppBuilder app)
        {
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                LoginPath = new PathString("/Account/Login"),
                CookieSecure = CookieSecureOption.Never
            });
        }
    }
```

```C#
	public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            //调用上一个部分类中的ConfigureAuth方法
            ConfigureAuth(app);
        }
    }
```



- ClaimsIdentity以及ClaimsPrincipal类，它们继承了接口IIdentity和IPrincipal

  ```c#
  public interface IIdentity {
      // Access to the name string
      string Name { get; }
   
      // Access to Authentication 'type' info
      string AuthenticationType { get; }
   
      // Determine if this represents the unauthenticated identity
      bool IsAuthenticated { get; }
  }

  public interface IPrincipal {
      // Retrieve the identity object
      IIdentity Identity { get; }
   
      // Perform a check for a specific role
      bool IsInRole (string role);
  }
  ```

  每一个线程都会关联一个Principal的对象，但是这个对象是属性进程或者AppDomain级别的。ASP.NET自带的 RoleProvider就是基于这个对象来实现的。

  > 在.NET4.5以前，对于GenericIdentity只要设置它的Name的时候IsAutheiticated就自动设置为true了，而对于ClaimsIdentity是在它有了第一个Claim的时候。在.NET4.5以后，我们就可以灵活控制了，默认ClaimsIdentity的IsAutheiticated是false，只有当我们构造函数中指定Authentication Type，它才为true。



#### OWin authentication

在新建一个MVC5程序且使用自带的登录时，VS默认会为我们加上以下dll:

- OWin.dll
- Microsoft.Owin.dll
- Microsoft.Owin.Host.SystemWeb
- Microsoft.Owin.Security
- Microsoft.Owin.Security.Cookie

若不使用自带登录，则可以通过NuGet包管理器安装，实例如下：

```powershell
PM> Install-Package Microsoft.Owin.Security.Cookies
```

除了多了这些dll以外，VS还自动帮我们移除了FormsAuthenticationModule

```xml
<system.webServer>
    <modules>
      <remove name="FormsAuthentication" />
    </modules>
</system.webServer>
```

> FormsAuthenticationModuel没有了，谁来负责检测cookie？

VS除了为我们引用OWin相关dll，以及移除FormsAuthenticationModule以外，还为我们在App_Start文件夹里添加了一个Startup.Auth.cs的文件

```c#
public partial class Startup
{
    public void ConfigureAuth(IAppBuilder app)
    {
        // 配置Middleware 組件
        app.UseCookieAuthentication(new CookieAuthenticationOptions
        {
            AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
            LoginPath = new PathString("/Account/Login"),
            CookieSecure = CookieSecureOption.Never,
        });
    }
}
```

UseCookieAuthentication是一IAppBuilder 的一个扩展方法，定义在Microsoft.Owin.Security.Cookies.dll中

```c#
public static IAppBuilder UseCookieAuthentication(this IAppBuilder app,
    CookieAuthenticationOptions options)
{
    if (app == null)
    {
        throw new ArgumentNullException("app");
    }
    app.Use(typeof(CookieAuthenticationMiddleware), app, options);
    app.UseStageMarker(PipelineStage.Authenticate);
    return app;
}
```

UseCookieAuthentication主要调用了两个方法:

- IAppBuilder.Use ： 添加OWin middleware 组件到 OWin 管道
- IAppBuilder.UseStageMarker ： 为前面添加的middleware指定在IIS 管道的哪个阶段执行。

> 和Forms登录的过程一样，用户登录之后，我们需要生成cookie，这样用户下次访问的时候就不需要登录了，我们在Authenticate Request去检测有没有这个cookie就可以了，CookieAuthenticationMiddleware就负责做了这两件事情