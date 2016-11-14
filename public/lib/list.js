/**
 * Created by Administrator on 2016/11/11.
 */

$('.del').click(function (e) {
    e.preventDefault();

    //定义弹窗
    var r = confirm('你确定要删除该条记录?');
    if(r == true){
        var data = $(this).data();
        var id = data.id;
        var name = data.name;
        $.ajax({
            url: `/admin/manage/del/${id}/${name}`,
            type: 'get',
            dataType: 'json',
            success: function (res) {
                alert(res.msg);
                window.location.href = '/admin/manage/'
            },
            error: function (err) {
                console.dir(err);
            }
        });
    }else{
        return false;
    }
})
