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



  

