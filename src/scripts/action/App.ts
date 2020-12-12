import jQuery from 'jquery'
const $ = jQuery
import { Accordion } from '../modules/Accordion'
import { backTop } from '../modules/backTop'

export class App {
  ready() {
    window.onload = function () {
      backTop()

      // アコーディオンメニューの数だけインスタンス生成
      $('.accordion-wrapper').each(function () {
        new Accordion($(this))
      })
    }
  }
}
