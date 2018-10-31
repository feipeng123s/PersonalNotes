# ASP.NET MVC登录验证方法总结

## 一、Filter

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

## 二、通过自定义过滤器实现登录验证

表2中只写列实现表1中的接口，实际上ActionFilterAttribute继承了FilterAttribute、IActionFilter和IResultFilter.

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
public class LoginFilter:ActionFilterAttribute  
{  
    /// <summary>  
    /// OnActionExecuting是Action执行前的操作  
    /// </summary>  
    /// <param name="filterContext"></param>  
    public override void OnActionExecuting(ActionExecutingContext filterContext)  
    {  
        //判断Cookie用户名密码是否存在  
        HttpCookie cookieName = System.Web.HttpContext.Current.Request.Cookies.Get("name");  
        if ( cookieName == null)  
        {  
            filterContext.Result = new RedirectResult("/Login/Index");  
        }  
    }  
}  
```

最后在需要登录验证的地方打下自定义的Filter的标签``[LoginFilter]`` 

 ## 三、使用系统的AuthorizeAttribute验证登录

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