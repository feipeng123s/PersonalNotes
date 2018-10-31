**Author:** 李鹏   

**Finish time:** 2017.2.13    

单元测试报错信息在单元测试窗口的右侧，不是在下面的console窗口

<context:component-scan/>标签是告诉Spring 来扫描指定包下的类，并注册被@Component，@Controller，@Service，@Repository等注解标记的组件。

而<mvc:annotation-driven/>是告知Spring，我们启用注解驱动。然后Spring会自动为我们注册上面说到的几个Bean到工厂中，来处理我们的请求。

遇到的问题：
- Controller中的Service自动注入失败，通过直接new往下查找，发现根源是sessionFactory自动注入失败的问题：
    - 将xml配置文件移到了classpath路径下面
    - 导入aopalliance-1.0.jar
    - 导入连接MySQL数据库的驱动
- org.hibernate.HibernateException: Could not obtain transaction-synchronized Session for current thread   
 解决方法:
    - 在service的头层添加@Transactional注解
    - 在applicationContext.xml中配置事务
    ```xml
    <bean id="transactionManager" class="org.springframework.orm.hibernate4.HibernateTransactionManager">
	    <property name="sessionFactory" ref="sessionFactory"/>
	</bean>
	
	<tx:annotation-driven transaction-manager="transactionManager"/>
    ```

至此Spring整合Hibernate的坑总算填好了
