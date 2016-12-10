//引入连接mongodb库的模块
var db = require('mongoose');
var Crawler = require("crawler");
db.connect('mongodb://localhost/books_db');

//创建数据模型
var Book = db.model('book',{
    title: String,
    img: String,
    link: String,
    price: Number,
    author: String,
    publisher: String,
    type: String
})

//创建一个爬虫实例
var c = new Crawler({
    maxConnections : 10,
    forceUTF8: true,
    incomingEncoding: 'gb2312',
    // 获取网页html代码成功后的回调函数
    callback : function (error, result, $) {
        $('.bang_list li').each(function(){
            var book = new Book();
            book.title = $(this).find('.name a').text();
            book.img = $(this).find('.pic a img').attr('src');
            book.link = $(this).find('.name a').attr('href');
            //处理价格问题
            var item_price = $(this).find('.price p span').eq(0).text().substr(1);
            item_price.includes(',') ? (book.price=item_price.replace(',','')) : (book.price=item_price);
            book.author = $(this).find('.publisher_info a').eq(0).text();
            book.publisher = $(this).find('.publisher_info').last().find('a').text();
            book.type = $('.bang_wrapper .layout_location span').last().text();

            book.save(function (err) {
                if(err){
                    console.log(err);
                }else{
                    console.log('保存成功!');
                }
            })
        })
        console.log(result.uri);
    },
    // onDrain : function () {
    //     console.log('爬虫结束');
    // }
});


var url_list = [];
//定义分组，分别是：计算机/网络、保健/养生、烹饪/美食、文学、小说
var base = ['54','18','10','28','03'];
var base_list = base.map(function (ele) {
    return ('http://bang.dangdang.com/books/bestsellers/01.' + ele + '.00.00.00.00-24hours-0-0-1-');
})
//总的url
base_list.forEach(function (item) {
    var base_url = item;
    for(var i=1; i<=25; i++) url_list.push(base_url.concat(String(i)));
});

c.queue(url_list);
