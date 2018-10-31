- 依赖注入的实现方法
    - set方法或者构建方法
    - 构造器方式注入（构造函数）
    - 通过调用工厂(factory)的方法来初始化类
    - 通过Autowired注解，Spring支持基于field方式的依赖注入
    - ~~XML文件配置方式~~

- Spring MVC和Structs1使用一个Servlet作为控制器，而Structs2则使用一个Filter作为控制器

- Spring MVC的DispatcherServlet

- Controller接口的实现类只能处理一个单一动作（Action），而一个基于注解的控制器可以同时支持多个请求处理动作，并且无需实现任何接口。

- Spring MVC中的视图解析器负责解析视图，通过定义ViewResolver来配置视图解析器。

- 基于注解的控制器的优点：
    - 可以处理多个动作
- 基于注解的控制器的请求映射不需要存储在配置文件中，使用RequestMapping注释类型，可以对一个方法进行请求处理
