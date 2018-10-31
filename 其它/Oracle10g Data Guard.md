# 搭建Data Guard基础环境
1. 更改主库为归档模式
```bash
SQL> shutdown immediate
SQL> startup mount
SQL> alter database archivelog;
SQL> alter database open;
#查看日志模式
SQL> archive log list;
```
2. 启用强制日志
```bash
SQL> alter database force logging;
SQL> select name, force_logging from v$database;
```
3. 设置standby_file_management
```bash
SQL> alter system set standby_file_management = 'AUTO';
```
4. 在主库生成备库日志文件(Standby Log Files)
```bash
SQL> alter database add standby logfile group 4 ('/data/app/oracle/oradata/orcl/STDBYREDO01.LOG') size 50M;
SQL> alter database add standby logfile group 5 ('/data/app/oracle/oradata/orcl/STDBYREDO02.LOG') size 50M;
SQL> alter database add standby logfile group 6 ('/data/app/oracle/oradata/orcl/STDBYREDO03.LOG') size 50M;
SQL> alter database add standby logfile group 7 ('/data/app/oracle/oradata/orcl/STDBYREDO04.LOG') size 50M;
```

5. 修改db_unique_name
```bash
#主库
SQL> alter system set db_unique_name='primary' scope=spfile;
#备库
SQL> alter system set db_unique_name='standby' scope=spfile;
```

6. 开启数据库闪回功能  
    6.1 先配置快速恢复区
    ```bash
    SQL> alter system set db_recovery_file_dest='/data/app/oracle/flash_recovery_area';
    SQL> alter system set db_recovery_file_dest_size=10G;
    ```
    6.2 启用闪回日志功能
    ```bash
    SQL> alter database flashback on;
    SQL> select flashback_on from v$database;
    ```

7. 更改主备库tnsnetstate.ora文件
```
#主库：
PRIMARY =
  (DESCRIPTION =
    (ADDRESS = (PROTOCOL = TCP)(HOST = centos-oracledg-primary)(PORT = 1521))
    (CONNECT_DATA =
      (SERVER = DEDICATED)
      (SERVICE_NAME = primary)
    )
  )

STANDBY =
  (DESCRIPTION =
    (ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.119)(PORT = 1521))
    (CONNECT_DATA =
      (SERVER = DEDICATED)
      (SERVICE_NAME = STANDBY)
    )
  )

#备库：
STANDBY =
  (DESCRIPTION =
    (ADDRESS = (PROTOCOL = TCP)(HOST = centos-oracledg-standby)(PORT = 1521))
    (CONNECT_DATA =
      (SERVER = DEDICATED)
      (SERVICE_NAME = standby)
    )
  )

PRIMARY =
  (DESCRIPTION =
    (ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.118)(PORT = 1521))
    (CONNECT_DATA =
      (SERVER = DEDICATED)
      (SERVICE_NAME = PRIMARY)
    )
  )

```

8. 重做日志传输配置
```bash
#配置归档位置
SQL> alter system set log_archive_dest_1 = 'location=/data/app/oracle/flash_recovery_area/ valid_for=(all_logfiles, all_roles) db_unique_name=primary';
#配置重做日志传输到备库
#SQL> alter system set log_archive_dest_2 = 'service=standby async valid_for=(online_logfile,primary_role) db_unique_name=standby';
SQL> alter system set log_archive_dest_2 = 'service=standby lgwr sync affirm valid_for=(online_logfile,primary_role) db_unique_name=standby';
#另一个要设置的参数是 FAL_SERVER。这个参数指定当日志传输出现问题时，备库到哪里去找缺少的归档日志
SQL> alter system set fal_server = 'standby';
SQL> alter system set fal_client = 'primary';
#让主库知道 Data Guard 配置里的另外一个库的名字
SQL> alter system set log_archive_config = 'dg_config=(primary,standby)';
```

