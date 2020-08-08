import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    setUser (state, user) {
      state.user = user
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
              console.log(e)
              reject(e)
            }
        });
      }
  },
  getters: {
    getUser: state => {
      return state.user
    }
  }
})

export default store;