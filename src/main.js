import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex/store'
import VueResource from './http'
import iView from 'iview';
import 'iview/dist/styles/iview.css';

Vue.use(iView);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  VueResource,
  store,
  router,
  render: h => h(App)
}).$mount('#app');
