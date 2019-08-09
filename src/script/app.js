$(function(){

// mainVisualの画像の縦横比を取得
var img = document.getElementById('mainVisual-base-image');

if (img) {
  var imgRatio = img.naturalWidth / img.naturalHeight;
  var fileName = location.pathname.split('/').pop();

  $(window).load(function() {
    mainVisualAdjust();
  });

  $(window).resize(function() {
    mainVisualAdjust();
  });
}

// mainVisualの画像表示変換
  function mainVisualAdjust() {
    w = $(window).width();

    if(fileName == "index.html" || fileName == "") {
      if (w > 915) {
        h = $(window).height() - 60;
      } else {
        h = $(window).height() + 20;
      }

      $('.m-mainVisual').css('height', h + 'px');

    } else {
      h = parseInt($('.m-mainVisual').css('height'));
    }

    if(w / h < imgRatio) {
      imgWidth = h * imgRatio;
      $('.m-mainVisual-image img').css({
        'margin-top': '0',
        'left': '50%',
        'margin-left': -imgWidth / 2 + 'px',
        'width': imgWidth + 'px',
        'height': h + 'px'
     });
    } else {
      imgHeight = w / imgRatio;
      $('.m-mainVisual-image img').css({
        'margin-top': -(imgHeight - h) / 2 + 'px',
        'left': '0',
        'margin-left': '0',
        'width': '100%',
        'height': 'auto'
      });
    }
  }

// ナビゲーションメニューのアコーディオン
  $('').click(function() {
    var $navigation = $('#header .m-navigation ul');
    if($navigation.hasClass('open')) {
      $navigation.slideUp();
      $navigation.removeClass('open');
      $(this).removeClass('is-active');
    } else {
      $navigation.slideDown();
      $navigation.addClass('open');
      $(this).addClass('is-active');
    }
  });

  $('.js-navigation').click(function() {
    if($(this).hasClass('is-open')) {
      $(this).removeClass('is-open');
    } else {
      $(this).addClass('is-open');
    }
  });
  // アコーディオンオープン時に別途close用の要素が出てくる場合
  $('#navigation-close').click(function(){
    var $navigation = $('#header .m-navigation ul');
    $navigation.slideUp();
    $navigation.removeClass('open');
    $('.m-navigation-toggle').removeClass('is-active');
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

// レスポンシブ対応の高機能スライダー「swiper」の設定
  var mySwiper = new Swiper ('.swiper-container', {
    effect: "fade",
    loop: true,
    speed: 1500,
    autoplay: 5000
  });

// ページトップリンク
  $('#js-backTop').click(function() {
    console.log("click");
    $('html, body').animate({
      'scrollTop': 0
    }, 1000);
  });

});



