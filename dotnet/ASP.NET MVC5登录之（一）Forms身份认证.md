> 使用Forms身份验证时，用户信息存储在外部数据源中，例如Membership数据库，或存储在应用程序配置文件中。在用户通过身份验证后，Forms 身份验证即会在 Cookie 或 URL 中维护一个身份验证票证，这样已通过身份验证的用户就无需在每次请求时都提供凭据了。

> Forms鉴别的几个配置细节：
>
> cookieless——用于配置应用程序即使浏览器不支持cookie特性，也能使用Forms鉴别。可能的取值有UseCookies、UseUri、AutoDetect和UseDeviceProfile。默认值是UseDeviceProfile；
>
> defaultUrl——用于指定用户通过鉴别后重定向的目标。默认值是Default.aspx；
>
> domain——用于指定与鉴别cookie相关的域。默认值是空字符串；
>
> enableCrossAppRedirects——用于通过传递查询字符串中的鉴别凭证来在应用程序之间鉴别用户。默认值是false；
>
> loginUrl——用于指定Login页面的路径。默认值是Login.aspx；
>
> name——用于指定鉴别cookie的名字。默认值为.ASPXAUTH；
>
> path——用于指定和鉴别与cookie相关联的路径。默认值是/；
>
> protection——用于指定如何对鉴别cookie进行加密。可能的取值有All、Encryption、None和Validation。默认值是All；
>
> requiresSSL——用于指定在传递鉴别cookie时是否需要使用SSL（安全套接字层）连接。默认值是false；
>
> slidingExpiration——用于防止鉴别cookie在连续周期性访问中过期。可能的取值是true或false；
>
> timeout——用于指定以分钟为单位的鉴别cookie的过期时间数。默认值是30。

> 通常情况下，Forms鉴别使用cookie来对用户进行识别。然而，Forms鉴别还支持一个名为无cookie鉴别的特性。启用无cookie鉴别后，就可以在不依靠浏览器cookie的情况下识别用户。
>
> 利用无cookie鉴别功能，将可以在不支持cookie或禁用了cookie功能的浏览器中使用Forms鉴别和ASP.NET Membership。
>
> 当启用无cookie鉴别功能后，用户将通过一串添加到页面URL中的唯一的字符串标识来进行识别。如果用户在应用程序的相关页面间来回导航，那么字符串标识也将自动地在这些页面间进行传递，同时应用程序会在这样的页面交叉请求中自动识别用户。
>
> 当访问一个需要鉴别且又开启了无cookie鉴别功能的页面时，浏览器地址栏中的URL看起来将会像这样：
>
> http://localhost:2500/Original/(F(WfAnevWxFyuN4SpenRclAEh_lY6OKWVllOKdQkRk
>
> tOqV7cfcrgUJ2NKxNhH9dTA7fgzZ-cZwyr4ojyU6EnarC-bbf8g4sl6m4k5kk6Nmcsg1))/
>
> SecretFiles/Secret2.aspx
>
> 在URL中那串又长又丑的代码就是编码过的用户鉴别凭证。
>
> Web配置文件中的forms节点的cookieless属性被用来配置无cookie鉴别的类型。cookieless属性可以接受下列四种类型中的任意一种：
>
> UseCookies——总是使用cookie进行鉴别，无论浏览器或设备是否支持cookie；
>
> UseUri——使用查询字符串保存鉴别标识，无论浏览器或设备是否支持cookie；
>
> AutoDetect——ASP.NET自动检测浏览器或设备是否支持cookie，从而确定如何传递用户识别凭证；
>
> UseDeviceProfile——ASP.NET根据System.Web.HttpBrowserCapabilities设置来确定是否使用cookie来传递用户识别凭证。
>
> 该属性的默认值是UseDeviceProfile。在默认情况下，只有当特定的设备类型支持cookie时，ASP.NET Framework才会生成cookie信息。ASP.NET Framework通过下面的目录中的一组文件来维护一个设备性能数据库。
>
> \WINDOWS\Microsoft.NET\Framework\[version]\CONFIG\Browsers

### ASP.NET身份认证过程

在ASP.NET中，身份认证过程分为两个部分：

1. 认证：识别当前请求的用户是否为可识别（已登录）用户；
2. 授权：根据认证中识别的用户决定是否允许当前用户的请求访问指定的资源。

其中Forms认证由``FormsAuthenticationModule``实现，URL授权检查由``UrlAuthorizationModule``实现

### 认证（登录与登出的实现）

```c#
//登录
public static bool SignOn(string username,string password,bool persist)
{
	InterfaceUserService userService = null;
    if (userService == null)
    {
        userService = new UserService();
    }
	//此处省略参数合法性验证	
  
	//验证用户名密码是否正确，若正确则设置Cookie
    if (userService.Validate(username, password))
    {
        SetAuthenticationTicket(username, persist);
      	HttpCookie authCookie = FormsAuthentication.GetAuthCookie(username,persist);
        HttpContext.Current.Response.Cookies.Remove(authCookie.Name);
        HttpContext.Current.Response.Cookies.Add(authCookie);
        return true;
    }
    else
    {
        return false;
    }
}

//登出
public static void LogOut()
{
	HttpCookie authCookie = new HttpCookie(FormsAuthentication.FormsCookieName);
    //使cookie强制过期
    authCookie.Expires = DateTime.Now.AddYears(-30);
    authCookie.Path = HttpContext.Current.Request.ApplicationPath;

    HttpContext.Current.Response.Cookies.Add(authCookie);
    //退出登录后执行页面重定向到主页操作
}

//获取登录用户名部分代码，AuthenticationMoudel类中的UserName属性
public string UserName
{
    get
    {
        var httpContext = HttpContext.Current;
        if (httpContext != null &&
            httpContext.Request != null &&
            httpContext.Request.IsAuthenticated)
        {
            try
            {
                return httpContext.User.Identity.Name;
            }
            catch
            {

            }
        }
        else
        {
            return null;    
        }
    }
}
```

