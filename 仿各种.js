//第一个页面
$(function() {
    //注册
    $('#link_reg').on('click', function() {
        //隐藏登录框
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })


    //验证规则
    let form = layui.formm;
    let layer = layui.layer;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        rePwd: function(value) {
            let repwd = $('.reg-box[name=password]')
            if (repwd !== value) {
                return layer.msg('两次密码不一致')
            }
        }
    })

    //注册功能，监听提交事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('#form_reg[name=username]').val(),
                password: $('#form_reg[name=password]').val()
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功请登录')
            }
        })
    })
})

//第一   获取信息.更新信息.修改信息
$(function() {

    var form = layui.form
    var layer = layui.layer

    form.verify({
        nickname: function(value) {
            if (value > 6) {
                return '昵称长度必须在1~6个字符之间'
            }
        }
    })

    initUserInfo()

    function initUserInfo() {
        $.ajax({
            menthod: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据失败！')
                }
                form.val('formUserInfo', res.data)
            }
        })
    }

    $('#btnReset').on('click', function(e) {
        e.preventDefault()
        initUserInfo()
    })

    $('.layui-form').on('submit', function(e) {
        e.preventDefault()

        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            //获取表单的所有属性
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新数据失败！')
                }
                layer.msg('更新数据成功')
                window.parent.getUserInfo()
            }

        })
    })
})

//第二  修改密码
$(function() {

    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return layer.msg('新旧密码不能相同')
            }
        },
        rePwd: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return layer.msg('两次输入的密码不一致')
            }
        }
    })

    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('重置密码失败！')
                }
                layer.msg('密码重置成功')

                $('.layui-form')[0].reset()
            }
        })
    })

})

//第三