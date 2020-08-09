import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: null,
    view: {
      drawerOpen: true
    }
  },
  mutations: {
    setUser (state, user) {
      state.user = user
    },

    toggleDrawerStatus (state) {
      state.view.drawerOpen = !state.view.drawerOpen
    }
  },
  actions: {
    async fetchUser ({ commit }) {
      return new Promise( async function(resolve, reject) {
          try {
              var resp = await axios.get('/session')
              commit('setUser', resp.data)
              resolve()
          } catch (e) {
            reject(e)
          }
      });
    },
    
    toggleDrawerStatus ({ commit }) {
      commit('toggleDrawerStatus')
    }
  },
  getters: {
    getUser: state => {
      return state.user
    },

    getDrawerStatus: state => {
      return state.view.drawerOpen
    }     
  }
})

export default store;