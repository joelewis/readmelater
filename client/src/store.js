import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: null,
    links: [],
    tags: [],
    filter: {
      tags: [],
      linkSearch: ''
    },
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
    },

    setLinks (state, links) {
      state.links = links
    },

    addLink (state, link) {
      state.links = state.links.filter(l => l.id != link.id);
      link.isSelected = false;
      state.links.push(link);
    },

    deleteLink (state, linkId) {
      state.links = state.links.filter(l => l.id != linkId);
    },

    setNotifyStatus (state, {links, status}) {
      console.log(links, status);
      state.links.forEach(l => {
        if (links.indexOf(l.id) > -1) {
          l.notify = status;
        }
      });
    },
    
    setFilter (state, filter) {
      state.filter = filter;
    },

    setTags (state, tags) {
      state.tags = tags
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
            resolve()
            // reject(e)
          }
      });
    },
    
    toggleDrawerStatus ({ commit }) {
      commit('toggleDrawerStatus')
    },

    async addLink ({commit}, link) {
      try {
        var resp = await axios.post('/bookmark', link)
        commit('addLink', resp.data);
      } catch (e) {
        console.warn(e);
      }
    },

    async fetchLinks ({commit, state}) {
      try {
        var queryParams = state.filter ? '?filter='+encodeURIComponent(JSON.stringify(state.filter)): '';
        var resp = await axios.get('/links' + queryParams)
        resp.data.forEach(l => {
          l.isSelected = false;
        })
        commit('setLinks', resp.data);
      } catch (e) {
        console.warn(e);
      }
    },

    async fetchTags ({commit}) {
      try {
        var resp = await axios.get('/tags')
        commit('setTags', resp.data);
      } catch (e) {
        console.warn(e);
      }
    },

    async deleteLink({commit}, linkId) {
      try {
        var resp = await axios.delete('/bookmark', {data: {id: linkId}})
        commit('deleteLink', linkId);
      } catch (e) {
        console.warn(e);
      }
    },

    async setNotifyStatus({commit}, {links, status}) {
      try {
        var resp = await axios.post(status === true? '/startemails': '/stopemails', {type: 'link', links: links})
        commit('setNotifyStatus', {links, status: status});
      } catch (e) {
        console.warn(e);
      }
    }
  },
  getters: {
    getUser: state => {
      return state.user
    },

    getDrawerStatus: state => {
      return state.view.drawerOpen
    },
    
    isLoggedIn: state=> {
      return state.user != null;
    },

    links: state => {
      return state.links.sort((l1, l2) => { return (new Date(l2.createdAt).getTime() - new Date(l1.createdAt).getTime()) } );
    }
  }
})

export default store;