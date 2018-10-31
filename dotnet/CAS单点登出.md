> 在简单情况下，应用程序注销和CAS注销之间相互没有影响，结束应用程序会话不会结束CAS会话，结束CAS会话不会影响应用程序会话。

### CAS登出

根据CAS协议，``/logout``断点负责销毁当前的SSO会话。注销时，也可能需要将其重定向回服务。这通过``service``参数指定重定向链接来控制。

重定向行为默认关闭，并通过以下设置激活`cas.properties`：

```
# Specify whether CAS should redirect to the specified service parameter on /logout requests
# cas.logout.followServiceRedirects=false
```

要禁用单个注销，请在`cas.properties`文件中调整以下设置：

```
# To turn off all back channel SLO requests set slo.disabled to true
# slo.callbacks.disabled=false
```

