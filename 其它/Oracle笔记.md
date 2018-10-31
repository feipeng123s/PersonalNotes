### 物化视图相关知识
- 创建物化视图语法   
```sql
create materialized view [view_name]
refresh [fast | complete | force]
[
on [commit | demand] | 
start with [start_time] next [next_time]
]
as
{创建物化视图的语句}
```
> 例子

```sql
--这个物化视图在每天10：25进行刷新
create materialized view mv_materialized_test refresh force 
on demand 
start with sysdate 
    next to_date(concat(to_char( sysdate+1,'dd-mm-yyyy'),'10:25:00'),'dd-mm-yyyy hh24:mi:ss') 
as
select * from user_info; 
```

- refresh [fast | complete | force]设置视图刷新方式
    - fast:增量刷新
    - complete:全部刷新
    - force:默认刷新方式
- mv数据刷新的时间
    - on demand:在用户需要刷新的时候刷新（手动或定时）
    - on commit:当主表中有数据提交的时候，立即刷新mv中的数据

>  There is no replace command with mv.

### drop table、truncate table和delete table的异同
- 相同点：都可以删除整个数据库表的记录
- 不同点
    - DELETE FROM 表名 WHERE 条件
        - DML语言(Data Manipulation Language)
        - 可以回退
        - 可以有条件的删除
    - TRUNCATE TABLE 表名
        - DDL语言(Data Define Language)
        - 无法回退
        - 默认所有的表内容都删除
        - 删除速度比delete快
    - DROP TABLE 表名
        - 用于删除表（表的结构、属性及索引也会被删除）

- TRUNCATE将重新设置高水平线和所有的索引，当表被清空后，表和表的索引将重新设置成初始大小


### 问题记录
- Oracle:ORA-00955: name is already used by an existing object   
[参考网址](http://www.cnblogs.com/heshan664754022/archive/2013/04/03/2998368.html)
```sql
select * from all_objects where object_name='HSPG_PRODUCT_SPEC_ALL_MV';
drop [public] synonym HSPG_PRODUCT_SPEC_ALL_MV;
```
> 经过Oracle的词法分析，本身就会将小写转成大写，直接大写减少了编译过程的时间，所以大写是一个好习惯!

### 使用SQLplus登录到DBA，解锁
- 系统中只安装一个数据库   
```bash
#在命令行状态下，先以正常用户登录，比如：
C:\>sqlplus scott/tiger
SQL>connect / as sysdba
已连接

#也可以直接在命令行下键入如下命令：
C:\>sqlplus "/ as sysdba"
```
当出现“已连接”时，表名用户已经有资格对数据库进行管理了。

```sql
SELECT *         
   FROM (SELECT ROW_NUMBER() OVER(PARTITION BY x ORDER BY y DESC) rn,         
         test1.*         
         FROM test1)         
  WHERE rn = 1  ;
```
**解锁**
```sql
--查看哪个表被锁
select b.owner,b.object_name,a.session_id,a.locked_mode 
from v$locked_object a,dba_objects b 
where b.object_id = a.object_id;

--查看哪个session引起的锁表
select b.username,b.sid,b.serial#,logon_time   
from v$locked_object a,v$session b   
where a.session_id = b.sid order by b.logon_time;

--查看引起死锁的select语句
select sql_text from v$sql where hash_value in (
    select sql_hash_value from v$session where sid in (select session_id from v$locked_object)
)

--杀掉对应进程
alter system kill session 'SID,SERIAL#';
```

### 表空间
- 查询表空间信息
```sql
--DBA_TABLESPACES数据字字典视图：用户可访问的表空间的描述
SELECT TABLESPACE_NAME 表空间名,
    EXTENT_MANAGEMENT 区管理,
    ALLOCATION_TYPE 分配方式,
    SEGMENT_SPACE_MANAGEMENT 段管理,
    CONTENTS 是否永久
FROM DBA_TABLESPACES;
    
--DBA_SEGMENTS数据字典视图：表空间中所有段的信息
SELECT tablespace_name 表空间名,
    segment_name 段名称,
    segment_type 段类型,
    extents 区,
    blocks 块,
    bytes 大小
FROM DBA_SEGMENTS
WHERE owner="SCOTT";

--DBA_DATA_FILES数据字典视图：所属表空间的数据文件
SELECT FILE_NAME 数据文件名,
    BLOCKS 块的个数,
    TABLESPACE_NAME 表空间名
FROM DBA_DATA_FILES;

--DBA_FREE_SPACES数据字典视图：表空间中空闲区的信息
SELECT TABLESPACE_NAME,
    FILE_ID,
    COUNT(*) 空闲区个数,
    SUM(blocks) 总空闲快
FROM DBA_FREE_SPACE;
```

--增加表空间大小
```sql
ALTER TABLESPACE tablespace_name
ADD DATEFILE 'file_path' SIZE 10M
AUTOEXTEND ON
NEXT 10M
MAXSIZE 1000M;
或者
ALTER DATEBASE
DATEFILE 'file_path'
RESIZE 500M;
```
```SQL
ALTER TABLESPACE TS_HOPETARGLE
ADD DATAFILE 'D:\ORADATA\TS_HOPETARGLE13.ORA' SIZE 1024M
AUTOEXTEND ON
NEXT 1024M
MAXSIZE 10240M;
```

新建表空间
```sql
--数据表空间
CREATE TABLESPACE TS_HOPETARGLE
DATAFILE '/data/oracledata/TS_HOPETARGLE.dbf'
SIZE 50m
AUTOEXTEND ON
NEXT 50m MAXSIZE 10240m
EXTENT MANAGEMENT LOCAL;

--临时表空间
CREATE TEMPORARY TABLESPACE TS_HOPETARGLE_TEMP
  TEMPFILE '/data/oracledata/TS_HOPETARGLE_TEMP.dbf'
SIZE 50m
AUTOEXTEND ON
NEXT 50m MAXSIZE 10240m
EXTENT MANAGEMENT LOCAL;

--创建用户
create user username identified by password  
default tablespace user_data  
temporary tablespace user_temp;  

--给用户授权
grant connect,resource,dba to username; 
```

删除用户和删除表空间
```sql
drop user xxxx cascade;
drop tablespace xxxx including contents and datafiles;
```