//入口函数

$(function() {
    //调用用户的基本信息
    getUserInfo();

    var layer = layui.layer
    $('#btnLogout').on('click', function() {
        console.log('ok');
        //提示用户是否确认退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {

            //清空本地 token
            localStorage.removeItem('token')
                //跳转登陆页面
            location.href = '/login.html'
                //关闭确认框
            layer.close(index);
        });

    })
})

//封装函数
function getUserInfo() {
    $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            // headers: {
            //     Authorization: localStorage.getItem('token') || ''
            // },
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败')
                }

                renderAvarar(res.data)

            }
        })
        // return window.getUserInfo=getUserInfo
}

//渲染用户头像
function renderAvarar(user) {
    //获取用户头像
    var name = user.nickname || user.username;
    //设置文本
    $('.welcome').html('欢迎&nbsp&nbsp' + name)
        //渲染用户名
    if (user.user_pic !== null) {
        //渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide();
    } else {
        //渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase()
        $('.text-avatar')
            .html(first)
            .show()
    }
}