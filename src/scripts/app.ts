import '@babel/polyfill'
import '../style/style.scss'
import jQuery from 'jquery'
const $ = jQuery
import { App } from './action/App'

const app = new App()
const routes = {}
const route = (path) => {
  if (Object.prototype.hasOwnProperty.call(route, path)) {
    return routes[path]
  }
  return app
}
const action = route($('#main').data('action'))
action.ready()
