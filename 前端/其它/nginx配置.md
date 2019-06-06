## proxy_pass配置去除前缀

- proxy_pass后面加根路径`/`

  ```bash
  location ^~/user/ {
  	proxy_pass http://userDomain/;
  }
  ```

- 使用rewtite

  ```bash
  location ^~/user/ {
  	rewrite ^/order/(.*)$ /$1 break;
      proxy_pass http://userDomain;
  }
  ```

  

参考：[Nginx代理proxy pass配置去除前缀](https://www.cnblogs.com/woshimrf/p/nginx-proxy-rewrite-url.html)



  ## 配置gzip压缩

```bash
gzip  on;
gzip_http_version       1.1;        
gzip_comp_level         5;
gzip_min_length         1000;
gzip_types text/csv text/xml text/css text/plain text/javascript application/javascript application/x-javascript application/json application/xml;
```

参考： [前端开发者必备的nginx知识](<https://zhuanlan.zhihu.com/p/65393365>)

