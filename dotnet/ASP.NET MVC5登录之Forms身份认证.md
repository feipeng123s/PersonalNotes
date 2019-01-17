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

首次在登录控制器中创建保存用户信息的cookie（cookie是一种键值对模式）

```C#
public void CreateCookie()　　　//此Action自动往cookie里写入登录信息  
{  
    HttpCookie UserName = new HttpCookie("name");  
    UserName.Value = Request["userName"];  
    System.Web.HttpContext.Current.Response.SetCookie(UserName);  
    //cookie保存时间  
    UserName.Expires = DateTime.Now.AddHours(10);  
}  
```

然后在Filter中检查cookie中是否有用户信息

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
    	var userName = HttpContext.Current.User.Identity.Name;
        if (string.IsNullOrEmpty(userName))
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





## 跨应用程序使用Forms认证

在默认情况下，Forms鉴别的cookie是会加密和签名的。此外，每个程序默认都会各自生成独立的解密和校验码。因此，默认情况下不能在应用程序间共享鉴别cookie。

通过Web配置文件的machineKey节点，可以设置该加密密钥和校验码：

```xml
<machineKey decryption="Auto"
            validation="SHA1"
            decryptionKey="AutoGenerate, IsolateApps"
            validationKey="AutoGenerate, IsolateApps" />
```

**解码（decryption）**属性用于指定Forms鉴别中cookie的加密和解密算法，其取值有Auto、AES（政府标准加密算法）或3DES（三倍加密强度的DES）。decryption属性默认值为Auto，该值说明ASP.NET Framework将基于当前Web服务器端的性能来选取综合性能最佳的加密算法。

**验证（validation）**属性指定用于对鉴别cookie进行散列和加密的算法，其取值为AES、MD5、SHA1或TripleDES（即3DES）。

**decryptionKey**属性表示用于对鉴别cookie进行加密和解密的密钥。

**validationKey**表示用于对鉴别cookie进行签名的验证码。

在默认情况下，这两个属性值都会被设置为AutoGenerate，该值表示ASP.NET Framework将产生随机密钥，并将其存储在LSA（本地安全鉴别）中。

需要注意的是，decryptionKey和validationKey两个属性都包含一个IsolateApps修饰符。当IsolateApps修饰符出现时，将为同一Web服务器端上的每个应用程序创建唯一的密钥。

- 如果希望在同一Web服务器端上的不用应用程序之间共享同一鉴别cookie信息，那么则需要重写服务器端上Web配置文件中的machineKey节点，并从该节点的decryptionKey和validationKey两个属性中去掉IsolateApps修饰符。如下：

  ```xml
  <machineKey decryption="Auto"
            validation="SHA1"
            decryptionKey="AutoGenerate"
            validationKey="AutoGenerate" />
  ```

  根Web配置文件位于下面的路径：``C:\WINDOWS\Microsoft.NET\Framework\[version]\CONFIG\Web.Config``

- 如果要共享不同Web服务器端上的应用程序的鉴别cookie信息，那么就需要手动指定decryptionKey和validationKey的属性值。由于需要共享不同Web服务器端上的密钥，所以就不能让ASP.NET Framework来自动产生这些密钥。如下：

  ```xml
  <machineKey decryption="AES"
              validation="SHA1"
   decryptionKey="306C1FA852AB3B0115150DD8BA30821CDFD125538A0C606DACA53DBB3C3E0AD2"
  validationKey="61A8E04A146AFFAB81B6AD19654F99EA7370807F18F5002725DAB98B8EFD19C711337E26948E26D1D    174B159973EA0BE8CC9CAA6AAF513BF84E44B2247792265" />
  ```

显式指定了密钥的machineKey节点既可以加入服务器端的Web配置文件，也可以加入特定应用程序的Web配置文件。如果不希望同一Web服务器端上的所有应用程序之间都共享同一密钥，那么就只应将该machineKey节点加入到需要相互共享的应用程序的配置文件中。

> 《如何：在ASP.NET 2.0中配置MachineKey》



## 跨域使用Forms认证

> 如何才能在多个域之间共享同一个鉴别cookie呢？

> 解决这个问题的方法是使用查询字符串来代替cookie传递鉴别凭证。因为在不同的域之间传递查询字符串是没有任何障碍的。

通过设置enableCrossAppRedirects属性可以启用跨域的鉴别凭证共享:

```xml
<?xml version="1.0"?>
<configuration>
<system.web>
    <authentication mode="Forms">
      <forms enableCrossAppRedirects="true" />
    </authentication>
    <machineKey
      decryption="AES"
      validation="SHA1"
    decryptionKey="306C1FA852AB3B0115150DD8BA30821CDFD125538A0C606DACA53DBB3C3E0AD2"
validationKey="61A8E04A146AFFAB81B6AD19654F99EA7370807F18F5002725DAB98B8EFD19C711337
      E26948E26D1D174B159973EA0BE8CC9CAA6AAF513BF84E44B2247792265" />
</system.web>
</configuration>
```

将上述配置添加到位于不同域中的两个应用程序中后，这两个应用程序就将能共享同一个鉴别凭证。

## 使用FormsAuthentication类

使用Froms鉴别的主要API是FormsAuthentication类。

- 该类支持下列属性：

  CookieDomain——用于返回鉴别cookie关联的域；

  CookieMode——用于返回cookieless鉴别模式。可能的取值有AutoDetect、UseCookies、Use- DeviceProfile和UseUri；

  CookiesSupported——如果浏览器支持cookie和Forms鉴别，并同时启用了cookie功能，那么将返回true；

  DefaultUrl——用于返回用户鉴别成功后所转向的页面URL；

  EnableCrossAppRedirects——当鉴别凭证可以通过查询字符串进行传递时，该属性返回true；

  FormsCookieName——用于返回鉴别cookie的名字；

  FormsCookiePath——用于返回和鉴别cookie相关联的路径；

  LoginUrl——用于返回用户鉴别时所转向的页面URL；

  RequireSSL——如果鉴别cookie必须使用SSL协议来传输，则该属性返回true；

  SlidingExpiration——如果鉴别cookie使用超时限制策略，那么该属性返回true。

  这些属性主要用于返回Web配置文件中对Forms鉴别的配置信息。

- FormsAuthentication类还支持以下的方法：

  Authenticate——用于根据存储在Web配置文件中的用户名和密码来验证用户名和密码；

  Decrypt——用于解密鉴别cookie；

  GetAuthCookie——用于获取鉴别cookie；

  GetRedirectUrl——用于获取重定向到Login页面上前的原始页面路径；

  HashPasswordForStoringInConfigFile——用于对将要存入Web配置文件中的密码进行散列；

  RedirectFromLoginPage——用于使用户返回重定向到Login页面前的原始页面；

  RedirectToLoginPage ——用于将用户请求重定向到Login页面；

  RenewTicketIfOld——用于更新已过期的鉴别cookie凭证；

  SetAuthCookie——用于创建和发布鉴别cookie；

  SignOut——用于移除用户鉴别cookie并同时使其登出应用程序。

  

参考文章：1. [细说ASP.NET Forms身份认证](http://www.cnblogs.com/fish-li/archive/2012/04/15/2450571.html)

​		   2. [ASP.Net MVC Filter验证用户登录](http://blog.csdn.net/u010096526/article/details/46700581)







