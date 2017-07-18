# 网易云音乐-移动端页面仿站
官网：http://music.163.com/m/ 
# 预览
手机打开浏览器打开预览：
https://xiongamao.github.io/mNeteaseMusic-demo/build/homepage.html

或者扫描下面二维码：

![](https://xiongamao.github.io/mNeteaseMusic-demo/qrcode.jpeg)




# 依赖
- Jquery2.1.4
- Gulp

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
    - 测试了安卓和iOS上多款浏览器，其阻止自动播放的形式不同，无法通过统一事件监听
    
      因此尝试了下面的方法：
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
        2. 表现为JS触发 `audio.play()`后会触发`canplay` 事件丢浏览器则进行userAgent的匹配，当触发canplay事件后进行检测以排除。
    - 目前最大的问题是如何正确的检测浏览器是否能够自动播放，还需继续研究。
    - 考虑到实际用户的场景，自动播放并不适用于所有用户，比如用户使用移动流量播放，在用户未确认之前，提前加载会导致用户流量浪费。

   
2. iOS CSS3 animation pause的问题
    - 通过JS实现唱片转动动画，解决iOS下，CSS无法pause的问题

3. vw 兼容性问题
    - px vw 混搭处理兼容问题

# TODO 
基本功能已完成，搜索功能搜索的是所有歌曲的JSON文件，由于只有20首歌，因此搜索联想建议功能没有实现。

参考：
http://js.jirengu.com/geyo/2/edit?js,output
https://github.com/Fatty-Shu/audioPlayPlugin
