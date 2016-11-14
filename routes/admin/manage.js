/**
 * Created by Administrator on 2016/11/8.
 */

var express = require('express');
var router = express.Router();
var db = require('../../db');
var Student = db.Student;


//学生信息展示页
router.get('/:page?', function(req, res) {
    var currentPage = 1;
    var perItemsCount = 10;
    var totalItems = 0;
    if (req.params.page) {
        currentPage = req.params.page;
    }

    //查询条件
    var filter = {};
    if(req.query.user_name){
        filter.name = new RegExp(String(req.query.user_name), 'i');
    }
    if(req.query.mobile){
        filter.mobile = new RegExp(String(req.query.mobile), 'i');
    }

    //根据条件统计数据总数量(使用Promise实现)
    var studentCount = Student.count(filter);
    studentCount.then((count)=> {
        totalItems = count;
        var total_page = Math.ceil(totalItems / perItemsCount);

        //根据条件查询数据
        var studentFind = Student.find(filter);
        studentFind.then((data)=>{
            res.render('admin/list', {
                student_info: data,
                page: currentPage,
                total_page: total_page,
                query: req.query
            });
        });
        studentFind.catch((err)=>{
            console.dir(err);
        });
        studentFind.limit(perItemsCount);
        studentFind.skip((currentPage - 1) * perItemsCount);
    });
    studentCount.catch((err)=>{
        console.dir(err);
    });
})


//跳转新增数据页面
router.get('/edit/add', function (req, res) {
    res.render('admin/editor');
})


//添加记录，数据库存储处理
router.post('/edit/add', function (req, res) {
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
        res.render('admin/operate', {data: data});
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
        res.redirect('/admin/manage/');
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