9. 在主库执行如下命令，生成pfile文件
```bash
SQL> create pfile from spfile;
```
生成的initorcl.ora文件内容如下
```
orcl.__large_pool_size=4194304
orcl.__shared_pool_size=121634816
orcl.__streams_pool_size=0
*.aq_tm_processes=0
*.audit_file_dest='/data/app/oracle/admin/orcl/adump'
*.background_dump_dest='/data/app/oracle/admin/orcl/bdump'
*.compatible='10.2.0.1.0'
*.control_files='/data/app/oracle/oradata/orcl/control01.ctl','/data/app/oracle/oradata/orcl/control02.ctl','/data/app/oracle/oradata/orcl/control03.ctl'
*.core_dump_dest='/data/app/oracle/admin/orcl/cdump'
*.db_block_size=8192
*.db_domain=''
*.db_file_multiblock_read_count=16
*.db_name='orcl'
*.db_recovery_file_dest='/data/app/oracle/flash_recovery_area'
*.db_recovery_file_dest_size=10737418240
*.db_unique_name='parimary'
*.dispatchers='(PROTOCOL=TCP) (SERVICE=orclXDB)'
*.fal_client='primary'
*.fal_server='standby'
*.job_queue_processes=0
*.log_archive_config='dg_config=(primary,standby)'
*.log_archive_dest_1='location=/data/app/oracle/flash_recovery_area/ valid_for=(all_logfiles, all_roles) db_unique_name=primary'
*.log_archive_dest_2='service=standby async valid_for=(online_logfile,primary_role) db_unique_name=standby'
*.open_cursors=300
*.pga_aggregate_target=198180864
*.processes=150
*.remote_login_passwordfile='EXCLUSIVE'
*.sga_target=595591168
*.standby_file_management='AUTO'
*.undo_management='AUTO'
*.undo_tablespace='UNDOTBS1'
*.user_dump_dest='/data/app/oracle/admin/orcl/udump'
```
用scp命令将该配置文件复制到备库相同的目录下，并修改如下内容
```
*.db_unique_name='standby'
*.fal_client='standby'
*.fal_server='primary'
*.log_archive_dest_1='location=/data/app/oracle/flash_recovery_area/ valid_for=(all_logfiles, all_roles) db_unique_name=standby'
*.log_archive_dest_2 = 'service=primary lgwr sync affirm valid_for=(online_logfile,primary_role) db_unique_name=primary'
```

10. 为备库生成配置文件
```bash
SQL> alter database create standby controlfile as '/data/app/oracle/oradata/orcl/standby.ctl';
```
然后用scp命令复制到备库相同的目录下
```bash
scp standby.ctl oracle@192.168.1.119:/data/app/oracle/oradata/orcl/
#覆盖原有控制文件
cp standby.ctl control01.ctl
cp standby.ctl control02.ctl
cp standby.ctl control03.ctl
```

11. 启动备库
```bash
SQL>startup nomount pfile='/data/app/oracle/product/10.2.0/db_1/dbs/initorcl.ora'
SQL> create spfile from pfile;
SQL> shutdown
SQL> startup nomount
SQL> show parameter spfile
SQL> exit
```

12. 在主库创建catalog
```bash
SQL>create user rman identified by rman;
SQL>grant connect,resource,recovery_catalog_owner to rman;
SQL>conn rman/rman@primary
SQL> select * from session_privs;
$ rman target sys/Thoth123@primary catalog rman/rman@primary
RMAN> create catalog
RMAN> register database
```

13. 备份主库
```bash
RMAN> backup full format='/home/oracle/backup/ora_bak/data/db_jkka_%U' database include current controlfile for standby   
plus archivelog format='/home/oracle/backup/ora_bak/data/arc_jkka_%U';
```
然后将备份文件拷到备库相同目录下

14. 创建备库
```bash
RMAN> connect target sys@primary
RMAN> connect catalog rman@primary
RMAN> connect auxiliary /
RMAN> duplicate target database for standby nofilenamecheck;
```
因为是异机相同目录结构复制到备库,所以必须指定参数nofilenamecheck,不然rman会晕菜。  
如果不指定dorecover选项,则不进行日志恢复,物理备库创建完成后打开日志恢复自然就可以同步到主库一致的状态了。  
如果RMAN数据库备份有增量备份，则应该打开DORECOVER选项以便恢复增量备份集。

15. 在主备库上分别创建standby redo log
- 重建备库的online redo log
```bash
SQL> alter system set standby_file_management=manual;
SQL> alter system set LOG_FILE_NAME_CONVERT='/data/app/oracle/oradata/orcl/','/data/app/oracle/oradata/orcl/' scope=spfile;
SQL> shutdown immediate;
SQL> startup;

SQL> alter database clear logfile group 1;
SQL> alter database clear logfile group 2;
SQL> alter database clear logfile group 3;
SQL> alter system reset LOG_FILE_NAME_CONVERT;
SQL> shutdown immediate;  
SQL> startup;

SQL> alter system set standby_file_management=auto;
```
- 备库启动redo apply
```bash
alter system set log_archive_dest_state_2=enable;  
#在备库启动日志应用
ALTER DATABASE RECOVER MANAGED STANDBY DATABASE DISCONNECT FROM SESSION;
```
# 主备库切换
1. 首先需要配置故障转移，要确定你的客户端能连接到正确的数据库，你要在数据库里配置一个支持故障转移的服务，并配置客户端的 TNS，让它知道如何在一个 Data Guard 集群里找到主库。
- 首先，创建一个支持故障转移的服务。我们要创建此服务，确定它在主库上启动，并确定它只在主库上启动。创建服务使用如下 SQL：
```bash
SQL> begin
	DBMS_SERVICE.CREATE_SERVICE (
		service_name => 'PRIMARY_RW',
		network_name => 'PRIMARY_RW',
		aq_ha_notifications => TRUE,
		failover_method => 'BASIC',
		failover_type => 'SELECT',
		failover_retries => 30,
		failover_delay => 5);
end;
/
```
此服务在数据库出现故障时会发送通知给客户端，允许查询语句在故障转移发生后继续运行。我使用命名 SID_RW 显示这时一个可读写的数据库（主库）。

