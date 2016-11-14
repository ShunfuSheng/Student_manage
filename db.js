/**
 * Created by Administrator on 2016/11/14.
 */

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

//导出模块
module.exports = {
    Student:Student
}
