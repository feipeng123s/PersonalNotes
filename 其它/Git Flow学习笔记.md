# 基于git的源代码管理模型——git flow

[英文介绍文档](http://nvie.com/posts/a-successful-git-branching-model/)   
[中文介绍文档](http://www.ituring.com.cn/article/56870)
- **Git Flow是什么？**

> A successful Git branching model   
  Git Flow是构建在Git之上的一个组织软件开发活动的模型
  
- **Git Flow中的分支**
    - 主分支
        - develop分支：保存当前最新开发成果的分支
        - master分支：存放随时可供在生产环境中部署的代码
    - 辅分支
        - feature分支：用于开发新功能
        - release分支：用于辅助版本发布
        - hotfix分支：用于修正生产代码中的缺陷
![image](http://nvie.com/img/git-model@2x.png)

