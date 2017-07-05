$(function () {

    let songId = location.search.match(/\bid=([^&]*)/)[1]
    let jukebox = $('.jukebox-container')
    let $discSwitch = $('.disc-switch')
    let $lyricScroll = $('.song-lyrics .lrc-scroll')
    var audio = document.createElement('audio');

    $.get("./json/song_list.json")
        .then(function (response) {
            response.forEach(function (element) {
                if (element.id === songId) {

                    setLyric(element)
                    setMusicInfo(element)
                    initPlayer(element.url)

                }
            })
        })

    function setMusicInfo(elm) {

        $(".page .background").css("background-image", `url(${elm.coverBlurUrl})`)
        $(".song-cover").find('img').attr("src", elm.coverUrl)
        $(".js-song-name").text(elm.title)
        $('.js-song-author').text(elm.singer)
    }
    function setLyric(elm) {
        let array = elm.lyric.split('\n')
        let regex = /^\[(.+)\](.+)$/
        array = array.map(function (string) {
            let match = string.match(regex)
            if (match) {
                return {
                    time: match[1], words: match[2]
                }
            }
        })
        array.map(function (object) {
            if (object) {
                let $p = $('<p/>')
                $p.attr('data-time', object.time)
                    .text(object.words)
                    .appendTo($lyricScroll)
            }

        })
    }
    function initPlayer(url) {
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
        setInterval(() => {
            let audioCurrentTime = getAudioCurrentTime(audio)
            let $p = $lyricScroll.find("p[data-time]")
            let $whichLine
            for (let i = 0; i < $p.length; i++) {
                let currentLineTime = $p.eq(i).attr('data-time')
                let nextLineTime = $p.eq(i + 1).attr('data-time')
                if ($p.eq(i + 1).length !== 0 && currentLineTime < audioCurrentTime && nextLineTime > audioCurrentTime) {
                    $whichLine = $p.eq(i)
                    break
                }
            }
            if ($whichLine) {
                $whichLine.addClass("active").prev().removeClass('active')
                let top = $whichLine.offset().top
                let linesTop = $lyricScroll.offset().top
                let delta = top - linesTop 
                $lyricScroll.css('transform',`translateY(-${delta}px)`)
            } 
             

        }, 200)
    }
    function getAudioCurrentTime(audio) {
        let seconds = audio.currentTime
        let munites = ~~(seconds / 60)
        let left = seconds - munites * 60
        let time = `${pad(munites)}:${pad(left)}`
        return time
    }
    function pad(number) {
        return number >= 10 ? number + "" : "0" + number
    }


})