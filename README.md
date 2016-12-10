## 学生图书借阅系统
>这是一个学生图书借阅管理系统，功能涵盖了1.学生信息的增删改功能和借阅功能；2.书籍的查询和异步加载功能；
3.一个简单的后台管理员功能

#### 实现方法：
1. nodejs + express: 实现后台的搭建
2. bootstrap + jquery: 实现前端页面的展示和发送ajax请求
3. art-template: 服务器端对前端页面进行渲染的模板引擎
4. mongodb + mongoose: 实现后台对mongodb数据库的操作
5. crawler: nodejs的一个爬虫模块，在此项目中用于爬取当当网图书热销榜中的2500条书籍信息作为图书来源
6. jquery.validate: jquery的一个第三方插件，用于表单验证
7. Wdatepicker: jquery的一个日期选择控件，用于学生注册时选择出生日期
8. jquery.cookie: jquery的一个第三方插件，用于操作cookie

#### 项目说明：
```
mongodb中有三张表，分别是book、student以及一张外连表student_book，student_book表用于连接book和student两张
表；后台管理员用户信息写死在程序中，没有另外建立一张表进行存储。
```