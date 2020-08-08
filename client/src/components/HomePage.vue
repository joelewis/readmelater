<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <q-header bordered class="bg-white text-grey-8" height-hint="150">
      <q-toolbar class="CTE__toolbar">
        <q-btn 
            flat 
            round 
            dense 
            padding="8px"
            :icon="matMenu" 
            @click="leftDrawerOpen = !leftDrawerOpen"
          />

        <q-toolbar-title>
          Toolbar
        </q-toolbar-title>

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn-dropdown outline :no-icon-animation="true">
            <template v-slot:label>
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">
                  K
                </q-avatar>
              </q-item-section>
            </template>

            <q-list>
              <q-item  v-close-popup>
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white">
                    K
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>Karthikeyan Rajendran</q-item-label>
                  <q-item-label caption lines="1">karthik.ricssion@gmail.com</q-item-label>
                </q-item-section>
              </q-item>

              <q-separator />

              <q-item clickable v-close-popup>
                <q-item-section>
                  <q-item-label>Account Settings</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup>
                <q-item-section>
                  <q-item-label>Logout</q-item-label>
                </q-item-section>                
              </q-item>
            </q-list>

          </q-btn-dropdown>
        </div>
        
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-white"
      :width="280"
    >
      <q-scroll-area class="fit">
        <q-list padding class="text-grey-8">
          <q-item class="CTE__drawer-item" v-ripple v-for="link in links1" :key="link.text" clickable>
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator inset class="q-my-sm" />

          <div class="q-mt-md">
            <div class="flex flex-center q-gutter-xs">
              <a class="CTE__drawer-footer-link" href="javascript:void(0)" aria-label="Privacy">Privacy</a>
              <span> · </span>
              <a class="CTE__drawer-footer-link" href="javascript:void(0)" aria-label="Terms">Terms</a>
              <span> · </span>
              <a class="CTE__drawer-footer-link" href="javascript:void(0)" aria-label="About">About CloseTab</a>
            </div>
          </div>

        </q-list>
      </q-scroll-area>

    </q-drawer>

    <q-page-container>
      <h1>Hmmmm okay</h1>
    </q-page-container>

  </q-layout>
</template>

<script>
import { 
  matMenu, matMoreVert, matNotifications,
  matSettings
  } from '@quasar/extras/material-icons'

export default {

  components: {
    
  },

  data () {
    return {
      leftDrawerOpen: false,
      currentRoute: 'inbox',
      links1: [
        { icon: 'web', text: 'Top stories' },
        { icon: 'person', text: 'For you' },
        { icon: 'star_border', text: 'Favourites' },
        { icon: 'search', text: 'Saved searches' }
      ],
    }
  },

  created () {
    this.matMenu = matMenu
    this.matMoreVert = matMoreVert
    this.matNotifications = matNotifications,
    this.matSettings = matSettings
  },

  methods: {
    onItemClick() {
      // console.log('Hello, I am cicked!')
    }
  }
}
</script>

<style lang="sass">
.CTE 
  &__toolbar 
    height: 64px
  
  &__drawer-item
    line-height: 24px
    border-radius: 0 24px 24px 0
    margin-right: 12px

    .q-item__section--avatar
      .q-icon
        color: #5f6368

    .q-item__label
      color: #3c4043
      letter-spacing: .01785714em
      font-size: .875rem
      font-weight: 500
      line-height: 1.25rem

  &__drawer-footer-link
    color: inherit
    text-decoration: none
    font-weight: 500
    font-size: .75rem
    &:hover
      color: #000

</style>
