[官方教程](https://about.gitlab.com/downloads/#centos7)

环境：CentOS7
1. Install and configure the necessary dependencies
```bash
sudo yum install curl policycoreutils openssh-server openssh-clients
sudo systemctl enable sshd
sudo systemctl start sshd
sudo yum install postfix
sudo systemctl enable postfix
sudo systemctl start postfix
#由于我用的iptables，就没执行下面两句
sudo firewall-cmd --permanent --add-service=http
sudo systemctl reload firewalld
```

2. Add the GitLab package server and install the package
```bash
curl -sS https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.rpm.sh | sudo bash

sudo yum install gitlab-ce
```
> 在yum进行安装时，会提示找不都安装源，可能访问gitlab软件仓库需要翻墙   
> 解决方法：去[官网](https://packages.gitlab.com/gitlab/gitlab-ce)下载rpm包，然后放到yum安装软件时的缓存目录/var/cache/yum中对应的gitlab文件夹下（前面运行yum install时生成的），再次运行yum安装命令并跳过寻找软件镜像的步骤，直接进入安装即可。

3. Configure and start GitLab
```bash
sudo gitlab-ctl reconfigure
:重启gitlab
gitlab-ctl restart
```

4.Browse to the **hostname** and login   
On your first visit, you'll be redirected to a password reset screen to provide the password for the initial administrator account. Enter your desired password and you'll be redirected back to the login screen.

The default account's **username is root**. Provide the password you created earlier and login. After login you can change the username if you wish.

> 如果centos中有安装appache，80端口被占用，我停掉了httpd服务就可以访问了。
> 还可以修改gitlab默认端口，这里就不做说明了


5. 添加sshkey
> git仓库之间的代码传输协议主要使用ssh协议。而一般搭建gitlab的时候使用的git用> > 户是没有密码的，因此直接ssh是不能登录的，就需要使用ssh-keygen上传公钥，使用> > 非对称加密传输。  
> 在终端中敲下面的命令，第一步会生成一对私钥和公钥，分别存在``~/.ssh/id_rsa``>> 和``~/.ssh/id_rsa.pub``中。第二步查看公钥字符串。
```bash
ssh-keygen -t rsa -C "$your_email"
cat ~/.ssh/id_rsa.pub
```

6. 保存sshkey到gitlab   
在面板上依次点击用户头像->Settings –> SSH Keys –> Add SSH Keys。然后把上一步中的id_rsa.pub中的内容拷贝出来粘贴到输入框中，保存。   
