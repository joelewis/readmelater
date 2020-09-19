import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './routes'
import store from './store'
import './quasar'

Vue.use(VueRouter)




Vue.config.productionTip = false

store.dispatch('fetchUser').then(() => {
  window.app = new Vue({ // for debugging attach to window
    router,
    store,
    render: h => h(App),
  }).$mount('#app')
})

