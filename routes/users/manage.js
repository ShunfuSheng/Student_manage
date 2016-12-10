/**
 * Created by Administrator on 2016/11/14.
 */

var express = require('express');
var router = express.Router();
var db = require('../../module/db');
var Student = db.Student;
var StudentBook = db.StudentBook;


// 根路径的重定向
router.get('/', (req,res)=>{
    res.redirect('/users/manage/login');
})


//根据cookie的值判断是否该跳转此页面
router.get('/login', function (req, res) {
    Student.findById(req.cookies.user_id).then(function (data) {
        if(data){
            res.redirect('/users/manage/info');
        }else{
            res.render('users/login');
        }
    })
});

router.post('/login', function (req, res) {
    Student.findOne({user_name:req.body.user_name}).then(function (data) {
        if(data){
            if(data.pwd == req.body.user_pwd){
                // 设置cookie过期时间为10天
                var timeSpan = new Date(Date.now()+24*60*60*1000*10);
                //设置cookie 保存用户id信息
                res.cookie('user_id', data.id, {path: '/', expires: timeSpan});
                res.json({status: '200', msg: '登录成功'});
            }else{
                res.json({status: '400', msg: '密码错误'});
            }
        }else{
            res.json({status: '400', msg: '用户信息不存在，请先注册'});
        }
    }).catch(function (err) {
        console.dir(err);
    })
})


router.get('/register', function (req, res) {
    //注册前首先创一条带_id的空记录，然后把此唯一标识id带过去
    var student = new Student();
    res.render('users/register', {data: student});
});

router.post('/register/:id?', function (req, res) {
    Student.findOne({user_name:req.body.user_name}).then(function (data) {
        if(data){
            res.json({status: '400', msg: '用户已存在'});
        }else{
            //查询并更新记录，若upsert参数存在则在不存在的情况下创建一条记录，操作成功则不返回任何信息
            Student.findByIdAndUpdate(req.params.id, req.body, {upsert: true}).then(function (data) {
                if(data){
                    res.json({status: '400', msg: '注册失败'});
                }else{
                    var timeSpan = new Date(Date.now()+24*60*60*1000*10);
                    //设置cookie 保存用户id信息
                    res.cookie('user_id', req.params.id, {path: '/', expires: timeSpan});
                    res.json({status: '200', msg: '注册成功'});
                }
            })
        }
    }).catch(function (err) {
        console.dir(err);
    })
});


router.get('/info', function (req, res) {
    Student.findById(req.cookies.user_id).then(function (data) {
        if(data){
            //通过populate关联book表的数据，student_book用于作为关联的表
            StudentBook.find({user_id:req.cookies.user_id}).populate('book_id')
                .then(function (sbData) {
                res.render('users/info', {user: data, books: sbData});
            })
        }else{
            res.redirect('/users/manage/login');
        }
    })
})



module.exports = router;
