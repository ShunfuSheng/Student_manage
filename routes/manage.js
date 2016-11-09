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
    birthday: Date,
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
    var birthday = this.birthday;
    var year = birthday.getFullYear();
    var month = birthday.getMonth()+1;
    var date = birthday.getDate();
    return (year + '-' + month + '-' + date);
}
//拿到模型对象
var Student = mongoDB.model('student',studentSchema);





//学生信息展示页
router.get('/', function(req, res) {
    var student_info = [];
    Student.find().exec().then(function (data) {
        student_info = data;
        data.forEach(function (ele, index) {
            student_info[index].age = ele.getAge();
            student_info[index].birthdays = ele.getBirthday();
            // console.log(student_info[index]);
        });
        res.render('list', {student_info: student_info});
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
    var obj = {};
    obj.user_id = req.body.user_id;
    obj.name = req.body.user_name;
    obj.sex = (req.body.sex == 'man')? '男':'女';
    var dateStr = req.body.user_bir;
    obj.birthday = Date.parse(dateStr);
    obj.mobile = req.body.user_mobile;
    obj.email = req.body.user_email;
    obj.location = req.body.user_loc;

    var new_student = new Student(obj);
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



module.exports = router;
