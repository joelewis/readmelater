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
            <q-chip style="color:rgba(0, 0, 0, 0.54)" v-for="(tag, index) in link.tags" v-bind:key="index" clickable outline @click="onClick">
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
        showNewInput: false,
        newlink: {
            href: '',
            timeout: '2w',
            tags: []
        }
      }
    },

    methods: {
        isMultipleSelected(links) {
            return links.filter(l => l.isSelected).length > 0
        },

        isSingleSelected(links) {
            return links.filter(l => l.isSelected).length === 1
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

        onClick() {
          console.log('I am clicked!')
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