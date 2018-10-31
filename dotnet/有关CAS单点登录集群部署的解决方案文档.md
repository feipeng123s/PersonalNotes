# 有关CAS单点登录集群部署的解决方案文档

## 一、为运行cas的Tomcat配置负载均衡

由于服务器采用的阿里云，故负载均衡的具体操作详见阿里云文档（这个应该不难）

- 问题：在第一次登录路成功之后，使用ticket访问再次访问时，cookie认证失败``DEBUG [org.jasig.cas.web.support.CookieRetrievingCookieGenerator] - <Invalid cookie. Required remote address does not match 100.116.167.87``

  > 原因：CAS的Cookies检查以及写入程序使用request.getRemoteAddr()获取到的都是SLB的IP，并非实际客户端的IP，而且SLB的IP不固定（貌似阿里的SLB是一个N多台机器的玩意，每次一个页面请求过来，每个资源的请求IP都不同）。
  >
  > 解决方案：https://yq.aliyun.com/articles/47111

> 需要注意的是：通常我们在浏览器到代理服务器之间使用https，代理服务器到cas服务器之间使用http

## 二、在CAS项目中配置票据共享（JPA方式）

在网上搜索到的JPA实现方法，要么就是与我使用的CAS版本（4.1.10）不同，要么就是缺胳膊少腿，各种报错，最后在cas官方文档中查到了[4.1.x的JPA配置文档](https://apereo.github.io/cas/4.1.x/installation/JPA-Ticket-Registry.html)，在pom文件中使用的依赖都用最新版本

- 第一个问题，我将``<prop key="hibernate.hbm2ddl.auto"></prop>``设置为create-drop时，在执行创建语句出错，因为在oracle中没有boolean类型

  > 解决方案：将控制台中输出的SQL语句复制出来，将boolean替换为char类型，然后用这些SQL手动建表，并更改上面这个属性的值为none

- 第二个问题，在执行登录时会执行一条INSERT语句``insert into TICKETGRANTINGTICKET ...``，这控制台会打印一条红色INFO：``org.hibernate.engine.jdbc.batch.internal.AbstractBatchImpl.release HHH000010: On release of batch it still contained JDBC statements``

  然后就登录失败了

  > 解决方案：更换更低版本的Hibernate，如下
  >
  > ```xml
  > <dependency>
  >     <groupId>org.hibernate</groupId>
  >     <artifactId>hibernate-core</artifactId>
  >     <version>4.0.1.Final</version>
  > </dependency>
  >
  > <dependency>
  >     <groupId>org.hibernate</groupId>
  >     <artifactId>hibernate-entitymanager</artifactId>
  >     <version>4.0.1.Final</version>
  >     <scope>runtime</scope>
  > </dependency>
  > ```

除了上面两个依赖以外，配置JPA还需要的依赖如下：

```xml
        <dependency>
            <groupId>c3p0</groupId>
            <artifactId>c3p0</artifactId>
            <version>0.9.1.2</version>
        </dependency>
        <dependency>
            <groupId>com.oracle</groupId>
            <artifactId>ojdbc6</artifactId>
            <version>11.2.0.4.0-atlassian-hosted</version>
        </dependency>
```

# 配置Tomcat共享Session

