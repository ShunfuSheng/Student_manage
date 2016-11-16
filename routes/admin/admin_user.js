/**
 * Created by Administrator on 2016/11/14.
 */

var express = require('express');
var router = express.Router();
var db = require('../../module/db');
var Student = db.Student;

//写死的管理员信息
var arrAdmin = [{
    userName: 'admin',
    userPwd: 'admin'
},{
    userName: '543064278',
    userPwd: '123456'
}];


router.get('/login', function (req, res) {
    res.render('admin/login');
});

router.post('/login', function (req, res) {
    var user_name = req.body.user_name;
    var user_pwd = req.body.user_pwd;
    var result = arrAdmin.find((item)=>{
        if(item.userName == user_name){
            return item;
        }
    })
    if(result){
        if(result.userPwd == user_pwd){
            //登录成功时设置cookie，保存管理员id信息
            var timeSpan = new Date(Date.now()+24*60*60*1000*10);
            res.cookie('admin_user_name', user_name, {path: '/', expires: timeSpan});
            res.json({
                status: '200',
                msg: '登录成功'
            });
        }else{
            res.json({
                status: '400',
                msg: '密码错误!'
            });
        }
    }else{
        res.json({
            status: '400',
            msg: '账号错误或不存在!'
        });
    }
});





module.exports = router;
