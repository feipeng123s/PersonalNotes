> 由于CAS Server是一个web应用，因此可部署在Tomcat等容器中。直接部署CAS集群并使用负载均衡后，由于每次访问的CASServer不固定，会发生通行证（Ticket）丢失。故需要如下两步来解决这个问题

- 配置CAS实现票据共享

  对于cas ticket集群，目前测试通过的有三种方式：

  -   [jpa ticket repository](http://www.pinhuba.com/other/101349.htm)
  -   [echcache ticket repository](http://www.pinhuba.com/other/101350.htm)
  -   [memcached ticket  repository](http://www.pinhuba.com/other/101351.htm)

  **这里介绍jpa方式**

  默认配置下，CAS Server使用org.jasig.cas.ticket.registry.DefaultTicketRegistry把Ticket数据保存在 HashMap中，因此多台CAS Server无法共享数据。要实现Ticket共享，需要将Ticket信息从原来的内存存储变为数据库存储。

  修改CAS项目中的ticketRegistry.xml文件,在bean开头增加以下部分，不覆盖

  ```xml
  <!-- Ticket Registry -->
  <bean id="ticketRegistry" class="org.jasig.cas.ticket.registry.JpaTicketRegistry">
      <constructor-arg index="0" ref="entityManagerFactory" />
  </bean>

  	<bean id="entityManagerFactory" class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean">
          <property name="dataSource" ref="dataSource" />
          <property name="jpaVendorAdapter">
              <bean class="org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter">
                  <property name="generateDdl" value="true" />
                  <property name="showSql" value="${database.hibernate.show.sql}" />
              </bean>
          </property>
          <property name="jpaProperties">
              <props>
                  <prop key="hibernate.dialect">${database.hibernate.dialect}</prop>
                  <prop key="hibernate.hbm2ddl.auto">update</prop>
              </props>
          </property>
      </bean>

  	<bean id="transactionManager" class="org.springframework.orm.jpa.JpaTransactionManager"
          p:entityManagerFactory-ref="entityManagerFactory" />
      <tx:annotation-driven transaction-manager="transactionManager" />
      <!-- 数据源 -->
      <bean id="dataSource" class="org.apache.commons.dbcp.BasicDataSource" destroy-method="close">
          <property name="driverClassName" value="${database.driver}" />
          <property name="url" value="${database.url}" />
          <property name="username" value="${database.username}" />
          <property name="password" value="${database.password}" />
          <property name="maxActive" value="40" />
          <property name="maxIdle" value="30" />
          <property name="maxWait" value="10000" />
          <property name="defaultAutoCommit" value="true" />
          <property name="removeAbandoned" value="true" />
          <property name="removeAbandonedTimeout" value="30" />
          <property name="logAbandoned" value="false" />  
      </bean>
  ```

  其中所有的${...}符号均为Spring配置文件的替换符，接下来我们在cas.properties文件中增加这些替换符的配置,这样JPA的持久化就完成了

- 配置Tomcat实现Session复制

  理论上CAS将票据存储分离到了数据库中应该已经是无状态的了，但很遗憾，CAS 3.x中使用了Spring Web Flow框架，这个框架要求使用一个flowExecutionKey来确定流程位置，它正是存储在Session中。因此我们无法实现SNA（Share Nothing Architecture）

  对于TomcatSession复制方案：

  - udp session 复制(组播方式multicast)

    >首先配置CAS的web.xml中增加一行：
    >
    >```xml
    ><distributable />
    >```
    >
    >然后分别编辑两个Tomcat实例下的conf/server.xml,Engine元素下加入：
    >
    >  ```xml
    ><Cluster className="org.apache.catalina.ha.tcp.SimpleTcpCluster">
    >
    >    <Manager className="org.apache.catalina.ha.session.DeltaManager"
    >
    >           expireSessionsOnShutdown="false"
    >
    >           notifyListenersOnReplication="true"/>
    >
    >    <Channel className="org.apache.catalina.tribes.group.GroupChannel">
    >
    >        <Membership
    >
    >            className="org.apache.catalina.tribes.membership.McastService"
    >
    >            address="228.0.0.4"
    >
    >            port="45564"
    >
    >            frequency="500"
    >
    >            dropTime="3000"
    >
    >            mcastTTL="1"/>
    >
    >        <Receiver
    >
    >            className="org.apache.catalina.tribes.transport.nio.NioReceiver"
    >
    >            address="auto"
    >
    >            port="4000"
    >
    >            autoBind="0"
    >
    >            selectorTimeout="100"
    >
    >            maxThreads="6"/>
    >
    >        <Sender className="org.apache.catalina.tribes.transport.ReplicationTransmitter">
    >
    >          <Transport className="org.apache.catalina.tribes.transport.nio.PooledParallelSender"/>
    >
    >        </Sender>
    >
    >        <Interceptor className="org.apache.catalina.tribes.group.interceptors.TcpFailureDetector"/>
    >
    >        <Interceptor className="org.apache.catalina.tribes.group.interceptors.MessageDispatch15Interceptor"/>
    >
    >    </Channel>
    >
    >    <Valve className="org.apache.catalina.ha.tcp.ReplicationValve"
    >
    >           filter="..gif;..js;..jpg;..htm;..html;..txt;"/>
    >
    >    <ClusterListener className="org.apache.catalina.ha.session.ClusterSessionListener"/>
    >
    ></Cluster>
    >
    >  ```
    >
    >其中Membership元素的address和port是网络组播地址和端口，需要确认所在网络允许组播；
    >Receiver的port属性表示监听端口，如果两个应用在同一个机器上请设定两个不同的值

  - memcached-session-mamanger 方式

    **nginx配置**

    nginx.conf

    ```
    upstream cluster {

        server 127.0.0.1:8080;

        server 127.0.0.1:8081;

    }
    ```

    proxy.conf

    ```
    server {

    listen 8888;

    server_name 127.0.0.1;

    #access_log logs/access.log main;
    ```


        proxy_connect_timeout 60s;

        proxy_send_timeout 300s;

        proxy_read_timeout 300s;

        proxy_buffer_size 1024k;

        proxy_buffers 4 1024k;

        proxy_busy_buffers_size 1024k;

        proxy_temp_file_write_size 1024k;

        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504 http_404;

        proxy_max_temp_file_size 1024m;
        location ~ ^/DMGeoPortal/ {

        proxy_pass http://cluster;

             proxy_set_header Host host:server_port;

             proxy_set_header X-Real-IP $remote_addr;

        proxy_set_header REMOTE-HOST $remote_addr;

        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

    }

        location ~ ^/DMGeoSSO/ {

        proxy_pass http://cluster;

             proxy_set_header Host host:server_port;

             proxy_set_header X-Real-IP $remote_addr;

        proxy_set_header REMOTE-HOST $remote_addr;

        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

    }

    }
    ​```
    
    **Tomcat配置**
    
    context.xml
    
    ​```xml
    <Manager className="de.javakaffee.web.msm.MemcachedBackupSessionManager"
    
            memcachedNodes="n1:172.16.254.69:11211,n2:172.16.254.70:11211"
    
            sticky="false"
    
            sessionBackupAsync="false"
    
            sessionBackupTimeout="18000"
    
            transcoderFactoryClass="de.javakaffee.web.msm.serializer.javolution.JavolutionTranscoderFactory"
    
            copyCollectionsForSerialization="false"
    
    />
    ​```
    
    server.xml
    
    ​```xml
    <Engine name="Catalina" defaultHost="localhost">
    ​```
    
    >注意：当sticky为false时，不需要配置jvmRoute属性，当sticky为true时，一定要配置jvmRoute属性，且集群中所有tomcat的jvmRoute属性均不一样。sticky的属性默认为true。**在CAS服务器端集群和客户端集群环境下，需要将sticky配置为false，这样可以避免很多莫名其妙的session丢失问题。**
    
    > Sticky 模式：tomcat session 为 主session， memcached 为备 session。Request请求到来时， 从memcached加载备 session 到 tomcat (仅当tomcat jvmroute发生变化时，否则直接取tomcat session)；Request请求结束时，将tomcat session更新至memcached，以达到主备同步之目的
