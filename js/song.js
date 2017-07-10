$(function () {
    // let isMobile = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(navigator.userAgent);
    // var isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    const isiOS = /ios|iPad|iPod|iPhone/.test(navigator.userAgent)

    let songId = location.search.match(/\bid=([^&]*)/) ? location.search.match(/\bid=([^&]*)/)[1] : "-1"
    let jukebox = $('.jukebox-container')
    let $discSwitch = $('.disc-switch')
    let $songLyrics = $(".song-lyrics")
    let $lyricScroll = $('.song-lyrics .lrc-scroll')

    var audio = document.createElement('audio');
    // ('oncanplay' in audio) ? alert('yes') : alert('no')
    // // function detectEventSupport(eventName) {
    // //     var isSupported
    // //     isSupported = ('oncanplay' in audio); // 使用第一种方式
    // //     // 如果第一种方式行不通，那就来看看它是不是已知事件类型
    // //     if(!isSupported) {
    // //     audio.setAttribute(eventName, 'xxx');
    // //     isSupported = typeof tempElement[eventName] === 'function';
    // // }
    // // 清除掉动态创建的元素，以便内存回收
    // tempElement = null;
    // // 返回检测结果
    // return isSupported;
    // }

    $.get("./json/song_list.json")
        .then(function (response) {
            response.forEach(function (element) {
                if (element.id === songId) {
                    setMusicInfo(element)
                    setLyric(element)
                    initPlayer(element.url)
                }
            })
        })

    function setMusicInfo(elm) {
        $(".page .background").css("background-image", `url(${elm.coverBlurUrl})`)
        $(".song-cover").find('img').attr("src", elm.coverUrl)
        $(".js-song-name").text(elm.title)
        $('.js-song-author').text(elm.singer)
        $('.js-song-gap').text("-")
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
        lyricResize()
    }
    function initPlayer(url) {
        // audio.src = url 
        audio.src = 'http://orzqfde1a.bkt.clouddn.com/test.mp3'
        let lyricAnimationTimer
        $(audio).on('canplay', () => {
            if (!isiOS) {
                audio.play()
                console.log('can play now')
                jukebox.addClass('playing')
                lyricAnimationTimer = lyricAnimation()
            }
            // $discSwitch.removeClass('ready')
            // $('.js-icon-loading').remove()
            lyricAnimationTimer = lyricAnimation() 
        })
        $(".js-play").on('click', () => {
            console.log("click play")
            audio.play()
            lyricAnimationTimer = lyricAnimation()
            jukebox.addClass('playing')
        })
        $(".js-pause").on("click", () => {
            console.log("click pause")
            audio.pause()
            jukebox.removeClass('playing')
            clearInterval(lyricAnimationTimer)
        })
        $(audio).on('ended', () => {
            console.log("ended")
            jukebox.removeClass('playing')
            $('.lrc-scroll').css('transform', "")
            clearInterval(lyricAnimationTimer)
        })
    }
    function lyricAnimation() {
        return setInterval(() => {
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
                $lyricScroll.css('transform', `translateY(-${delta}px)`)
            }
        }, 500)
    }
    function lyricResize() {
        let slTop = $songLyrics.offset().top
        let height = $songLyrics.height()
        let slBottom = slTop + height
        let lTop = $('.links').offset().top
        if (lTop < slBottom + 20) {
            if (lTop - slTop > height / 3 * 2) {
                $songLyrics.css('height', `${height / 3 * 2}px`)
                    .attr('data-lines', 2)
            } else if (lTop - slTop < height / 3 * 2 + 10) {
                $songLyrics.css('height', `${height / 3}px`)
                    .attr('data-lines', 1)
            } else {
                return
            }
        }
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