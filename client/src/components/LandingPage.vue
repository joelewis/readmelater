<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="dark bg-grey-1">
      <q-toolbar>
        <q-toolbar-title class="text-red-8" style="font-size:40px;">
          <span >Close</span><b><span class="text-dark">Tabs</span></b><small class="" style="font-size:20px;">.email</small>
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
        <div class="row q-pt-lg" >
            <div class="col-2"></div>
            <div class="col">
            <h3 style="
                margin-bottom: 0px;
                font-weight: bold;
            "> Bookmark &amp; close the tabs in your browser.</h3><h5 style="
                margin-top: 8px !important;
            ">We'll remember them for you &amp; nudge you to read it later.</h5>
            </div>
            <div class="col-2"></div>
        </div>

        <div class="row">
            <div class="col-2"></div>
            <div class="col">
                <q-btn unelevated rounded color="dark" label="Install Browser Extension" />
                <q-btn class="q-ml-lg" unelevated rounded color="red" label="Sign-in Using Google" />
                <q-btn class="q-ml-lg" unelevated rounded color="light-blue-14" label="Sign-in Using Twitter" />
            </div>
            <div class="col-2"></div>
        </div>

        <div class="row q-mt-lg">
            <div class="col-2"></div>
            <div class="col">
                <h5>
                    Are you not able to close those dozens of tabs in your browser, because you are afraid you might forget them forever?
                    Maybe it's a really long article or a group of related tabs from your recent research – now you can just tag them, set a timeout and we'll make sure you finish consuming those tabs before the timeout you've set.
                </h5>
            </div>
            <div class="col-2"></div>
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
