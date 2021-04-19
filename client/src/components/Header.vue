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

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn unelevated round :label="user.name[0]"
            color="orange"
            text-color="grey-1"
           >
            <q-menu>
              <q-list>
                <q-item  v-close-popup>
                  <q-item-section avatar>
                    <q-avatar color="orange" text-color="white">
                      {{ user.name[0] }}
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>{{ user.name }}</q-item-label>
                    <q-item-label caption lines="1">{{ user.email }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator />

                <q-item clickable v-close-popup>
                  <q-item-section>
                    <q-item-label>Install Chrome Extension</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup to="/account-settings">
                  <q-item-section>
                    <q-item-label>Account Settings</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup tag="a" href="/logout">
                  <q-item-section>
                    <q-item-label>Logout</q-item-label>
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
        }
    }
}
</script>

<style lang="sass">

</style>