import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import routes from './routes'
import store from './store'
import './quasar'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: routes // short for `routes: routes`
})



Vue.config.productionTip = false

store.dispatch('fetchUser').then(() => {
  window.app = new Vue({ // for debugging attach to window
    router,
    store,
    render: h => h(App),
  }).$mount('#app')
})

