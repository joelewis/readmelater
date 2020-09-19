<template>
  <q-page style="padding-top: 56px">
    <q-list class="bookmarks-list">
      <q-item :key="link.id" v-for="link in links" v-bind:class="{'selected': link.isSelected }">
        <q-item-section side>
          <q-checkbox v-model="link.isSelected" />
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1"><a :href="link.href">{{link.href}}</a></q-item-label>
          <q-item-label caption lines="2">To be read within {{link.timeout}}</q-item-label>

          <q-item-label caption>
            <q-chip style="color:rgba(0, 0, 0, 0.54)" v-for="(tag, index) in link.tags" v-bind:key="index" clickable outline>
              #{{tag}}
            </q-chip>
          </q-item-label>          
        </q-item-section>

        <q-item-section side top class="bookmarked-time">
          1 min ago
        </q-item-section>

        <q-item-section top side class="bookmark-action">
          <div class="text-grey-8 q-gutter-xs">
            <q-btn padding="8px" style="color:#5f6368" flat dense round icon="delete">
              <q-tooltip>
                Delete
              </q-tooltip>
            </q-btn>
            <q-btn padding="8px" style="color:#5f6368" flat dense round icon="done">
              <q-tooltip>
                Mark as read
              </q-tooltip>
            </q-btn>
            <q-btn padding="8px" style="color:#5f6368" flat dense round icon="more_vert" @click="showNewInput = !showNewInput">
              <q-tooltip>
                More
              </q-tooltip>
            </q-btn>
          </div>
        </q-item-section>

      </q-item>
    </q-list>

    <q-page-sticky expand position="top">
      <q-toolbar class="bg-white text-black">          
        <q-toolbar-title>

          <q-btn 
            flat 
            round 
            dense 
            style="color:#5f6368"
            padding="8px"
            :icon="checkAndSetSelectStatus(links)"
            @click="changeCommonSelectAction(links)"
            >
            <q-tooltip>
              Select
            </q-tooltip>
          </q-btn>

          <q-btn 
            flat 
            round 
            dense 
            style="color:#5f6368"
            padding="8px"
            icon="refresh" 
            v-if="!isMultipleSelected(links)"
            >
            <q-tooltip>
              Refresh
            </q-tooltip>
          </q-btn>

          <q-btn 
            flat 
            round 
            dense 
            style="color:#5f6368"
            padding="8px"
            icon="done_all" 
            v-if="isMultipleSelected(links)"
            >
            <q-tooltip>
              Mark as read
            </q-tooltip>
          </q-btn>

          <q-btn 
            flat 
            round 
            dense 
            style="color:#5f6368"
            padding="8px"
            icon="delete" 
            v-if="isMultipleSelected(links)"
            >
            <q-tooltip>
              Delete
            </q-tooltip>
          </q-btn>

          <!-- 
            icons: 
            done, done_all, delete , mark_email_read, mark_email_unread, 
            markunread, create, check_box, check_box_outline_blank, indeterminate_check_box
          -->
        </q-toolbar-title>
      </q-toolbar>
    </q-page-sticky>
    
    <q-dialog v-model="showNewInput" persistent>


        <q-card style="min-width: 500px">

          <q-card-section class="q-pt-none">
            <div class="text-h6 q-pa-md"> Add a new link </div>

            <q-input 
              class="q-pa-md"
              v-model="newlink.href" 
              filled 
              type="url" 
              label="https://" 
              autofocus
              >
              <!-- <template v-slot:prepend>
                  <q-icon name="fas fa-plus" />
              </template> -->
            </q-input>

            <q-select 
              class="q-mt-lg q-pa-md"
              v-model="newlink.timeout" 
              :options="timeoutOptions"
              option-value="id"
              option-label="desc" 
              label="I want to read this within">
            </q-select>


            <q-select
                class="q-mt-lg q-pa-md"
                filled
                label="Tags"
                v-model="newlink.tags"
                use-input
                use-chips
                multiple
                input-debounce=0
                @new-value="createValue"
                :options="newlink.alltags"
                @filter="filterFn"
              />

          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup @click="goback" />
            <q-btn flat label="Add Link" @click="addLink"/>
          </q-card-actions>
        </q-card>
      </q-dialog>

  </q-page>
</template>

