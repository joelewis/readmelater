<template>
  <q-layout view="lHh Lpr lFf">
    <q-header style="display:none;" class="dark bg-grey-1">
      <q-toolbar>
        <q-toolbar-title class="text-red-8" style="font-size:40px;">
          <img style="height:80px;" alt="Quasar logo" src="../assets/closetab.png">
          <!-- <span >Close</span><b><span class="text-dark">Tabs</span></b><small class="" style="font-size:20px;">.email</small> -->
        </q-toolbar-title>

        <!-- <div>

          <q-btn-dropdown
            color="deep-purple"
            label="Sign-in Using"
          >
            <div class="row no-wrap q-pa-md">
                <q-btn type="a" href="/auth/google">Sign-in Using Google Account</q-btn>
            </div>
            <div class="row no-wrap q-pa-md">
                <q-btn type="a" href="/auth/google">Sign-in Using Twitter Account</q-btn>
            </div>
          </q-btn-dropdown>
        </div> -->
      </q-toolbar>
    </q-header>


    <!-- <q-footer>
        <div class="row bg-red-1 q-pa-sm">
          <div class="col-lg-3 col-md-3 col-sm-1">
            
          </div>
          <div class="col">
            <div class="text-center text-black text-caption q-mb-0">Crafted with ❤️ from Madras</div>
          </div>

          <div class="col-lg-3 col-md-3 col-sm-1">
            
          </div>
        </div>
    </q-footer> -->

    <q-page-container>
        <q-page>
        <div class="row">
          <div class="col-lg-3 col-md-3 col-sm-1"></div>
          <div class="col">

              <img style="height:200px;" alt="Quasar logo" src="../assets/closetab.png">
              <h3 style="margin-bottom: 0px; font-weight: bold;">
                  Add a tab to your reading list.
              </h3>
              <h5 style="margin-top: 8px !important;">
                <b>CloseTab</b> will remember it and nudge you to read it later.
              </h5>

              <div>  
                <q-btn icon="login" @click="loginWith('google')" unelevated rounded color="red" label="Sign-in Using Google" />
                <q-btn icon="login" @click="loginWith('twitter')" unelevated class="q-ml-lg" rounded color="blue" label="Sign-in Using Twitter" />
                <!-- <q-btn class="q-ml-lg" @click="loginWith('twitter')" unelevated rounded color="light-blue-14" label="Sign-in Using Twitter" /> -->
              </div>

              <div class="q-pt-lg">
                <p>
                    Are you scared to close those extra tabs in your browser, afraid you might forget them forever?
                    Maybe it's a really long article or a group of related tabs from your recent research – now you can just <a href="#">#tag</a> them, <u>set a timeout</u> and CloseTab will make sure you finish consuming those tabs <u>in time</u>.
                </p>

                <q-btn type="a" href="https://chrome.google.com/webstore/detail/closetabemail/lkgcnpldaonnbdnkiimgdjkecopjnbeb" target="__blank" class="" icon="file_download" outline  color="dark" label="Add Chrome Extension" />
                <q-btn type="a" href="https://addons.mozilla.org/en-US/firefox/addon/closetab-email/" target="__blank" icon="file_download" class="q-ml-lg" outline  :ripple="false" color="dark" label="Add Firefox Extension" />
              </div>

              <div class="q-pt-lg">
                <h2 class="text-red-9">😊 Smarter Bookmarking </h2>
                <p>
                  We bookmark links in hopes of reading it later. Some of us though, forget to actually go back and read them.
                <!-- </p>
                <p> -->
                  Fearing the endless abyss of bookmarks, we keep these extra tabs open and eventually end up with a browser window of 99 tabs 😊
                <!-- </p>
                <p> -->
                  <br>
                  <b>CloseTab</b> helps by being a little smarter to remind you to come back, keeping track of your reading list. Such that, you can confidently close those tabs now.
                </p>
              </div>

              <div class="q-pt-lg">
                <h2 class="">😊 Weekly Emails</h2>
                <p>
                  Without cluttering your inbox, <b>CloseTab</b> starts sending weekly reminders of pending articles you've been meaning to read.
                </p>
              </div>

              <div class="q-pt-lg">
                <h2 class="text-red-9"># Timeouts &amp; Tags</h2>
                <p>
                  You can choose your timeout within which you'd like to come back. The weekly digest will respect the timeout and stop notifying the link if marked read or if the time-out is crossed. Once you open a link from the reminder email, it automatically is marked as read.
                   You can also <a href="#">#tag</a> your links for quicker lookups and groupings.
                </p>
              </div>

              <div class="q-pt-lg q-pb-lg">
                <h2 class="">Pricing</h2>
                <p>
                  While these features will be free, we are working on advanced features like <b>Pocket integration, automatic archival of bookmarked pages, more intuitive reminders with reading time estimates and auto-planning to complete readings per #tag</b>. Please register your preference to help us decide.
                </p>
                <div class="q-pa-md bg-indigo-1">  
                  <q-checkbox v-show="!showThankyou" v-model="willPay" label="I might consider upgrading to a paid plan for these advanced features." />
                  <transition name="fade">
                    <div v-show="showThankyou"> Thank you! If you've got specific requirements please <a href="mailto:joe@closetab.email">write to us</a></div>
                  </transition>
                  <!-- <q-btn class="q-ml-lg" unelevated rounded color="red" label="" /> -->
                </div>
              </div>

              <div class="q-pt-lg q-pb-lg">
                <h2 class="">Open Source</h2>
                <p>
                  <b>This project grew out of a vision for a newer kind of bookmarking system.</b> <a target="_blank" href="https://github.com/joelewis/readmelater#readme">The manifesto and the source code is published in github publicly.</a> Take a look if you want to contribute or need to host the service on your own servers.</a>
                </p>
              </div>
          </div>
          <div class="col-lg-3 col-md-3 col-sm-1">
          </div>
        </div>

        <div class="row bg-red-1 q-pa-sm q-mt-xl">
          <div class="col-lg-2 col-md-2 col-sm-1">
            
          </div>
          <div class="col">
            <div class="text-center text-caption q-mb-0">In loving memory of my closest friend <a href="https://github.com/karthikricssion">Karthik</a> who wrote some of the code | <a href="https://twitter.com/vettijoe">Maker</a> | <a href="https://github.com/joelewis/readmelater">Source code</a> | Crafted with ❤️ from Madras </div>
          </div>

          <div class="col-lg-2 col-md-2 col-sm-1">
            
          </div>
        </div>

        </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>

export default {

  components: {

  },

  data () {
    return {
      leftDrawerOpen: false,
      willPay: false,
      showThankyou: false

    }
  },

  watch: {
    willPay: function(newVal) {
      if (newVal) {
        this.sendVote();
        var self = this;
        setTimeout(() => {
          self.showThankyou = true;
        }, 500)
      }
    }
  },

  methods: {
    loginWith(service) {
      window.location.href = '/auth/' + service
    },

    sendVote() {
      fetch('/vote')
    }
  }
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .8s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
