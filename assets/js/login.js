$(function() {
    //去注册
    $('#link_reg').on('click', function() {
        //隐藏登录框
        $('.login-box').hide()
            //显示注册框
        $('.reg-box').show()
    })

    $('#link_login').on('click', function() {

        $('.login-box').show()
        $('.reg-box').hide()
    })

    //自定义验证规则
    let form = layui.form
    let layer = layui.layer
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function(value) {
            let repwd = $('.reg-box [name=password]').val()
            if (repwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    //注册功能，监听表单的提交事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault()
        $.post('/api/reguser', { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.messge);
                // return layer.msg('成功');

            }
            layer.msg('注册成功请登录');
            $('#link_login').click()
        })
    })

    //监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功')
                    // 将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token', res.token);
                // 跳转到后台主页
                location.href = '/index.html';
            }
        })
    })
})