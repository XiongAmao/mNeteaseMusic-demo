# 网易云音乐-移动端页面仿站
官网：http://music.163.com/m/ 
# 预览
https://xiongamao.github.io/mNeteaseMusic-demo/build/homepage.html

# 依赖库
- Jquery2.1.4

# 开发依赖
1. `npm install`

# npm srcript build
1. `npm run build1`
2. `npm run start`
3. open in chrome `http://127.0.0.1:8080/homepage.html`

## Gulp
1. `npm run gulp`
2. open in chrome `http://127.0.0.1:8080/homepage.html`

# 开发过程遇到的问题
1. 移动端audio自动播放问题 
    - 各种audio事件在不同设备上表现非常不一致，没有找到非常统一的事件监听方法
    - 经过一连串的测试，有下面的表现
        1. 当浏览器限制为需要用户手动触发play()时，通过监听canplay事件即可知道音乐是否自动播放，如果可以，音乐会在audio.play() 调用时触发下载及canplay事件 
            ```js
            var audio = document.createElement('audio')
            audio.src = 'test.mp3'
            audio.play()
            // 当浏览器限制为需要用户手动触发play()时，通过监听canplay事件即可知道音乐是否自动播放
            // 
            audio.addEventListener('canplay',function(){
                console.log('can play now')
                // playing animation
            })
            ```
    - 部分浏览器表现为JS触发 `audio.play()`后会触发`canplay` 事件，但是依然不加载音乐，需要手动触发，暂时没有找到其他检测方法，因此只对常用浏览器做了userAgent的匹配，当触发canplay事件后进行检测。
    
   
2. iOS CSS3 animation pause的问题
3. vw 兼容性问题


参考：
 https://github.com/Fatty-Shu/audioPlayPlugin