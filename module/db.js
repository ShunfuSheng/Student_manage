/**
 * Created by Administrator on 2016/11/14.
 */

var mongoDB = require('mongoose');
//使用nodejs内置的promise实现替换
mongoDB.Promise = Promise;
mongoDB.connect('mongodb://localhost/books_db');
var Schema = mongoDB.Schema;


//定义表字段，不包含年龄
var studentSchema = new Schema({
    user_name: Number,
    pwd: String,
    name: String,
    sex: String,
    birthday: {
        type: Date,
        default: Date.now
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
var Student = mongoDB.model('student', studentSchema);


//创建book模型
var bookSchema = new Schema({
    title: String,
    img: String,
    link: String,
    price: Number,
    author: String,
    publisher: String,
    type: String
})

//做表关联，ref的时候需要制定模型的名字即db.model()中的第一个参数
var studentBookSchema = new Schema({
    booked_date:{
        type: Date,
        default: Date.now()
    },
    user_id:{
        type:Schema.Types.ObjectId,
        ref:'student'
    },
    book_id:{
        type:Schema.Types.ObjectId,
        ref:'book'
    }
})
//处理借阅日期
studentBookSchema.methods.getBookedDate = function () {
    var year = this.booked_date.getFullYear();
    var month = this.booked_date.getMonth()+1;
    var date = this.booked_date.getDate();
    var hour = this.booked_date.getHours();
    var min = this.booked_date.getMinutes();

    return (year + '-' + month + '-' + date + ' ' + hour + ':' + min);
}

var DangdangBook = mongoDB.model('book', bookSchema);
var StudentBook = mongoDB.model('student_book',studentBookSchema);




//导出模块
module.exports = {
    Student: Student,
    DangdangBook: DangdangBook,
    StudentBook: StudentBook
}
