<template>
    <q-page>
       <div class="q-pa-md">
          <div class="row">
            <div class="col-6 col-12-xs q-gutter-sm">
              <q-checkbox color="red" v-model="unsubscribe" label="Stop sending me all email reminders" />
            </div>
          </div>
        
          <q-separator class="q-mt-lg" />

          <div class="row q-pt-lg">
            <div class="col-6 col-12-xs q-gutter-sm">
              <p class="q-pl-sm">Stop sending me email reminders for the below tags </p>
              <q-select
                  ref="tagsearchElement"
                  dense
                  class="tagselector q-pl-sm"
                  filled
                  v-model="tags"
                  use-input
                  use-chips
                  multiple
                  input-debounce=0
                  :options="tagOptions"
                  @filter="filterFn"
                  @input="onTagsInput"
              >
                <template v-if="tags.length" v-slot:append>
                  <q-icon name="cancel" @click.stop="tags = []; updateSettings();" class="cursor-pointer" />
                </template>
              </q-select>
            </div>
          </div>

          <q-separator class="q-mt-lg" />

          <div class="col-6 col-12-xs q-gutter-sm">
            <q-btn @click="confirmAccDelete = true" class="q-mt-lg q-ml-md" color="red"> Delete My Account </q-btn>
            <q-dialog v-model="confirmAccDelete" class="q-ma-lg">
              <q-card>
                <q-card-section class="row items-center">
                  <span class="q-ml-sm">All your bookmarked links will be deleted permanently.<b> Are you sure you want to delete your account?</b></span>
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn flat label="Cancel" color="primary" v-close-popup />
                  <q-btn @click="deleteAccount" label="Yes, delete my account" color="primary" v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
        </div>
    </q-page>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
export default {
  data: () => {
    return {
      tags: [],
      tagOptions: [],
      confirmAccDelete: false
    }
  },

  computed: { 
    ...mapGetters(['unsubscribedTags']),

    unsubscribe: {
        get () {
          return !this.$store.state.user.notify
        },
        set (notify) {
          var user = {
            ...this.$store.state.user,
            notify: !notify
          }
          this.$store.commit('setUser', user);
        }
    }
  },

  watch: {
    unsubscribe(val, oldval) {
      this.updateSettings();
    },

    tags(val, oldval) {

    }
  },

  created: async function() {
      try {
        await this.$store.dispatch('fetchTags')
        console.log(this.$store.state.tags)
        this.tagOptions = this.$store.state.tags.map(t => t.tag);
        this.tags = this.$store.state.tags.filter(t => !t.notify).map(t => t.tag);
        console.log(this.tags);
      } catch (e) {
      }
  },

  methods: {

    deleteAccount() {
      window.location.href = '/deleteaccount' 
    },

    updateSettings() {
      this.$store.dispatch('updateSettings', {
        unsubscribeUser: this.unsubscribe,
        unsubscribedTags: this.tags
      })
    },

    onTagsInput() {
      var self = this;
      this.$refs.tagsearchElement.updateInputValue("");
      setTimeout(()=> {
        self.$refs.tagsearchElement.hidePopup();
      }, 0)
      this.updateSettings();
    },

    filterFn: function(val, update) {
        var self = this;
        update(() => {
          if (val === '') {
            self.tagOptions = this.$store.state.tags.map(t => t.tag)
          }
          else {
            self.tagOptions = self.tagOptions.filter(t => t.startsWith(val))
          }
        })
    }
  }
}
</script>
