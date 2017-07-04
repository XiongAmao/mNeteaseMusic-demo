$(function () {
    // topbar
    $(".site-nav>ol").on('click', "li", function (e) {
       if(this == document.querySelectorAll(".site-nav>ol>li")[1]) getHotList()
        var index = $(this).addClass('selected')
            .siblings().removeClass('selected')
            .end().index()
        $('article>section').eq(index).addClass('active')
            .siblings().removeClass('active')
    })

    // let id = parseInt(location.search.match(/\bid=([^&]*)/)[1],10) 
    getLastestMusic()
    

    function getHotList() {
        $.get('./json/hot_list.json').then(function (response) {
            let items = response
            let $ol = $(".hot-list>ol.song-list")
            let hasRank = true
            items.forEach(function (element) {
                appendList($ol, element, hasRank)
            });
            $ol.siblings(".loading-spin").remove()
        })
    }
    function getLastestMusic() {
        $.get('./json/lastest_music.json').then(function (response) {
            let items = response
            let $ol = $(".lastest-music>ol.song-list")
            let hasRank = false
            items.forEach(function (element) {
                appendList($ol, element, hasRank)
            });
            $ol.siblings(".loading-spin").remove()
            
        })
    }

    function appendList($ol, element, hasRank) {
        let [id, title, subTitle, singer, album, sq] = [element.id, element.title, element.subTitle, element.singer, element.album, element.sq]
        let li
        if (hasRank) {
            let rank = (id > 9) ? id : `0${id}`
            let top = id>3 ? "":"top"
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
                               ${singer} - ${album}
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
                                ${singer} - ${album}
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