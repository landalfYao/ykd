// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueResource from 'vue-resource'
import  VueQuillEditor from 'vue-quill-editor'
// require styles 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'





Vue.config.productionTip = false
Vue.prototype.com = require('./assets/js/util')
Vue.use(iView)
Vue.use(ElementUI);
Vue.use(VueResource)
Vue.use(VueQuillEditor)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
