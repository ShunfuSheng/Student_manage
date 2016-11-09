/**
 * Created by Administrator on 2016/11/8.
 */

var express = require('express');
var router = express.Router();

//数据库方面
var mongoDB = require('mongoose');
//使用nodejs内置的promise实现替换
mongoDB.Promise = Promise;
mongoDB.connect('mongodb://localhost/books_db');
var Schema = mongoDB.Schema;
//定义表字段，不包含年龄
var studentSchema = new Schema({
    user_id: String,
    name: String,
    sex: String,
    birthday: {
        type: Date,
        default: Date.now()
    },
    mobile: String,
    email: String,
    location: String
});
//处理年龄
studentSchema.methods.getAge = function () {
    var now = new Date();
    return (now.getFullYear() - this.birthday.getFullYear());
}
//处理生日日期
studentSchema.methods.getBirthday = function () {
    var year = this.birthday.getFullYear();
    var month = this.birthday.getMonth()+1;
    var date = this.birthday.getDate();
    return (year + '-' + month + '-' + date);
}
//拿到模型对象
var Student = mongoDB.model('student',studentSchema);




//学生信息展示页
router.get('/', function(req, res) {
    Student.find().exec().then(function (data) {
        res.render('list', {student_info: data});
    }).catch(function (err) {
        res.render('error',{message: err});
    })
});


//页面跳转处理
router.get('/edit', function (req, res) {
    res.render('editor',{});
})


//添加记录，数据库存储处理
router.post('/edit', function (req, res) {
    var new_student = new Student(req.body);
    new_student.save(function (err) {
        if(err){
            console.log(err);
        }else{
            res.json({
                status: 200,
                msg: '保存成功'
            });
        }
    })
})


//导出子模块
module.exports = router;
