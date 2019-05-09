之前做过一个基于Cookie共享的CAS单点登录项目，现在整理一下实现原理

### Cookie共享

> 声明：在不同域（Domain）的情况下，是无法共享cookie的

按照HTTP协议规定，两个站点是可以共享Cookie的。前提是这两个站点是在同一个域名下面（或者是二级域名也可）。这种情况是属于同域下的Cookie。 

例如两个站点分别是``a.example.com``和``b.example.com``，顶级域名相同，我们只需要设置cookie的Domain为``example.com``，即可在这两个站点之间共享。

### 基于Cookie共享实现SSO的原理

CAS分为CAS Server和CAS Client两部分，CAS Server单独部署为一个Tomcat项目，CAS Client则整合到需要SSO服务的项目中去，用来和CAS Server进行通信。

#### 一次单点登录的完整过程

假设有A（a.example.com）、B（b.example.com）两个系统使用了一套CAS单点登录系统 

1. 用户首次访问A系统，发现未登录，重定向到CAS Sever的Login页面（https:cas-server/login?service=http:a.example.com，service参数表示登录成功后跳转的地址）

2. 在Login页面登录成功之后，CAS Service生成一个TGT(**Ticket Granting ticket** )，再用TGT生成一个ST(**Service Ticket**，存在时间短，且只能使用一次)，然后重定向到service参数的地址(A系统)，并返回ST和TGC(**Ticket-granting cookie**，它存放了TGT的id,保存在用户浏览器上)

3. A系统中集成的CAS Client获取ST，并在后台通过POST请求向CAS Server验证票据，若验证成功，首次登录完成

   > 本次背景下，A、B系统是基于.Net 的Form表单认证，故在验证ST成功后，会生成A系统的Cookie信息

4. 现在有一个操作，要从A系统跳转到B系统，则又会重定向到Login页面，此次由于cookie中含有TGC，故CAS Server会生成一个ST

5. 生成ST之后又重定向到B系统地址，CAS Client又去验证ST，验证成功，则B系统实现登录（生成B系统的Cookie信息）

### 基于代理的CAS单点登录

>Proxy认证与普通的认证其实差别不大，Step1，2与基础模式的Step1,2几乎一样，唯一不同的是，Proxy模式用的是PGT而不是TGC，是Proxy Ticket（PT）而不是Service Ticket 

参考文章：

[Cookie/Session的跨域共享](https://www.jianshu.com/p/d9b1c859bc99)

[基于CAS实现SSO单点登录](https://zhuanlan.zhihu.com/p/25007591)

