<template>
    <q-header bordered class="bg-white text-grey-8" height-hint="150">
      <q-toolbar class="CTE__toolbar">
        <q-btn 
            flat 
            round 
            dense 
            padding="8px"
            icon="menu" 
            @click="toggleDrawer"
          />

        <q-toolbar-title>
          <router-link to="/" >
            <img alt="CloseTab logo" style="min-width:45px;" src="../assets/closeTab.svg">
            <span class="title-text">CloseTab</span>
          </router-link>
        </q-toolbar-title>

        <q-space />
        <q-btn size="md" no-caps type="a" href="https://chrome.google.com/webstore/detail/closetabemail/lkgcnpldaonnbdnkiimgdjkecopjnbeb" target="__blank" class="" icon="file_download" outline  color="dark" label="Add Chrome Extension" />
        <q-btn size="md" no-caps type="a" href="https://addons.mozilla.org/en-US/firefox/addon/closetab-email/" target="__blank" icon="file_download" class="q-ma-lg" outline  :ripple="false" color="dark" label="Add Firefox Extension" />
        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn outline icon-right="expand_more" no-caps :label="user.name"
           >


            <q-menu dark>
              <q-list style="min-width:300px;" dark>
                <q-item  v-close-popup>
                  <q-item-section avatar>
                      <q-icon name="account_circle" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label class="text-subtitle2">{{ user.name }}</q-item-label>
                    <q-item-label caption lines="1">{{ user.email }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator />

                <q-item clickable @click="gotoExtension" v-close-popup>
                  <q-item-section avatar class="q-pr-xs">
                    <q-icon name="file_download" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-body2"> Install Chrome Extension</q-item-label>
                  </q-item-section>
                </q-item>
                

                <q-item clickable v-close-popup to="/settings">
                  <q-item-section avatar class="q-pr-xs">
                    <q-icon name="settings" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-body2">Account Settings</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup tag="a" href="/logout">
                  <q-item-section avatar class="q-pr-xs">
                    <q-icon name="logout" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-body2">Logout</q-item-label>
                  </q-item-section>                
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
        
      </q-toolbar>
    </q-header>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'Header',

    computed: {
    ...mapGetters({
      user: 'getUser'
        })
    },

    methods: {
        toggleDrawer() {
            this.$store.dispatch('toggleDrawerStatus')
        },

        gotoExtension() {
          window.open('https://chrome.google.com/webstore/detail/closetabemail/lkgcnpldaonnbdnkiimgdjkecopjnbeb')
        }
    }
}
</script>

<style lang="sass">

</style>