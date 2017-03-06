import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App'

import Home from './Home'
import Multi from './Multi'
import CrossRouter from './CrossRouter'
import CrossRouterUpload from './CrossRouterUpload'
import CrossRouterList from './CrossRouterList'
import VuexComponent from './Vuex'

import store from './store'

Vue.use(VueRouter)

Vue.config.silent = false;
Vue.config.devtools = true;






Vue.filter('formatSize', function(size) {
  if (size > 1024 * 1024 * 1024 * 1024) {
    return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + ' TB';
  } else if (size > 1024 * 1024 * 1024) {
    return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB';
  } else if (size > 1024 * 1024) {
    return (size / 1024 / 1024).toFixed(2) + ' MB';
  } else if (size > 1024) {
    return (size / 1024).toFixed(2) + ' KB';
  }
  return size.toString() + ' B';
});





const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/multi',
      component: Multi
    },
    {
      path: '/cross-router',
      component: CrossRouter,
      children: [
        { path: '', component: CrossRouterUpload },
        { path: 'list', component: CrossRouterList }
      ]
    },
    {
      path: '/vuex',
      component: VuexComponent,
    },
  ]
})



new Vue({
  router,
  store,
  render(h) {
    return h(App)
  }
}).$mount('#app')
