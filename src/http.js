/**
 * Created by shenzuojun on 2017/7/31.
 * http拦截器配置
 */
import Vue from 'vue'
import VueResource from 'vue-resource';
import Router from './router/index';
import { Message } from 'iview';
import 'iview/dist/styles/iview.css';

Vue.use(VueResource);

Vue.http.options.emulateJSON = true;
Vue.http.options.crossOrigin = true;
Vue.http.options.emulateHTTP = true;

Vue.http.interceptors.push((request, next) => {
  //登录成功后将后台返回的TOKEN在本地存下来,每次请求从sessionStorage中拿到存储的TOKEN值
  let TOKEN = localStorage.getItem('token');
  if (TOKEN) {
    //如果请求时TOKEN存在,就为每次请求的headers中设置好TOKEN,后台根据headers中的TOKEN判断是否放行
    request.headers.set('token', TOKEN);
  }
  next((response) => {
    if (response.body) {
      if (response.body.code === 5500) {
        // alert(response.body.showMsg);
        Message.error('已过期，请重新登录');
        Router.replace('/login');
      } else if (response.body.code === 5003) {
        Message.error(response.body.msg);
      } else if (response.body.code === 605) {
        Message.error('服务器异常，请稍后再试');
      } else if (response.body.code === 11005) {
        Message.error('没有操作权限');
      }
    }
    return response;
  });
});

export default VueResource;


