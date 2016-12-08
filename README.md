# sqlend_wetodo
通过鲲鹏云联 (sqlend.com) 创建的 Todo List 微信小程序。

## 服务器端
使用鲲鹏云联的线上开发环境，创建了两个数据表：
* wx_users: 微信用户表
* todos: Todo List表

![微信用户表](https://app.sqlend.com/files/todo_list/todo1.png)
![Todo List 表](https://app.sqlend.com/files/todo_list/todo2.png)


同时开发了六个接口：
* *GET*  /api/weixin/openid?code=XXXX   将微信登录时的 code 转换成 openid
* *POST* /api/weixin/userinfo  解密用户登录后拿到的 userinfo，并将用户数据储存到 wx_users 表中
* *GET*  /api/todos/ 根据用户的 openid 获取 Todo List
* *POST* /api/todos/ 插入新的 Todo 数据
* *POST* /api/todos/update/ 更新指定 Todo 的 done 状态或内容
* *DELETE* /api/todos/remove-done/ 删除已经完成的项目

**以上六个接口，共 50 行代码完成了后台服务端的创建。**

## 客户端
*小程序客户端的界面与逻辑，使用了 Leancloud 发布在 github 上的 [leantodo-weapp](https://github.com/leancloud/leantodo-weapp) 代码，在此进行说明与感谢。*

![sqlend-todo-weapp 的效果图](https://app.sqlend.com/files/todo_list/todo3.jpg)

client/utils 目录下的 sqlend.js 文件里包含了部分封装好的函数，因为服务器端是完全的 RESTful 调用，所以这几个函数纯粹为了减少代码量。

**整个小程序打包后不到30K。**

用户把 client/utils/sqlend.js 里的 *kp_appid*， *kp_secret*  和 *base_url* 替换成鲲鹏云联上自有的APP信息即可使用。

## License
The MIT License
