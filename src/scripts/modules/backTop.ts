import jQuery from 'jquery'
const $ = jQuery

export function backTop() {
  const backTop = $('.m-back-top')

  // backTopクラス要素をクリックすると、ページトップへスクロール。
  backTop.on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 500)
  })

  // backTopクラス要素の出現制御
  $(window).on('scroll', function () {
    const triggerPoint = 100
    let scrollTop = $(window).scrollTop()

    if (scrollTop <= triggerPoint) {
      backTop.removeClass('back-top__visible')
    } else {
      backTop.addClass('back-top__visible')
    }
  })
}
