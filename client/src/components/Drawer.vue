<template>
  <q-drawer
    v-model="leftDrawerOpen"
    content-class="bg-white"
    :breakpoint="700"
    >
    <q-scroll-area class="fit">
      <q-btn  
        type="a"
        rounded 
        :icon="matAdd" 
        style="background: #FFF;"
        label="New Link"
        text-color="grey-10"
        class="CTE__compose"
        to="/inbox/new"
      />

    
      <q-list padding class="text-grey-8">
        <q-item class="CTE__drawer-item" :to="link.to" v-ripple v-for="link in links1" :key="link.text" clickable active-class="bg-red-1">
          <q-item-section avatar>
            <q-icon :name="link.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="CTE__drawer-item-label">{{ link.text }}</q-item-label>
            <q-item-label caption lines="1">{{ link.caption }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator inset class="q-my-sm" />

        <div class="q-mt-md">
          <div class="flex flex-center q-gutter-xs">
            <router-link class="CTE__drawer-footer-link" to="/privacy" active-class="text-blue-7" aria-label="Privacy">Privacy</router-link>
            <span> · </span>
            <router-link class="CTE__drawer-footer-link" to="/terms" active-class="text-blue-7" aria-label="Terms">Terms</router-link>
            <span> · </span>
            <router-link class="CTE__drawer-footer-link" to="/about" active-class="text-blue-7" aria-label="About">About CloseTab</router-link>
          </div>
        </div>

      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script>
import { mapGetters } from 'vuex';
import { 
  matMenu, matMoreVert, matNotifications,
  matSettings, matInbox, matHelp,
  matLabel, matAdd
  } from '@quasar/extras/material-icons';

export default {
  name: 'Drawer',
  
  computed: {
    ...mapGetters({
      leftDrawerOpen : 'getDrawerStatus'
    })
  },

  data() {
    return {
      links1: [
        { icon: matInbox, text: 'Inbox', caption: 'All links', to: '/inbox' },
        // { icon: matLabel, text: 'Tags', caption: 'Manage Tags', to: '/tags' },
        { icon: matSettings, text: 'Settings', caption: 'Configure preferences', to: '/settings' },
        { icon: matHelp, text: 'Faq', caption: 'Help center', to: '/faq' },
      ],
    }
  },
  
  created () {
    this.matMenu = matMenu
    this.matMoreVert = matMoreVert
    this.matNotifications = matNotifications
    this.matAdd = matAdd
  },
}
</script>

<style lang="sass">
.CTE 
  &__toolbar 
    height: 64px

    .q-toolbar__title
      padding: 6px 0 0 12px
      
    .title-text 
      font-size: 16px
      font-weight: 600
      vertical-align: top
      padding: 4px
      display: inline-block
      color: #333
      padding-top: 1px
  
  &__drawer-item
    line-height: 24px
    border-radius: 0 24px 24px 0
    margin-right: 12px

    .q-item__section--avatar
      .q-icon
        color: #5f6368
        padding-left: 4px

    .q-item__label
      color: #3c4043
      letter-spacing: .01785714em
      font-size: .875rem
      font-weight: 500
      line-height: 1.25rem

    .q-item__label--caption
      font-size: 0.75rem;
      font-weight: 400;
      line-height: 1.25rem;
      letter-spacing: 0.03333em;

  &__drawer-footer-link
    color: inherit
    text-decoration: none
    font-weight: 500
    font-size: .75rem
    &:hover
      color: #000

  &__compose 
    margin: 16px 8px
    margin-bottom: 8px

    .q-btn__content
      svg 
        margin-left: -4px
        margin-right: 8px

</style>