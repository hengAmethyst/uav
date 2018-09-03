import Vue from 'vue'
import VueRouter from 'vue-router'
import iView from 'iview';
import store from '../vuex/store'
import * as types from '../vuex/types'
Vue.use(iView);
Vue.use(VueRouter);
// iView.LoadingBar.config({
//   color: '#19be6b',
//   failedColor: '#ed3f14',
//   height: 2
// });

const routes = [{
    path: '/',
    component: resolve => require(['../components/cloud/cloud'], resolve),
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/home',
    component: resolve => require(['../components/home/index'], resolve)
  },
  {
    path: '/taskManager',
    component: resolve => require(['../components/taskManager/index'], resolve),
    children:[
      {
        path: '/',
        component: resolve => require(['../components/taskManager/taskDetail'], resolve),
      },
      {
        path: 'taskDetail',
        component: resolve => require(['../components/taskManager/taskDetail'], resolve),
      },
      {
        path: 'gantaInfoManager',
        component: resolve => require(['../components/taskManager/gantaInfoManager/index'], resolve),
      },
      {
        path: 'issuesInfoManager',
        component: resolve => require(['../components/taskManager/issusInfoManager/index'], resolve),
      },
      {
        path: 'personInfoManager',
        component: resolve => require(['../components/taskManager/personInfoManager/index'], resolve),
      },
      {
        path: 'uavInfoManager',
        component: resolve => require(['../components/taskManager/uavInfoManager/index'], resolve),
      },
      {
        path: 'sectionInfoManager',
        component: resolve => require(['../components/taskManager/sectionInfoManager/index'], resolve),
      }
    ]
  },
  {
    path: '/forget',
    component: resolve => require(['../components/home/forget'], resolve)
  },
  {
    path: '/register',
    component: resolve => require(['../components/home/register'], resolve)
  },
  {
    path: '/result',
    component: resolve => require(['../components/resultPage'], resolve)
  },
  {
    path: '/cloud',
    component: resolve => require(['../components/cloud/cloud'], resolve),
    meta: {
      requireAuth: true
    },
    children: [{
        path: '/cloud',
        redirect: '/cloud/home'
      },
      {
        path: '/cloud/home',
        component: resolve => require(['../components/cloud/home/home'], resolve),
        meta: {
          requireAuth: true
        },
      },
      {
        path: '/cloud/report',
        component: resolve => require(['../components/cloud/data/report'], resolve),
        meta: {
          requireAuth: true
        },
      },
      {
        path: '/cloud/checking',
        component: resolve => require(['../components/cloud/data/checking'], resolve),
        meta: {
          requireAuth: true
        },
      },
      {
        path: '/cloud/order',
        component: resolve => require(['../components/cloud/order/order'], resolve),
        meta: {
          requireAuth: true
        },
      },
      {
        path: '/cloud/member',
        component: resolve => require(['../components/cloud/member/member'], resolve),
        meta: {
          requireAuth: true
        },
      },
      {
        path: '/cloud/merchant',
        component: resolve => require(['../components/cloud/stores/merchant'], resolve),
        meta: {
          requireAuth: true
        },
      },
      {
        path: '/cloud/staff',
        component: resolve => require(['../components/cloud/stores/staff'], resolve),
        meta: {
          requireAuth: true
        },
      },
      {
        path: '/cloud/good',
        component: resolve => require(['../components/cloud/goods/good'], resolve),
        meta: {
          requireAuth: true
        },
      },
      {
        path: '/cloud/setMeal',
        component: resolve => require(['../components/cloud/goods/setMeal'], resolve),
        meta: {
          requireAuth: true
        },
      },
      {
        path: '/cloud/setMealAdd',
        component: resolve => require(['../components/cloud/goods/setMealAdd'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/cloud/setMealEdit',
        component: resolve => require(['../components/cloud/goods/setMealEdit'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/cloud/surcharge',
        component: resolve => require(['../components/cloud/dining/surcharge'], resolve),
        meta: {
          requireAuth: true
        },
      },
      {
        path: '/cloud/takeOut',
        component: resolve => require(['../components/cloud/dining/takeOut'], resolve),
        meta: {
          requireAuth: true
        },
      },
      {
        path: '/cloud/financial',
        component: resolve => require(['../components/cloud/dining/financial'], resolve),
        meta: {
          requireAuth: true
        },
      },
      {
        path: '/cloud/pricing',
        component: resolve => require(['../components/cloud/dining/pricing'], resolve),
        meta: {
          requireAuth: true
        },
      },
      {
        path: '/cloud/store',
        component: resolve => require(['../components/cloud/orderFood/store'], resolve),
        meta: {
          requireAuth: true
        },
      },
      {
        path: '/cloud/menu',
        component: resolve => require(['../components/cloud/orderFood/menu'], resolve),
        meta: {
          requireAuth: true
        },
      },
      {
        path: '/cloud/images',
        component: resolve => require(['../components/cloud/resources/images'], resolve),
        meta: {
          requireAuth: true
        },
      },
      {
        path: '/cloud/videos',
        component: resolve => require(['../components/cloud/resources/videos'], resolve),
        meta: {
          requireAuth: true
        },
      },
      {
        path: '/cloud/log',
        component: resolve => require(['../components/cloud/system/log'], resolve),
        meta: {
          requireAuth: true
        },
      },
      {
        path: '/cloud/user',
        component: resolve => require(['../components/cloud/user/user'], resolve),
        meta: {
          requireAuth: true
        },
      },
      {
        path: '/cloud/setTakeOut',
        component: resolve => require(['../components/cloud/dining/setTakeOut'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/cloud/setTakeOutElm',
        component: resolve => require(['../components/cloud/dining/setTakeOutElm'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/cloud/setGrantElm',
        component: resolve => require(['../components/cloud/dining/setGrantElm'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/cloud/message',
        component: resolve => require(['../components/cloud/message/message'], resolve),
        meta: {
          requireAuth: true
        },
      },
      {
        path: '/cloud/addStore',
        component: resolve => require(['../components/cloud/stores/addStore'], resolve),
        meta: {
          requireAuth: true
        },
      },
      {
        path: '/cloud/editStore',
        component: resolve => require(['../components/cloud/stores/editStore'], resolve),
        meta: {
          requireAuth: true
        },
      },
      {
        path: '/cloud/payment',
        component: resolve => require(['../components/cloud/dining/payment'], resolve),
        meta: {
          requireAuth: true
        },
      },
      {
        path: '/cloud/addStaff',
        component: resolve => require(['../components/cloud/stores/addStaff'], resolve),
        meta: {
          requireAuth: true
        },
      },
      {
        path: '/cloud/editStaff',
        component: resolve => require(['../components/cloud/stores/editStaff'], resolve),
        meta: {
          requireAuth: true
        },
      },
      {
        path: '/cloud/unBind',
        component: resolve => require(['../components/cloud/dining/unBind'], resolve),
        meta: {
          requireAuth: true
        },
      },
      {
        path: '/cloud/dishMapping',
        component: resolve => require(['../components/cloud/dining/dishMapping'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/cloud/dishMappingElm',
        component: resolve => require(['../components/cloud/dining/dishMappingElm'], resolve),
        meta: {
          requireAuth: true
        }
      }
    ]
  },
];

const router = new VueRouter({
  routes
});

// 页面刷新时，重新赋值token
if (window.localStorage.getItem('token')) {
  store.dispatch('login', window.localStorage.getItem('token'))
}

if (window.localStorage.getItem('currentMerchantId')) {
  store.dispatch('currentMerchantId', window.localStorage.getItem('currentMerchantId'))
}
// router.beforeEach((to, from, next) => {
//   iView.LoadingBar.start();
//   next();
// });

router.beforeEach((to, from, next) => {
  // next();
  if (to.matched.some(r => r.meta.requireAuth)) {
    if (store.getters['token']) {
      iView.LoadingBar.start();
      next();
    } else {
      iView.LoadingBar.start();
      next({
        path: '/home',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    iView.LoadingBar.start();
    next();
  }
});

router.afterEach((to, from, next) => {
  iView.LoadingBar.finish();
});

export default router;
