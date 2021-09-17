<template>
    <q-page>
       <div class="col-6 col-12-xs q-pa-md">

          <div class="row">
            <div class="col-6 col-12-xs q-gutter-sm">
              <q-banner v-show="showPaymentProcessingBanner" inline-actions rounded class="bg-green-1 text-green-10">
                    <div>Thank you! It might take a short while to process the payment and reflect the status here. Until then this page may show up as an unsubscribed user. If it doesn't reflect within a few minutes, <a href="mailto:joe@closetab.email">write to us</a> and we'll quickly sort it out.</div>
              </q-banner>
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

          <div class="row q-pt-lg" v-if="user.paymentStatus === 'unsubscribed'">
            <div class="col-6 col-12-xs q-gutter-sm">
                <q-btn @click="createCheckoutSession" no-caps rounded unelevated color="red-10">Annual Membership&nbsp;<b style="font-size:1.2em;">$19.99/year</b></q-btn>
                <p> Upgrade to a premium account to sync your <b>Pocket</b> bookmarks automatically. This way you can stay in your current bookmarking workflow and also reap the benefits of CloseTab. Just tag the link with <a href="#">#readlater</a> and it will be synced to <b>Closetab</b> automatically.</p>
                <p> <a href="mailto:joe@closetab.email">Write to us if you want to sync with any other bookmarking services</a></p>

                <q-btn no-caps rounded outline disabled color="red">Connect your Pocket Account</q-btn>
                <p> Needs a premium subscription to activate</p>
            </div>
          </div>

          <div class="row q-pt-lg" v-if="user.paymentStatus === 'subscribed'">
            <div class="col-6 col-12-xs q-gutter-sm">
              <q-banner inline-actions rounded class="bg-green-1 text-green-10">
                <div>Congratulations! You have subscribed for premium features.</div>
                <template v-slot:action>
                  <form method="POST" action="/create-customer-portal-session">
                    <q-btn type="submit" @click="redirectToBillingPortal" no-caps rounded unelevated label="Manage Billing" />
                  </form>
                </template>
              </q-banner>
              <!-- <q-dialog v-model="confirmUnsubscribe" class="q-ma-lg">
                <q-card>
                  <q-card-section class="row items-center">
                    <span class="q-ml-sm">Sad to see you go. You will not be charged anymore after unsubscribing. <b> Are you sure you want to unsubscribe?</b></span>
                  </q-card-section>

                  <q-card-actions align="right">
                    <q-btn flat label="Cancel" color="primary" v-close-popup />
                    <q-btn @click="unsubscribePremium" label="Yes, unsubscribe me" color="primary" v-close-popup />
                  </q-card-actions>
                </q-card>
              </q-dialog> -->


              <q-banner v-if="!user.pocketConnected" inline-actions rounded class="bg-cyan-1 text-cyan-10">
                  <div>Connect your Pocket account. Once connected with your Pocket account, all the pocket links you tag with <b>"readlater"</b>, will automatically sync with your <b>CloseTab</b> account.</div>
                  <template v-slot:action>
                    <q-btn @click="connectPocket" no-caps rounded unelevated label="Connect Pocket Account" />
                  </template>
              </q-banner>
              <template v-else>
              <q-banner inline-actions rounded class="bg-cyan-1 text-cyan-10">
                  <div>Connected with your Pocket Account.</div>
                  <template v-slot:action>
                    <q-btn @click="connectPocket" no-caps rounded unelevated label="Reconnect" />
                  </template>
              </q-banner>
              <q-banner inline-actions rounded class="bg-orange-1 text-red-10">
                  <div> When bookmarking a link with Pocket, tag it with <b>"readlater"</b>. Those bookmarks will be automatically bundled with your weekly digest. </div>  
              </q-banner>
              </template>
                
            </div>
          </div>

          <q-separator class="q-mt-lg" />

          <div class="col-6 col-12-xs q-gutter-sm">
            <q-btn @click="confirmAccDelete = true" class="q-mt-lg q-ml-md" color="red-10"> Delete My Account </q-btn>
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
      confirmAccDelete: false,
      confirmUnsubscribe: false,
      showPaymentProcessingBanner: false
    }
  },

  computed: {
    ...mapState(['user']), 
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

    if (this.$route.name === 'paymentsuccess') {
      this.showPaymentProcessingBanner = true;
    }

      try {
        await this.$store.dispatch('fetchTags')
        this.tagOptions = this.$store.state.tags.map(t => t.tag);
        this.tags = this.$store.state.tags.filter(t => !t.notify).map(t => t.tag);
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
    },

    createCheckoutSession: function() {
      var priceId = "price_1J4m9bSCpjxoLuKMuhf4EUK6";
      return fetch("/start-payment-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          priceId: priceId
        })
      }).then(function(result) {
        return result.json();
      }).then(data => {
        stripe.redirectToCheckout({
          sessionId: data.sessionId
        })
      }).then(resp => {
        console.log(data);
      });
    },

    unsubscribePremium: function() {
      console.log('call unsubscribe code');
    },

    redirectToBillingPortal: function() {

    },

    connectPocket: function() {
      window.location.href = '/auth/pocket'
    }
  }
}
</script>
