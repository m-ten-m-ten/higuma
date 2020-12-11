import jQuery from 'jquery'
const $ = jQuery

const visibleScrollTop = 100

export function backTop(): void {
  const backTop = $('.m-back-top')

  // backTopクラス要素をクリックすると、ページトップへスクロール。
  backTop.on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 500)
  })

  // backTopクラス要素の出現制御
  $(window).on('scroll', function () {
    const scrollTop = $(window).scrollTop()

    if (scrollTop > visibleScrollTop) {
      backTop.addClass('back-top__visible')
    } else {
      backTop.removeClass('back-top__visible')
    }
  })
}
