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
                <q-btn unelevated rounded color="dark" label="Install Browser Extension" />
                <q-btn class="q-ml-lg" unelevated rounded color="red" label="Sign-in Using Google" />
                <q-btn class="q-ml-lg" unelevated rounded color="light-blue-14" label="Sign-in Using Twitter" />
              </div>

              <div class="q-pt-lg">
                <p>
                    Are you not able to close those dozens of tabs in your browser, because you are afraid you might forget them forever?
                    Maybe it's a really long article or a group of related tabs from your recent research – now you can just <u>#tag</u> them, <u>set a time out</u> and we'll make sure you finish consuming those tabs <u>in time</u>.
                </p>
              </div>

              <div class="q-pt-lg">
                <h2 class="text-red-9"> Smarter Bookmarking </h2>
                <p>
                  Most people bookmark links for coming back later. But most of us lack the disclipline to actually come back.
                <!-- </p>
                <p> -->
                  That is why people have several tabs open even though they work actively only on a few tabs.
                <!-- </p>
                <p> -->
                  CloseTab solves this problem by being a little smarter to remind you to come back, while also gently keeping track of your reading list.
                </p>
              </div>

              <div class="q-pt-lg">
                <h2 class=""> Weekly Emails</h2>
                <p>
                  Most people bookmark links for coming back later. But most of us lack the disclipline to actually come back.
                <!-- </p>
                <p> -->
                  That is why people have several tabs open even though they work actively only on a few tabs.
                <!-- </p>
                <p> -->
                  CloseTab solves this problem by being a little smarter to remind you to come back, while also gently keeping track of your reading list.
                </p>
              </div>

              <div class="q-pt-lg">
                <h2 class="text-red-9">Time Outs &amp; Tags</h2>
                <p>
                  Most people bookmark links for coming back later. But most of us lack the disclipline to actually come back.
                <!-- </p>
                <p> -->
                  That is why people have several tabs open even though they work actively only on a few tabs.
                <!-- </p>
                <p> -->
                  CloseTab solves this problem by being a little smarter to remind you to come back, while also gently keeping track of your reading list.
                </p>
              </div>

          </div>
          <div class="col-lg-3 col-md-3 col-sm-1"></div>
        </div>
        </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import HelloWorld from './HelloWorld.vue'

export default {

  components: {
    HelloWorld
  },

  data () {
    return {
      leftDrawerOpen: false
    }
  }
}
</script>

<style>
</style>
