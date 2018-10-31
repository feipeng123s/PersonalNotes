## 数据库出现乱码的问题
>数据库出现乱码的问题主要和客户的本地化环境，客户端NLS_LANG设置，服务器端的数据库字符集设置这三者有关，如果它们的设置不一致或者某个设置错误，就会很容易出现乱码。
- 数据库字符集设置不当引起的乱码

- 数据库字符集与客户端NLS_LANG设置不同引起的乱码

- 客户端NLS_LANG与本地化环境不同引起的乱码

## NLS_LANG参数的组成
>影响Oracle数据库字符集最重要的参数是NLS_LANG参数。   
它的格式如下: NLS_LANG = language_territory.charset   
它有三个组成部分(语言、地域和字符集)，每个成分控制了NLS子集的特性。  
其中:   
Language： 指定服务器消息使用的语言、日期中月份和日显示   
Territory： 指定服务器的货币和数字格式、地区和计算星期及日期的习惯  
Charset：  指定字符集。
如:AMERICAN _ AMERICA. ZHS16GBK，SIMPLIFIED CHINESE_CHINA.ZHS16GBK
>
>从NLS_LANG的组成我们可以看出，真正影响数据库字符集的其实是第三部分。   
所以两个数据库之间的字符集只要第三部分一样就可以相互导入导出数据，前面影响的只是提示信息是中文还是英文。

## 解决乱码问题
### 查看NLS_LANG
- windows  
``
echo %NLS_LANG%
``
- unix  
``
env | grep NLS_LANG
``
###  查看数据库当前字符集参数设置
```sql
SELECT * FROM v$nls_parameters;
```

### 客户端 NLS_LANG 的设置方法
- windows  
``set NLS_LANG=SIMPLIFIED CHINESE_CHINA.ZHS16GBK``  
可以通过修改注册表键值永久设置``HKEY_LOCAL_MACHINE\SOFTWARE\ORACLE\HOMExx\NLS_LANG``
- unix  
```bash
#在oracle用户目录下编辑.bash_profile 
vi .bash_profile
export NLS_LANG="SIMPLIFIED CHINESE_CHINA.ZHS16GBK"
source .bash_profile
```

### 更改server端字符集
```bash
$ sqlplus / as sysdba
SQL> shutdown immediate
SQL> startup mount
SQL> ALTER SYSTEM ENABLE RESTRICTED SESSION;
SQL> ALTER SYSTEM SET JOB_QUEUE_PROCESSES=0;
SQL> ALTER SYSTEM SET AQ_TM_PROCESSES=0;
SQL> alter database open;
--ALTER DATABASE CHARACTER SET ZHS16GBK;
SQL> ALTER DATABASE character set INTERNAL_USE ZHS16GBK;
SQL> shutdown immediate
SQL> startup
```