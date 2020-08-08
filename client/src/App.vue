<template>  
  <home-page v-if="user"></home-page>
  <landing-page v-else></landing-page>
</template>

<script>
import HomePage from './components/HomePage.vue'
import LandingPage from './components/LandingPage.vue'
import {mapState} from 'vuex'

export default {
  name: 'LayoutDefault',

  components: {
    HomePage,
    LandingPage
  },

  computed: mapState({
    user: 'user'
  })
}
</script>

<style>
body {
  font-size: 18px;
}
</style>
