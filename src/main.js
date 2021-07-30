import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store"
import FastClick from 'fastclick'
import VueLazyload from 'vue-lazyload'

import toast from "components/common/toast";

Vue.config.productionTip = false

// 通过原型 创建事件总线
Vue.prototype.$bus = new Vue()

// 使用插件
Vue.use(toast)
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: require('assets/img/common/error.png'),
  loading: require('assets/img/common/mrly.png'),
  attempt: 1
})


//解决移动端300ms延迟
FastClick.attach(document.body)


new Vue({
  render: h => h(App),
  router,store
}).$mount('#app')


