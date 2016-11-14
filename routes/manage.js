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
//获取id
studentSchema.methods.getId = function () {
    return JSON.stringify(this._id);
}
//定义静态方法，即类方法，通过模型名加方法名直接调用
studentSchema.statics.findByName = function (name, callBack) {
    this.find({name:name},callBack).exec();
}
//拿到模型对象
var Student = mongoDB.model('student',studentSchema);

// Student.findByName('盛舜赋',function (err, data) {
//     if(err){
//         console.log(err);
//     }else{
//         console.log(data);
//     }
// })


//学生信息展示页
router.get('/:page?', function(req, res) {
    var currentPage = 1;
    var perItemsCount = 10;
    var totalItems = 0;
    if (req.params.page) {
        currentPage = req.params.page;
    }
    //统计数据总量
    Student.count({}, function (err, count) {
        if(err){
            console.dir(err);
        }else{
            totalItems = count;
            var total_page = Math.ceil(totalItems/perItemsCount);

            //查询所有数据
            Student.find({}, function (err, data) {
                if(err){
                    console.dir(err);
                }else{
                    res.render('list', {student_info: data, page: currentPage, total_page: total_page});
                }
            }).limit(perItemsCount).skip((currentPage - 1) * perItemsCount);
        }
    })
})


//跳转新增数据页面
router.get('/edit', function (req, res) {
    res.render('editor');
})


//添加记录，数据库存储处理
router.post('/edit', function (req, res) {
    var new_student = new Student(req.body);
    new_student.save(function (err) {
        if(err){
            console.dir(err);
        }else{
            res.json({
                status: 200,
                msg: '保存成功'
            });
        }
    })
})


//跳转修改数据页面
router.get('/perItem/operate', function (req, res) {
    //解json
    var id = JSON.parse(req.query.id);
    Student.findOne({_id: id}).exec().then(function (data) {
        res.render('operate', {data: data});
    }).catch(function (err) {
        res.render('error', {error: err, message:'errorCode: 500'});
    });
})

//修改记录，数据库修改处理
router.post('/perItem/operate', function (req, res) {
    var data = req.body;
    var id = JSON.parse(data.recordId);

    var obj = {};
    //循环赋值并删掉key为recordId的值
    for(var index in data){
        obj[index] = data[index];
    }
    delete obj.recordId;

    //执行修改操作
    Student.findByIdAndUpdate(id, obj, function () {
        res.redirect('/manage/');
    })
})


//删除一条记录
router.get('/del/:id/:name', function (req, res) {
    var data = req.params;
    //解json
    var userId = JSON.parse(data.id);
    //执行删除操作
    Student.findByIdAndRemove(userId, function () {
        res.json({status: '200', msg: '删除成功'});
    }).catch(function (err) {
        res.json({status: '200', msg: '删除失败', error: err});
    });
})




//导出子模块
module.exports = router;
