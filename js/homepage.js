$(function () {
    $(".site-nav>ol").on('click', "li", function (e) {
        var index = $(this).addClass('selected')
            .siblings().removeClass('selected')
            .end().index()
        $('article>section').eq(index).addClass('active')
            .siblings().removeClass('active')
    })
})