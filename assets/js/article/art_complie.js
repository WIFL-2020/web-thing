$(function() {
    //获取编辑按钮
    $('tbody').on('click', '.btn-delete', function() {
        console.log('ok');
        var id = $(this).attr('data-id')
        location.href = '/article/art_pub.html?' + id

    })
})