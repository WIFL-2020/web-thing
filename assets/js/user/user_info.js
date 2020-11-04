//入口函数
$(function() {


    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })

    initUserInfo();
    //获取表单信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取信息失败!')
                }
                console.log(res);
                console.log(res.data);
                //调用form.val('') 快速为表单赋值  res.data是用户的基本资料
                form.val('formUserInfo', res.data)
            }
        })
    }

    //重置表单数据
    $('#btnReset').on('click', function(e) {
        //阻止表单的默认行为
        e.preventDefault();
        //调用 初始化
        initUserInfo();
    })


    //监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
            //获取并更新数据
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新数据失败！')
                }
                layui.layer.msg('数据更新成功！')
                    //调用父页面中的方法  重新渲染  window子页面（本页面） parent（父页面）
                window.parent.getUserInfo()
            }
        })
    })
})