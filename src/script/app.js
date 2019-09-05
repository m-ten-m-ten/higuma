$(function(){

// ナビゲーションメニューのアコーディオン
  var $navigation = $('.m-headerNav ul');
  var $navigationClose = $('.m-headerNav-close');
  var $navigationToggle = $('.m-headerNav-toggle');

  $navigationToggle.click(function() {

    if($navigation.hasClass('open')) {
      $navigation.slideUp();
      $navigation.removeClass('open');
      $navigationClose.removeClass('is-active');
      $(this).removeClass('is-active');
    } else {
      $navigation.slideDown();
      $navigation.addClass('open');
      $navigationClose.addClass('is-active');
      $(this).addClass('is-active');
    }
  });

  // アコーディオンオープン時に別途close用の要素が出てくる場合
  $('.m-headerNav-close').click(function(){
    $navigation.slideUp();
    $navigation.removeClass('open');
    $navigationToggle.removeClass('is-active');
    $(this).removeClass('is-active');
  });

// 開いているページのファイル名と同じファイル名をhrefに持つ要素にactiveクラス追加。
  var $fileName = location.pathname.split('/').pop();
  $('#gnavi li a').each(function() {
    var $href = $(this).attr('href');
    if ($href == $fileName) {
      $(this).addClass('active');
    } else {
      $(this).removeClass('active');
    }
  });

// ページトップリンク
  $('#js-backTop').click(function() {
    console.log("click");
    $('html, body').animate({
      'scrollTop': 0
    }, 1000);
  });

});


