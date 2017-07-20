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
    buildHistory()
    // 获取全局歌曲，用于搜索匹配
    function getSongList() {
        $.get('./json/song_list.json').then(function (response) {
            songList = response
        })
    }

    // 搜索组件事件绑定
    function bindSearchTab() {
        $seartForm.on('submit', function (e) {
            let value = $searhInput.val()
            e.preventDefault();
            showSearchResult(value)
            saveSearchHistory(value)
        })
        // 搜索输入框关闭按钮
        $searhInputCloseBtn.on('click', function (e) {
            $searhInput.val("")
            $searhInputCloseBtn.removeClass('active')
            $searchResult.find('ol.song-list').empty()
            show$searchDefault()
            clearTimeout(SearchInputTimer)
            buildHistory()
        })
        // 搜索建议 按钮
        $searchRecom.find('.sr-input-btn').on('click', function () {
            let value = $searhInput.val()
            showSearchResult(value)
            saveSearchHistory(value)
            buildHistory()
        })
        // 搜索输入框数值变化监听
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
                $searchResult.find('ol.song-list').empty()
                clearTimeout(SearchInputTimer)
                show$searchDefault()
            }
        })
        // 搜搜历史按钮 事件委托
        $('.sd-hotlist').on('click', 'li', function () {
            let value = $(this).text()
            $searhInput.val(value)
            $searhInputCloseBtn.addClass('active')
            showSearchResult(value)
            saveSearchHistory(value)
        })
        $('.sd-history .search-list')
            .on('click', '.item', function () {
                console.log('click')
                let value = $(this).find('p').text()
                showSearchResult(value)
                $searhInput.val(value)
                $searhInputCloseBtn.addClass('active')
            })
            .on('click', '.history-close', function (e) {
                deleteSearchHistory($(this).siblings('p').text())
                buildHistory()
                e.stopPropagation()
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

    // 根据song-list.json 匹配是否存在这首歌
    function matchResult(value) {
        let result = []
        if (value) {
            let regex = new RegExp(value)
            result = songList.filter(function (item) {
                return regex.test(item.name) || regex.test(item.album) || regex.test(item.title)
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

    // 搜索历史组件
    function saveSearchHistory(value) {
        let history = localStorage.getItem('search-history')
        let array = history ? JSON.parse(history) : []
        array.indexOf(value) === -1 && array.push(value)
        localStorage.setItem('search-history', JSON.stringify(array))
    }
    function deleteSearchHistory(value) {
        let history = localStorage.getItem('search-history')
        let array = history ? JSON.parse(history) : []
        array = array.filter(function (item) {
            return value !== item
        })
        localStorage.setItem('search-history', JSON.stringify(array))
    }

    // 构建历史记录
    function buildHistory() {
        let $searchList = $('.sd-history .search-list')
        $searchList.empty()
        let history = JSON.parse(localStorage.getItem('search-history'))
        history.forEach(function (item) {
            let li = `  <li class="item"> <figure> <svg class="icon"> <use xlink:href="#icon-clock"></use> </svg> </figure> <p>${item}</p> <figure class="history-close"> <svg class="icon"> <use xlink:href="#icon-cha1"></use> </svg> </figure> </li>`
            $searchList.append($(li))
        })
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