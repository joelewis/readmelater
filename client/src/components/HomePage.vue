<template>
  <q-layout view="hHh LpR FFF">
    <Header />
    <Drawer />
    <q-page-container>
      <router-view :key="$route.path"></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import {
  matMoreVert, matNotifications,
  matAdd
  } from '@quasar/extras/material-icons';

import Drawer from './Drawer';
import Header from './Header';

export default {

  components: {
    Drawer,
    Header
  },

  data () {
    return {
      currentRoute: 'inbox',
    }
  },

  created () {
    this.matMoreVert = matMoreVert
    this.matNotifications = matNotifications
    this.matAdd = matAdd
  }
}
</script>

<style lang="sass">

</style>
