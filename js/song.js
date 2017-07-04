$(function () {
    let songId = location.search.match(/\bid=([^&]*)/)[1]
    var jukebox = $('.jukebox-container')
    var $discSwitch = $('.disc-switch')

    var audio = document.createElement('audio');

    $.get("./json/song_list.json")
        .then(function (response) {
            response.forEach(function (element) {
                if (element.id === songId) {
                    getMusicInfo(element)
                }
            })
        })

    function getMusicInfo(elm) {
        setPlay(elm.url)
        $(".page .background").css("background-image", `url(${elm.coverBlurUrl})`)
        $(".song-cover").find('img').attr("src", elm.coverUrl)
        $(".js-song-name").text(elm.title)
        $('.js-song-author').text(elm.singer)
    }
    function setPlay(url) {
        audio.src = url
        $(audio).on('canplay', function () {
            audio.play()
            console.log('can play now')
            jukebox.addClass('playing')
            $discSwitch.removeClass('ready')
            $('.js-icon-loading').remove()
        })
        $(".js-play").on('click', function () {
            audio.play()
            jukebox.addClass('playing')
        })
        $(".js-pause").click(function () {
            audio.pause()
            jukebox.removeClass('playing')
        })
    }


})