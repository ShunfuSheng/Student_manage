/**
 * Created by Administrator on 2016/11/14.
 */

// 自定义验证规则Api 用于验证手机号
$.validator.addMethod('isMobile',function(value,ele){
    var length = value.length;
    var reg = /^1[3,5,7,8](\d{9})$/;
    if(length==11 && reg.test(value)){
        return true;
    }
    else{
        return false;
    }
});
