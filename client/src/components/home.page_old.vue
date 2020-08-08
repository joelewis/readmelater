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


  <div>
      <q-list bordered padding>
          <q-item>
          <q-item-section side>
              <!-- <span class="text-uppercase">All Links</span> -->
          </q-item-section>
          <q-item-section side>
              <q-btn :disabled="!isMultipleSelected(links)" class="q-pa-xs" color="dark" flat dense size="sm" icon="fas fa-check-double" label="Mark as Read"></q-btn>
          </q-item-section>
          <q-item-section side>
              <q-btn :disabled="!isMultipleSelected(links)" class="q-pa-xs" color="red" flat dense size="sm" icon="fas fa-trash" label="Delete"></q-btn>
          </q-item-section>

          <q-item-section side>
              <q-btn :disabled="!isSingleSelected(links)" class="q-pa-xs" color="" icon="fas fa-edit" flat outline dense size="sm" label="Edit"></q-btn>
          </q-item-section>

          <q-item-section side>
              <q-btn @click="showNewInput = true" class="q-pa-xs" color="primary" icon="fas fa-plus" unelevated flat dense size="sm" label="Add Link"></q-btn>
          </q-item-section>
        </q-item>
        <q-separator spaced />

        <q-item :key="link.id" v-for="link in links">
          <q-item-section side>
            <q-checkbox v-model="link.isSelected" />
          </q-item-section>

          <q-item-section side>
            <!-- <q-avatar rounded color="red" text-color="white">{{link.domain[0].toUpperCase()}}</q-avatar> -->
          </q-item-section>

          <q-item-section>
            <q-item-label><a :href="link.href">{{link.href}}</a></q-item-label>
            <q-item-label class="text-body2">
              <div>To be read within {{link.timeout}}</div>
              <span v-for="(tag, index) in link.tags" v-bind:key="index"  style="margin-right:3px;"><a href="#" style="text-decoration:none;">#{{tag}}</a></span>
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="links.length < 1">
          <q-item-section>
            <q-item-label>
                Add a <a href="#">new link</a>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <q-dialog v-model="showNewInput" persistent>
        <q-card style="min-width: 500px">
          <q-card-section>
            <div class="text-h6"></div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input v-model="newlink.href" filled type="url" label="https://" hint="Link to bookmark">
              <!-- <template v-slot:prepend>
                  <q-icon name="fas fa-plus" />
              </template> -->
            </q-input>

              <q-select class="q-mt-lg" v-model="newlink.timeout" :options="[1,2,3]" label="Time-out" hint="Time-out within which you'd like to read">
                  <!-- <template v-slot:prepend>
                      <q-icon name="fas fa-plus" />
                  </template> -->
              </q-select>

              <!-- <q-select
                  filled
                  v-model="newlink.tags"
                  use-input
                  use-chips
                  multiple
                  input-debounce="0"
                  @new-value="createValue"
                  :options="filterOptions"
                  @filter="filterFn"
                  style="width: 250px"
              /> -->

          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn flat label="Add Link" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

    </div>