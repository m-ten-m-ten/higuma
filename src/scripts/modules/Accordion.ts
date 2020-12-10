import jQuery from 'jquery'
const $ = jQuery

export class Accordion {
  private accordionWrapper
  private accordionBody
  private accordionTrigger

  constructor(accordionWrapper) {
    this.accordionWrapper = accordionWrapper
    this.accordionBody = this.accordionWrapper.children(
      '.accordion-body:not(:animated)'
    )
    this.accordionTrigger = this.accordionWrapper.children('.accordion-trigger')
    this.bindEvent()
  }

  bindEvent() {
    this.accordionTrigger.on('click', $.proxy(this.slideMenu, this))
    $(window).on('resize', () => {
      this.accordionBody.removeAttr('style')
      this.accordionTrigger.removeClass('is-open')
    })
  }

  slideMenu() {
    if (this.accordionBody.css('display') === 'none') {
      this.accordionBody.slideDown()
      this.accordionTrigger.addClass('is-open')
    } else {
      this.accordionBody.slideUp()
      this.accordionTrigger.removeClass('is-open')
    }
  }
}
