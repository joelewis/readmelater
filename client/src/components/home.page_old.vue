// <q-layout view="LHh Lpr lFf">
  //   <q-header class="bg-grey-1">
  //     <q-toolbar>
  //       <q-btn
  //         flat
  //         dense
  //         round
  //         @click="leftDrawerOpen = !leftDrawerOpen"
  //         aria-label="Menu"
  //         icon="fas fa-bars"
  //         class="text-red"
  //       />

  //       <q-toolbar-title>
  //         <img style="height:48px;" alt="Quasar logo" src="../assets/closetab.png">
  //       </q-toolbar-title>

  //       <div>
          
  //         <q-btn-dropdown
  //           color="deep-purple"
  //           label="Sign-in Using"
  //         >
  //           <div class="row no-wrap q-pa-md">
  //               <q-btn type="a" href="/auth/google">Sign-in Using Google Account</q-btn>
  //           </div>
  //           <div class="row no-wrap q-pa-md">
  //               <q-btn type="a" href="/auth/google">Sign-in Using Twitter Account</q-btn>
  //           </div>
  //         </q-btn-dropdown>

  //       </div>
  //     </q-toolbar>
  //   </q-header>

  //   <q-drawer
  //     v-model="leftDrawerOpen"
  //     show-if-above
  //     bordered
  //     content-class="bg-grey-2"
  //   >
  //     <q-list>
  //       <q-item dark class="bg-red-9" href="https://quasar.dev">
  //         <q-item-section avatar>
  //           <q-icon name="fas fa-user-tie" />
  //         </q-item-section>
  //         <q-item-section>
  //           <q-item-label>Joe Lewis</q-item-label>
  //           <q-item-label caption>lewis.joe.18@gmail.com</q-item-label>
  //         </q-item-section>
  //         <q-item-section side>
  //           <div class="text-grey-8 q-gutter-xs">
  //             <q-btn size="12px" flat dense round dark class="text-white" />
  //           </div>
  //         </q-item-section>
  //       </q-item>
  //       <q-item class="text-dark" clickable tag="router-link" to="/inbox" :active="currentRoute==='inbox'" active-class="bg-red-1">
  //         <q-item-section avatar>
  //           <q-icon name="fas fa-inbox" />
  //         </q-item-section>
  //         <q-item-section>
  //           <q-item-label>Inbox</q-item-label>
  //           <q-item-label caption>All Links</q-item-label>
  //         </q-item-section>
  //       </q-item>
  //       <q-item clickable tag="router-link" to="/settings" :active="currentRoute==='settings'" active-class="bg-red-1 text-dark">
  //         <q-item-section avatar>
  //           <q-icon name="fas fa-cog" />
  //         </q-item-section>
  //         <q-item-section>
  //           <q-item-label>Settings</q-item-label>
  //           <q-item-label caption>Configure preferences</q-item-label>
  //         </q-item-section>
  //       </q-item>
  //       <q-item clickable tag="a" href="#" :active="currentRoute==='tags'" active-class="bg-red-1 text-dark">
  //         <q-item-section avatar>
  //           <q-icon name="fas fa-hashtag" />
  //         </q-item-section>
  //         <q-item-section>
  //           <q-item-label>Tags</q-item-label>
  //           <q-item-label caption>Manage Tags</q-item-label>
  //         </q-item-section>
  //       </q-item>
  //       <q-item clickable tag="a" href="#" :active="currentRoute==='faq'" active-class="bg-red-1 text-dark">
  //         <q-item-section avatar>
  //           <q-icon name="fas fa-question-circle" />
  //         </q-item-section>
  //         <q-item-section>
  //           <q-item-label>Faq</q-item-label>
  //           <q-item-label caption>Help Center</q-item-label>
  //         </q-item-section>
  //       </q-item>
  //       <q-item clickable tag="a" href="/logout">
  //         <q-item-section avatar>
  //           <i class="fas fa-sign-out-alt" />
  //         </q-item-section>
  //         <q-item-section>
  //           <q-item-label>Logout</q-item-label>
  //         </q-item-section>
  //       </q-item>
  //     </q-list>
  //   </q-drawer>

  //   <q-page-container>
  //     <router-view></router-view>
  //   </q-page-container>
  // </q-layout>