对于Forms认证，我们需要在``Web.config``的<system.web>节点部分添加以下内容：

```xml
<authentication mode="Forms" >
    <forms cookieless="UseCookies" 
           name="LoginCookieName" 
           loginUrl="~/Default.aspx"/>
</authentication>
```

该部分指定了身份验证模式为Forms，Cookie的使用方式，Cookie名称，默认登录页面(当未认证或认证失败时会跳转到默认登录页)。

> 为何要设置Cookie呢？
>
> 因为Forms的身份认证是通过Cookie来维持的，且该Cookie是加密过的HttpOnly Cookie(无法在浏览器端更改的Cookie)

### 授权

授权的问题就是用户与用户组权限的问题，根据当前登录用户及其所属用户组的权限来判断当前用户的请求是否能够访问目标资源。

Forms身份认证的授权也需要在``Web.config``的<system.web>节点中配置，示例如下：

```xml
<authorization>
	<allow users="admin"/>
  	<deny users="*"/>
</authorization>
```

### 自定义验证用户登录

#### 一、Filter

> ASP.NetMVC模式自带的过滤器Filter，是一种声明式编程方式，支持四种过滤器类型，分别是：Authorization(授权)，Action（行为），Result（结果）和Exception（异常）。

​									表1

| 过滤器类型         | 接口                   | 描述                                     |
| ------------- | -------------------- | -------------------------------------- |
| Authorization | IAuthorizationFilter | 此类型（或过滤器）用于限制进入控制器或控制器的某个行为方法          |
| Action        | IActionFilter        | 用于进入行为之前或之后的处理                         |
| Result        | IResultFilter        | 用于返回结果的之前或之后的处理                        |
| Exception     | IExceptionFilter     | 用于指定一个行为，这个被指定的行为处理某个行为方法或某个控制器里面抛出的异常 |

> 但是默认实现它们的过滤器只有三种，分别是ActionFilter（方法），Authorize（授权），HandleError（错误处理）；各种信息如下表所示：

​									表2

| 过滤器         | 类名                    | 实现接口                        |
| ----------- | --------------------- | --------------------------- |
| Authorize   | AuthorizeAttribute    | IAuthorizationFilter        |
| HandleError | HandleErrorAttribute  | IExceptionFilter            |
| 自定义         | ActionFilterAttribute | IActionFilter和IResultFilter |

ASP.NET默认的身份验证过滤器是[Authorize]对应AuthorizeAttribute类

#### 二、通过自定义过滤器实现登录验证

> 表2中只写列实现表1中的接口，实际上ActionFilterAttribute继承了FilterAttribute、IActionFilter和IResultFilter.

**具体实现方法** 

```C#
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = false)]
public class AuthenticatedAttribute:FilterAttribute, IActionFilter
{  
    public void OnActionExecuted(ActionExecutedContext filterContext)
    {
            
    }

    public void OnActionExecuting(ActionExecutingContext filterContext)
    {
    	//此处AuthenticationMoudel类中的UserName属性已在认证模块中定义
        if (string.IsNullOrEmpty(AuthenticationMoudel.UserName))
        {
            filterContext.Result = new HttpUnauthorizedResult();
        }
    }
}  
```

最后在需要登录验证的地方打下自定义的Filter的标签``[Authenticated]`` 

```c#
[Authenticated]
public class HomeController : Controller  
{  
    public ActionResult Index()  
    {  
        ViewBag.Message = "欢迎使用 ASP.NET MVC!";  
        return View();  
    }  
}
```

#### 三、使用系统的AuthorizeAttribute验证登录

```c#
public class AuthenticationAttribute : AuthorizeAttribute
{
  public override void OnAuthorization(AuthorizationContext filterContext)
  {
    //base.OnAuthorization(filterContext);
    //如果控制器没有加AllowAnonymous特性或者Action没有加AllowAnonymous特性才检查
    if (!filterContext.ActionDescriptor.IsDefined(typeof(AllowAnonymousAttribute),true) && !filterContext.ActionDescriptor.ControllerDescriptor.IsDefined(typeof(AllowAnonymousAttribute),true))
    {
      //此处写判断是否登录的逻辑代码
      HttpCookie cookie = filterContext.HttpContext.Request.Cookies["Member"];
      if (!(cookie!=null && cookie.Values["name"] == "test" && cookie.Values["pass"] == "123"))       {
        filterContext.Result = new RedirectResult("/Member/Login");
      }
    }
  }
}
```

> 若加了Authentication过滤器的控制器中有需要匿名访问的方法，可以在方法前面添加[AllowAnonymous]过滤器

另一种写法是继承FilterAttribute 并实现接口IAuthorizationFilter，方式与系统的AuthorizeAttribute类似

参考文章：1. [细说ASP.NET Forms身份认证](http://www.cnblogs.com/fish-li/archive/2012/04/15/2450571.html)

​		   2. [ASP.Net MVC Filter验证用户登录](http://blog.csdn.net/u010096526/article/details/46700581)







