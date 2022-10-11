# FSnetDiskServer
网盘项目后端，Koa、mysql，Redis 
功能：文件管理，回收站，用户权限管理，文件分享，磁盘监控，登录，注册，忘记密码，邮件验证码。

[前端地址](https://github.com/fanzhouzhou98/FSnetDisk)


### 启动
1. 安装mysql，然后记住账号和密码
2. 新建一个数据库，
3. 在项目`config/db.js`的修改数据库配置
4.安装redis
5.在项目`config/cache.js`里修改自己redis配置
6.在项目`config/email.js`里修改自己的邮件配置
4. `yarn add `安装依赖之后`yarn run dev`启动
