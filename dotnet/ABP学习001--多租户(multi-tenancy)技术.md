# ABP学习001--多租户(multi-tenancy)技术

> 概念：它是一种软件架构技术，是在探讨与实现如何在多用户的环境下共用相同的系统或程序组件，并仍可确保各种用户间数据的隔离性。

- SaaS(Software-as-a-Service)软件即服务：软件资源

- PaaS(Platform-as-a-Service)平台即服务：硬件资源

- IaaS(Infrastructure as a Service)基础设施即服务

  [参考链接](http://www.chinacloud.cn/show.aspx?id=19758&cid=18)

> 现代软件一般属于多用户的应用，也就是说一台机器同一套软件可以为多个用户建立各自的账户，也允许拥有这账户的用户同时登陆这台计算机。这就涉及到计算机用户和资源的管理。

## 实现方式

- 不同租户间应用程序环境的隔离：通过进程或是支持多应用程序同时运行的装载环境（例如Web Server，像是Apache或IIS等）来做进程间的隔离，或是在同一个伺服程序（server）进程内以线程的方式隔离。
- 不同租户间数据的隔离：通过不同的机制将不同租户的数据隔离
- 多租户一般用来创建SaaS(软件即服务）应用程序，SaaS多租户在数据存储上存在三种主要的方案：
  - 独立数据库：即一个租户一个数据库，这种方案的用户数据隔离级别最高，安全性最好，但成本也高。
  - 共享数据库，隔离数据架构：即多个或所有租户共享Database，但一个Tenant一个Schema。
  - 共享数据库，共享数据架构：即租户共享同一个Database、同一个Schema，但在表中通过TenantID区分租户的数据。这是共享程度最高、隔离级别最低的模式（这是真正的多租户构架）。


## ABP中的多租户

1. 开启多租户（默认多租户是被禁用的，我们需要在模块的PreInitialize方法中开启它）

    ``Configuration.MultiTenancy.IsEnabled = true;``


2. 租户&&Host

 - 租户：租客有它自己的用户，角色，权限，设置等，并使用应用程序与其他租户完全隔离。多租户应用将拥有一个或多个租户。
 - Host：Host是单例的（只有唯一一个Host).Host负责创建和管理租户。所以，Host用户处于一个更高的层次，它独立于租户并且能够控制他们。

3. Session

    ABP定义IAbpSession接口来获取当前用户和租户id。因此,它可以基于当前租户的id过滤数据。

    ```c#
    public interface IAbpSession
    {

        long? UserId { get; }

        int? TenantId { get; }

        MultiTenancySides MultiTenancySide { get; }

        long? ImpersonatorUserId { get; }

        int? ImpersonatorTenantId { get; }

        IDisposable Use(int? tenantId, long? userId);
    }
    ```
     - 如果两个用户id和TenantId是null，那么当前用户没有登录到系统中。
     - 用户id(如果不为空，TenantId为空的，然后我们可以知道当前用户是一个主机用户。
     - 用户id(如果不为空，TenantId为空的，然后我们可以知道当前用户是一个主机用户。

4. 判断当前租户

    默认会话(ClaimsAbpSession)使用不同的方式以给定的顺序来找到与当前请求相关的租户

    - 如果用户已经登录，那么从当前声明(claims)中取得租户ID，声明的唯一名字是：``http://www.aspnetboilerplate.com/identity/claims/tenantId`` 并且该声明应该包含一个整型值。如果在声明中没有发现，那么该用户被假设为Host用户。
    - 如果用户没有登录，那么它会尝试从 **tenant resolve contributors(暂翻译为：租户解析参与者)** 中解析租户ID。详情见官方文档，此处不再赘述


5. Tenant Store

   > ``DomainTenantResolveContributer`` 使用 ``ITenantStore`` 通过租户名来查找租户ID。``NullTenantStore`` 默认实现了 ``ITenantStore``接口，但是它不包含任何租户，对于查询仅仅返回null值。当你需要从数据源中查询时，你可以实现并替换它。在 ``Module Zero`` 的 ``Tenant Manager``中(Zero.Core/MutiTenancy/TenantManager.cs)已经实现了该扩展。


6. 数据过滤

   当我们从数据库检索实体，我们必须添加一个TenantId过滤当前的租户实体。当你实现了接口：IMustHaveTenant或IMayHaveTenant中的一个时，ABP将自动完成数据过滤。

   ```C#
   //这个接口通过TenantId属性来区分不同的租户的实体
   public class Product : Entity, IMustHaveTenant
   {
       public int TenantId { get; set; }
           
       public string Name { get; set; }
       
       //...其它属性
   }
   ```


   ```C#
   我们可能需要在Host和租户之间共享实体类型
   public class Role : Entity, IMayHaveTenant
   {
   	//null值表示这是一个Host实体，否则表示这被一个租户拥有
       public int? TenantId { get; set; }
       
       //可以使用相同的角色类存储主机角色和租户的角色
       public string RoleName { get; set; }
       
       //...其它属性
   }
   ```

