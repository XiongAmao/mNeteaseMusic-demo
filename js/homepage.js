$(function () {
    let $seartForm = $('.search-form'),
        $searhInput = $('.search-form input'),
        $searhInputCloseBtn = $('.search-form .input-close'),
        $searchDefault = $('.search-default'),
        $searchRecom = $('.search-recom'),
        $searchResult = $('.search-result'),
        songList, SearchInputTimer


    // topbar
    $(".site-nav>ol").on('click', "li", function (e) {
        if (this == document.querySelectorAll(".site-nav>ol>li")[1]) getHotList()
        var index = $(this).addClass('selected')
            .siblings().removeClass('selected')
            .end().index()
        $('article>section').eq(index).addClass('active')
            .siblings().removeClass('active')
    })
    

    // let id = parseInt(location.search.match(/\bid=([^&]*)/)[1],10) 
    getLastestMusic()
    getSongList()
    bindSearchTab()


    // 搜索组件事件绑定
    function bindSearchTab() {
        $seartForm.on('submit', function (e) {
            e.preventDefault();
            showSearchResult()
        })
        $searhInputCloseBtn.on('click', function (e) {
            $searhInput.val("")
            $searhInputCloseBtn.removeClass('active')
            show$searchDefault()
            clearTimeout(SearchInputTimer)
            clearResultList()
        })
        $searchRecom.on('click', function () {
            let value = $searhInput.val()
            showSearchResult(value)

        })
        $searhInput.on('input change', function (e) {
            let value = $(this).val()
            if (value) {
                $searhInputCloseBtn.addClass('active')
                $searchRecom.addClass('active').find('.sr-input-btn').text(`搜索 “${value}”`)
                show$searchRecom()
                clearTimeout(SearchInputTimer)
                SearchInputTimer = setTimeout(function () {
                    matchResult(value)
                }, 600)
            } else {
                show$searchDefault()
                clearTimeout(SearchInputTimer)
                clearResultList()
            }
        })
        $('.sd-hotlist li').each(function(){
            
            let value = $(this).text()
            $(this).on('click',function(){
                $searhInput.val(value)
                $searhInputCloseBtn.addClass('active')
                showSearchResult(value)
                console.log(123)
            })
        })
    }

    // 展示结果
    function showSearchResult(value) {
        let val = value ? value : undefined
        show$searchResult()
        let result = matchResult(value)
        if (result.length == 0) {
            let li = `<div class="no-result">暂无搜索结果</div>`
            $searchResult.find('ol.song-list').empty().append(li)
        } else {
            result.forEach(function (element) {
                appendList($searchResult.find('ol.song-list'), element, false)
            })
        }
    }

    // 获取全局歌曲，用于搜索匹配
    function getSongList() {
        $.get('./json/song_list.json').then(function (response) {
            songList = response
            // console.log(songList)
        })
    }
    // 清理搜索结果
    function clearResultList() {
        $searchResult.find('ol.song-list').empty()
    }
    // 根据song-list.json 匹配是否存在这首歌
    function matchResult(value) {
        let result = []
        if (value) {
            let regex = new RegExp(value)
            result = songList.filter(function (item) {
                return regex.test(item.name) || regex.test(item.album)|| regex.test(item.title)
            })
        }
        return result
    }


    // 搜索：默认/推荐/结果 显示控制
    function show$searchRecom() {
        $searchDefault.removeClass('active')
        $searchRecom.addClass('active')
        $searchResult.removeClass('active')
    }
    function show$searchDefault() {
        $searchDefault.addClass('active')
        $searchRecom.removeClass('active')
        $searchResult.removeClass('active')
    }
    function show$searchResult() {
        $searchDefault.removeClass('active')
        $searchRecom.removeClass('active')
        $searchResult.addClass('active')
    }

    function parseReuslt() {
        return new Promise((resolve, reject) => {

        })
    }

    function recodeSearchResult(){
        
    }
    // 最新音乐
    function getLastestMusic() {
        $.get('./json/lastest_music.json')
            .then(function (response) {
                let $ol = $(".lastest-music>ol.song-list")
                let hasRank = false
                response.forEach(function (element) {
                    appendList($ol, element, hasRank)
                });
                $ol.siblings(".loading-spin").remove()

            })
    }

    // 热歌榜
    function getHotList() {
        $.get('./json/hot_list.json')
            .then(function (response) {
                let $ol = $(".hot-list>ol.song-list")
                let hasRank = true
                response.forEach(function (element) {
                    appendList($ol, element, hasRank)
                });
                $ol.find(".loading-spin").remove()
            })
    }

    // 插入统一歌曲列表
    function appendList($ol, element, hasRank) {
        let [id, title, subTitle, singer, album, sq] = [element.id, element.title, element.subTitle, element.singer, element.album, element.sq]
        let li
        if (hasRank) {
            let rank = (id > 9) ? id : `0${id}`
            let top = id > 3 ? "" : "top"
            li = `
               <li class="song-item">
                   <div class="song-rank ${top}">${rank}</div>
                   <a href="./song.html?id=${id}">
                       <div class="song-infos">
                           <div class="sg-title">${title}<span>${subTitle}</span></div>
                           <div class="sg-singer">
                               <svg class="icon sq ${sq}" aria-hidden="true">
                                   <use xlink:href="#icon-sq"></use>
                               </svg>
                               <div class="singer-info">
                                   ${singer} - ${album}
                               </div>
                           </div>
                       </div>
                       <div class="song-icon-play">
                           <svg class="icon play" aria-hidden="true">
                               <use xlink:href="#icon-circle-play"></use>
                           </svg>
                       </div>
                   </a>
               </li>
            `
        } else {
            li = `
                <li class="song-item">
                    <a href="./song.html?id=${id}">
                        <div class="song-infos">
                            <div class="sg-title">${title}<span>${subTitle}</span></div>
                            <div class="sg-singer">
                                <svg class="icon sq ${sq}" aria-hidden="true">
                                    <use xlink:href="#icon-sq"></use>
                                </svg>
                                <div class="singer-info">
                                   ${singer} - ${album}
                               </div>
                            </div>
                        </div>
                        <div class="song-icon-play">
                            <svg class="icon play" aria-hidden="true">
                                <use xlink:href="#icon-circle-play"></use>
                            </svg>
                        </div>
                    </a>
                </li>
            `
        }
        $ol.append(li)
    }
})