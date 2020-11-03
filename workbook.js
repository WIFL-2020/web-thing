//第一个页面
$(function() {
    //注册
    $("#link_reg").on("click", function() {
        //隐藏登录框
        $(".login-box").hide();
        $(".reg-box").show();
    });
    $("#link_login").on("click", function() {
        $(".login-box").show();
        $(".reg-box").hide();
    });

    //验证规则
    let form = layui.formm;
    let layer = layui.layer;
    form.verify({
        pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
        rePwd: function(value) {
            let repwd = $(".reg-box[name=password]");
            if (repwd !== value) {
                return layer.msg("两次密码不一致");
            }
        },
    });

    //注册功能，监听提交事件
    $("#form_reg").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/api/reguser",
            data: {
                username: $("#form_reg[name=username]").val(),
                password: $("#form_reg[name=password]").val(),
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg("注册成功请登录");
                $("#link_login").click();
            },
        });
    });

    //监听登录表单的提交事件
    $("#form_login").submit(function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/api/login",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("登录失败！");
                }
                layer.msg("登录成功");
                localStorage.setItem("token", res.token);
                //跳转到后台主页 location（位置）
                location.href = "/index.html";
            },
        });
    });
});

//第二个页面开始
$(function() {
    //调用用户的基本信息
    getUserInfo();
    //layui 框架
    let layer = layui.layer;
    $("#btnLogout").on("click", function() {
        console.log("ok");
        layer.confirm("确定退出了？", { icon: 3, title: "提示" }, function(index) {
            //清空本地
            localStorage.removeItem("token");
            //跳转登录页面
            location.href = "/login.html";
            //关闭确认框
            layer.close(index);
        });
    });

    //封装函数
    function getUesrInfo() {
        $.ajax({
            menthod: "GET",
            url: "/my/userinfo",
            headers: {
                Authorization: localStorage.getItem("token") || "",
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取用户失败");
                }
                renderAvarar(res.data);
            },
        });
    }

    //渲染用户头像
    function renderAvarar(user) {
        //获取用户头像
        var name = user.nickname || user.username;
        //设置文本
        $(".welcome").html("欢迎&nbsp&nbsp" + name);
        //渲染用户名
        if (user.user_pic !== null) {
            $(".layer-nav-img").attr("src", user.user_pic).show();
            $(".text-avatar").hide();
        } else {
            $(".layui-nav-img").hide();
            var first = name[0].toUpperCase();
            $(".text-avatar").html(first).show();
        }
    }
});

//第一   获取信息.更新信息.修改信息
$(function() {
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        nickname: function(value) {
            if (value > 6) {
                return "昵称长度必须在1~6个字符之间";
            }
        },
    });

    initUserInfo();

    function initUserInfo() {
        $.ajax({
            menthod: "GET",
            url: "/my/userinfo",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取数据失败！");
                }
                form.val("formUserInfo", res.data);
            },
        });
    }

    $("#btnReset").on("click", function(e) {
        e.preventDefault();
        initUserInfo();
    });

    $(".layui-form").on("submit", function(e) {
        e.preventDefault();

        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            //获取表单的所有属性
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("更新数据失败！");
                }
                layer.msg("更新数据成功");
                window.parent.getUserInfo();
            },
        });
    });
});

//第二  修改密码
$(function() {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
        samePwd: function(value) {
            if (value === $("[name=oldPwd]").val()) {
                return layer.msg("新旧密码不能相同");
            }
        },
        rePwd: function(value) {
            if (value !== $("[name=newPwd]").val()) {
                return layer.msg("两次输入的密码不一致");
            }
        },
    });

    $(".layui-form").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("重置密码失败！");
                }
                layer.msg("密码重置成功");
                $(".layui-form")[0].reset();
            },
        });
    });
});

// 第三 个页面 修改头像
$(function() {
    var layer = layui.layer

    //获取裁剪区的DOM元素
    var $image = $('#image');
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: ".img-preview",
    };

    //创建裁剪区域
    $image.cropper(options)

    //为上传按钮注册点击事件
    $('#btnChooseImage').on('click', function() {
        $('#file').click()
    })

    //为文件选择框注册change事件
    $('#file').on('change', function(e) {
        //获取用户选择的文件
        var filelist = e.target.files;
        if (filelist.length === 0) {
            return layer.msg('请选择照片')
        }

        //拿到选择的文件
        var file = e.target.files[0];
        //将选择的文件转化为路径
        var imgURL = URL.createObjectURL(file)
            //重新初始化裁剪区域
        $image
            .cropper("destroy") // 销毁旧的裁剪区域
            .attr("src", imgURL) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域
    })

    $('#btnUpload').on('click', function() {
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                window: 100,
                height: 100,
            })
            .toDataUrl("image/png");
        //调用接口上传到服务器
        $.ajax({
            method: "POST",
            url: "/my/update/avater",
            data: {
                avatar: dataURL,
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败！')
                }
                layer.msg('更换头像成功')
                window.parent.getUserInfo()
            }
        })
    })
})

//第四个页面 
$(function() {
    var layer = layui.layer
    var form = layui.form
    initArtCateList()

    function initArtCateList() {
        $.ajax({
            menthod: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    //为添加类别点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    //通过代理的形式，为form-add 表单 绑定 submit事件
    $('body').on('submit', '#form-add', function(e) {
            e.preventDefault()
            $.ajax({
                menthod: 'POST',
                url: '/my/article/addcates',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('新增分类数据失败')
                    }

                    initArtCateList()
                    layer.msg('添加数据成功')
                    layer.close(indexAdd)

                }
            })
        })
        //通过代理的形式，为btn-edit 按钮绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {
        //弹出信息层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        var id = $(this).attr('data-id')
            //发起请求获取对应的数据
        $.ajax({
            method: 'GET',
            url: `/my/article/cates/${id}`,
            success: function(res) {
                form.val('form-edit', res.data)
            }
        })
    })

    //通过代理的形式，为修改分类的表单绑定submit 事件
    $('body').on('submit', '#form-edit', function(e) {
            e.preventDefault()
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('更新数据失败')
                    }
                    layer.msg('更新数据成功')
                    layer.close(indexEdit)
                    initArtCateList()
                }
            })
        })
        //为删除按钮绑定 `btn-delete` 类名，并添加 `data-id` 自定义属性
        //通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: `/my/article/deletecate/${id}`,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败')
                    }
                    layer.msg('删除分类数据成功')
                    layer.close(index)
                    initArtCateList()
                }
            })
        })
    })
})

//第五个 页面
$(function() {

    let form = layui.form
    let laypage = layui.laypage
    template.defaults.imports.dataFormat = function(data) {
            const dt = new Date(data)

            const y = dt.getFullYear()
            const m = padZero(dt.getMonth() + 1)
            const d = padZero(dt.getDate())
            const hh = padZero(dt.getHours())
            const mm = padZero(dt.getUTCMinutes())
            const ss = padZero(dt.getSeconds())
            return y + '-' + m + '-' + d + '  ' + hh + ':' + mm + ':' + ss
        }
        //定义不零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }
    initTable()

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据失败')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                readerPage(res.total)
            }
        })
    }
    initCate()

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类信息失败')
                }
                layer.msg('获取分类信息成功')
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        initTable()
    })

    function readerPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function(obj, first) {
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        })
    }
})