<script>
export default {
  data () {
    return {
        commonSelectStatus: 'check_box_outline_blank',
        links: [
            {
                id: 1,
                href: 'https://google.com',
                timeout: '2 days',
                tags: ['google', 'search'],
                domain: 'google.com',
                isSelected: false
            },
            {
                id: 2,
                href: 'https://closetab.email',
                timeout: '2 weeks',
                tags: [],
                domain: 'closetab.com',
                isSelected: false
            },
            {
                id: 3,
                href: 'https://google.com',
                timeout: '2 days',
                tags: ['google', 'search'],
                domain: 'google.com',
                isSelected: false
            },
            {
                id: 4,
                href: 'https://closetab.email',
                timeout: '2 weeks',
                tags: [],
                domain: 'closetab.com',
                isSelected: false
            },
            {
                id: 5,
                href: 'https://google.com',
                timeout: '2 days',
                tags: ['google', 'search'],
                domain: 'google.com',
                isSelected: false
            },
            {
                id: 6,
                href: 'https://closetab.email',
                timeout: '2 weeks',
                tags: [],
                domain: 'closetab.com',
                isSelected: false
            }
            
        ],
        showNewInput: this.$route.meta.openEditor || false,
        newlink: {
            href: '',
            timeout: {
              id: '2w',
              desc: '2 Weeks'
            },
            tags: [],
            alltags: ["google", "search"]
        },
        timeoutOptions: [
          {
            desc: '2 Days',
            id: '2d',
          },
          {
            desc: '2 Weeks',
            id: '2w',
          }, {
            desc: '2 Months',
            id: '2m'
          }
        ],
        alltags: ["google", "search"]
      }
    },

    methods: {
        isMultipleSelected(links) {
            return links.filter(l => l.isSelected).length > 0
        },

        /*
          Checkbox state
          Mark all - check_box
          multiple Select - indeterminate_check_box
          not select - check_box_outline_blank
        */

        checkAndSetSelectStatus(links) {
          if(links.filter(l => l.isSelected).length === links.length) {
            this.commonSelectStatus = 'check_box';
            return 'check_box'
          } else if(links.filter(l => l.isSelected).length > 0) {
            this.commonSelectStatus = 'indeterminate_check_box';
            return 'indeterminate_check_box'
          } else {
            this.commonSelectStatus = 'check_box_outline_blank';
            return 'check_box_outline_blank'
          }
        },

        changeCommonSelectAction() {
          if(this.commonSelectStatus === 'check_box_outline_blank') {
            this.links.map(l => l.isSelected = true)
          } else {
            this.links.map(l => l.isSelected = false)
          }
        },

        addLink() {
          // console.log('I am clicked!')
          console.log(this.newlink);
        },

        goback() {
          this.$router.push({name: 'home'});
        },
        createValue (val, done) {
          // Calling done(var) when new-value-mode is not set or "add", or done(var, "add") adds "var" content to the model
          // and it resets the input textbox to empty string
          // ----
          // Calling done(var) when new-value-mode is "add-unique", or done(var, "add-unique") adds "var" content to the model
          // only if is not already set
          // and it resets the input textbox to empty string
          // ----
          // Calling done(var) when new-value-mode is "toggle", or done(var, "toggle") toggles the model with "var" content
          // (adds to model if not already in the model, removes from model if already has it)
          // and it resets the input textbox to empty string
          // ----
          // If "var" content is undefined/null, then it doesn't tampers with the model
          // and only resets the input textbox to empty string

          if (val.length > 0) {
            if (!this.alltags.includes(val)) {
              this.alltags.push(val)
            }
            done(val)
          }
        },

        filterFn (val, update) {
          var self = this;
          update(() => {
            console.log(val);
            if (val === '') {
              self.newlink.alltags = self.alltags
            }
            else {
              const needle = val.toLowerCase()
              self.newlink.alltags = self.alltags.filter(t => t.startsWith(val))
              console.log(self.newlink.alltags)
            }
          })
        }
    } 
}
</script>

<style lang="sass">
.bookmarks-list
  .q-item 
    
    box-shadow: inset 0 -1px 0 0 rgba(100,121,143,0.122)

    &.selected
      background-color: #c2dbfb

    .bookmarked-time
      display: block
      font-size: 14px

    .bookmark-action
      display: none

    &:hover
      box-shadow: inset 1px 0 0 #dadce0, inset -1px 0 0 #dadce0, 0 1px 2px 0 rgba(60, 64, 67, .3), 0 1px 3px 1px rgba(60, 64, 67, .15)
      z-index: 10

      .bookmark-action
        display: block
      
      .bookmarked-time
        display: none
  
</style>