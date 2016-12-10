/**
 * Created by Administrator on 2016/11/15.
 */

var express = require('express');
var router = express.Router();
var db = require('../../module/db');
//引入数据模型
var DangdangBook = db.DangdangBook;
var Student = db.Student;
var StudentBook = db.StudentBook;


//基础的书籍列表展示
router.get('/list', function (req, res) {
    if(req.cookies.user_id){
        Student.findById(req.cookies.user_id).then(function (data) {
            res.render('book/list',{isLogined: true, user: data});
        })
    }else{
        res.render('book/list');
    }
});

//ajax请求获取分页数据
router.get('/get_data/:search?', function (req, res) {
    var currentPage = 1;
    var filter = {};

    if(req.query.page){
        currentPage = Number(req.query.page);
    }
    if(currentPage <=0){
        currentPage = 1;
    }
    //添加查询条件
    if(req.params.search){
        filter.title = new RegExp(String(req.params.search), 'i');
    }
    DangdangBook.find(filter).select('img link title author').limit(10).skip(10*(currentPage-1)).then(function (data) {
        if(data.length > 0){
            res.json({status: '200', data: data});
        }else{
            res.json({status: '400', msg: '没有更多的数据了!'})
        }
    }).catch(function (err) {
        console.dir(err);
    });
})

//点击借阅功能处理
router.post('/pick', function (req, res) {
    if(req.cookies.user_id){
        StudentBook.count({user_id:req.cookies.user_id, book_id:req.body.id}).then(function (count) {
            if(count>0){
                res.json({
                    status: '400',
                    msg: '你已借过该书!'
                });
            }else{
                //插入数据到student_book表
                var sb = new StudentBook();
                sb.user_id = req.cookies.user_id;
                sb.book_id = req.body.id;
                sb.save().then(function (data) {
                    if(data){
                        console.log(data);
                    }
                    res.json({
                        status: '200',
                        msg: '借阅成功，请注意查收!'
                    })
                });
            }
        })
    }else{
        res.json({
            status: '400',
            msg: '请先登录!'
        })
    }
})


module.exports = router;
