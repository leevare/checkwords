// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Element from 'element-ui'
import App from './App'
import VueResource from 'vue-resource'
import VueCookies from 'vue-cookies'


Vue.config.productionTip = false

Vue.use(Element)

Vue.use(VueCookies)

import "element-ui/lib/theme-default/index.css"

Vue.use(VueResource)

Vue.http.options.emulateJSON = true;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