- 下一步是确定新创建的服务永远只在主库运行。我们创建一个存储过程来实现此目的，如果当前数据库是主库它就启动此服务，如果是备库就停止。
```bash
SQL> create or replace procedure cmc_taf_service_proc
is
	v_role VARCHAR(30);
begin
	select DATABASE_ROLE into v_role from V$DATABASE;
	if v_role = 'PRIMARY' then
		DBMS_SERVICE.START_SERVICE('PRIMARY_RW');
	else
		DBMS_SERVICE.STOP_SERVICE('PRIMARY_RW');
	end if;
end;
/
```
- 然后创建两个触发器，让数据库在启动和角色转换时运行此存储过程
```bash
SQL> create or replace TRIGGER cmc_taf_service_trg_startup
after startup on database
begin
	cmc_taf_service_proc;
end;
/

SQL> create or replace TRIGGER cmc_taf_service_trg_rolechange
after db_role_change on database
begin
	cmc_taf_service_proc;
end;
/
```
- 执行一次存储过程，确定服务正在运行，并归档当前日志，让以上更改同步到备库
```bash
SQL> exec cmc_taf_service_proc;
SQL> alter system archive log current;
```

- 我们现在有了一个叫 PRIMARY_RW 的服务，可以让客户端连接
```bash
SQL> show parameter service_names
```
- 有这个服务名存在还不够，你必须配置客户端的 TNS 名去连接它。客户端的 TNS 名应该类似如下：
```
PRIMARY_RW  =
  (DESCRIPTION =
	(ADDRESS_LIST=
		(ADDRESS = (PROTOCOL = TCP)(HOST = dev-db1)(PORT = 1521))
		(ADDRESS = (PROTOCOL = TCP)(HOST = dev-db2)(PORT = 1521))
	)
	(CONNECT_DATA = (SERVICE_NAME = PRIMARY_RW )
		(FAILOVER_MODE=(TYPE=SELECT)(METHOD=BASIC)(RETRIES=30)(DELAY=5))
	)
  	  )
```
这个 TNS 名里包含 Data Guard 配置里的两个主机，使用 PRIMARY_RW服务名确定连接到主库。

2. 进行主备切换
- 确认主库有无日志缺口：
```bash
SQL> SELECT * FROM V$ARCHIVE_GAP;
```

- 删除 LOG_ARCHIVE_DEST_N 参数中的所有延迟应用重做日志设置，你要确认所有变化都在备库应用，才能确保无数据丢失。确认所有重做日志都已在备库应用，查询备库：
```bash
#这条语句第三个字段在oracle10g中查不到，可跳过当前步骤
SQL> select NAME, VALUE, DATUM_TIME from V$DATAGUARD_STATS;
```
不应该返回 transport lag 或 apply lag, finish time 应该为0

- 检查完这些先决条件后，确认主库可以进行角色切换，查询主库：
```bash
SQL> select SWITCHOVER_STATUS from V$DATABASE;
```
如果返回 TO STANDBY 或 SESSIONS ACTIVE，那么主库就可以进行切换。切换主库为备库命令为：
```bash
SQL> alter database commit to switchover to physical standby with session shutdown;
SQL> shutdown immediate;
SQL> startup mount;
```

- 然后查询备库是否可以切换为主库，查询备库：
```bash
SQL> select SWITCHOVER_STATUS from V$DATABASE;
```
如果返回 TO PRIMARY 或 SESSIONS ACTIVE，就可以切换。如果返回 SWITCHOVER LATENT 或 SWITCHOVER PENDING，就要去检查告警日志，看有什么问题，一般是需要应用一些日志。

- 如果是需要应用日志的话，在备库执行如下命令：
```bash
SQL> recover standby database using backup controlfile;
```
在应用日志前应该是 SWITCHOVER PENDING 状态，完成应用后，会变成 TO PRIMARY 或 SESSIONS ACTIVE状态。

- 现在可以切换备库为主库了：
```bash
SQL> alter database commit to switchover to primary with session shutdown;
SQL> alter database open;
```

完成主备切换后，在备库上启用日志应用：
```bash
SQL> alter database recover managed standby database using current logfile disconnect from session;
```

# 验证Data Guard成功的方法
1. 查看主备库的保护模式
```bash
SQL> SELECT PROTECTION_MODE FROM V$DATABASE;
#若不是MAXIMIZE PROTECTION模式，则用下面语句修改
SQL> ALTER DATABASE SET STANDBY DATABASE TO MAXIMIZE PROTECTION;
```
2. 对主库进行update，insert等操作，数据量50~100条左右

3. 用上面的方法进行主备库切换，切换成功之后，查看所做的更改该有没有同步到之前的备库（当前的主库）中来
