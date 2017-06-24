$(function () {
  
  var jukebox = $('.jukebox-container')
  var audio = document.createElement('audio');
  var discTurner = $('.disc-turner')
  audio.src = '//ond8gcwbr.bkt.clouddn.com/%E6%B4%9B%E5%B0%98%E9%9E%85_vvv%20-%20%E6%9C%80%E5%90%8E%E4%B8%80%E9%A1%B5.mp3'
  console.dir(audio);
  $(audio).on('canplay',function(){
    audio.play()
    jukebox.addClass('playing')
  })
  $(".js-play").on('click',function(){
    audio.play()
    jukebox.addClass('playing')
  })
  $(".js-pause").click(function(){
    audio.pause()
    jukebox.removeClass('playing')
  })
  
})