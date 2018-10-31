# 跨应用程序使用Forms认证

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



# 跨域使用Forms认证

> 如何才能在多个域之间共享同一个鉴别cookie呢？

>  解决这个问题的方法是使用查询字符串来代替cookie传递鉴别凭证。因为在不同的域之间传递查询字符串是没有任何障碍的。

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

#使用FormsAuthentication类

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