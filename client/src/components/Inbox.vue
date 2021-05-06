<template>
  <q-page>
    <div class="text-center" v-if="!links.length"><h4> Welcome! You haven't saved any links yet. <br><router-link to="/inbox/new">Start by adding new links.</router-link></h4></div>
    <q-list v-if="links.length" class="bookmarks-list bg-white">
      <q-toolbar class="bg-white text-black">          
        <q-toolbar-title class="col-3 col-sm-3 col-md-3 col-xs-6">

          <q-btn 
            no-caps
            flat 
            round 
            dense 
            style="color:#5f6368"
            padding="8px"
            size="sm"
            :icon="checkAndSetSelectStatus(links)"
            @click="changeCommonSelectAction(links)"
            >
            <q-tooltip>
              Select
            </q-tooltip>
          </q-btn>

          <q-btn 
            no-caps
            outline
            flat 
            dense 
            style="color:#5f6368"
            padding="8px"
            icon="done_all" 
            :disable="!isMultipleSelected(links)"
            label="Mark link as read"
            color="primary"
            @click="readSelectedLinks"
            >
            <q-tooltip>
              Mark as read
            </q-tooltip>
          </q-btn>

          <q-btn 
            no-caps
            flat 
            bordered
            dense 
            style="color:#5f6368"
            padding="8px"
            icon="delete" 
            label="Delete Link"
            color="negative"
            :disable="!isMultipleSelected(links)"
            @click="deleteSelectedLinks"
            >
            <q-tooltip>
              Delete
            </q-tooltip>
          </q-btn>
        </q-toolbar-title>

        <q-select
          ref="tagFilterElement"
          dense
          class="tagselector q-pa-sm col-3"
          filled
          label="Filter by tags"
          v-model="filterTags"
          use-input
          use-chips
          multiple
          input-debounce=0
          :options="tagOptions"
          @filter="filterFn"
          @input="onTagsFilterInput"
        >
          <template v-slot:append>
            <q-icon
              v-if="filterTags.length"
              class="cursor-pointer"
              name="clear"
              @click.stop="clearFilterTags"
            />
          </template>
        </q-select>
      </q-toolbar>

      <q-item :id="link.id" clickable @click="link.isSelected = !link.isSelected" :key="link.id" v-for="link in links" v-bind:class="{'selected': link.isSelected }">
        <q-item-section side>
          <q-checkbox size="xs" color="red" v-model="link.isSelected" />
        </q-item-section>

        <q-item-section>
          <q-item-label lines="2"><a class="text-indigo link-href" v-on:click.stop target="_blank" :href="link.href">{{link.href}}</a></q-item-label>
          <q-item-label style="font-size:0.8em;">
            <q-icon @click.stop="setNotifyStatus([link.id], !link.notify)" :color="!link.notify? 'primary':'grey'" size="xs" outline name="done_all">
              <q-tooltip>
                Marked as read
              </q-tooltip>
            </q-icon>
            {{link.notify? getRemainingTimeLeft(link.timeout) : "Link marked as read"}}
          </q-item-label>
          <q-item-label>
            <q-chip @click.stop="addToFilter(tag)" dense color="indigo-1" v-for="(tag, index) in link.tags" v-bind:key="index" clickable>
              #{{tag.tag}}
            </q-chip>
          </q-item-label>
        </q-item-section>

        <q-item-section side top class="bookmarked-time">
          <div> {{ getBookmarkedDate(link.createdAt) }} </div>
          <div class="q-gutter-xs bookmark-action">
            <q-btn @click.stop="setNotifyStatus([link.id], false)" color="primary" size="sm" outline round icon="done_all">
              <q-tooltip>
                Mark as read
              </q-tooltip>
            </q-btn>
            <q-btn @click.stop="openEditDialog(link)" color="teal" size="sm" outline round icon="edit">
              <q-tooltip>
                Edit
              </q-tooltip>
            </q-btn>
            <q-btn @click.stop="deleteLinks([link.id])" color="negative" size="sm" outline round icon="delete">
              <q-tooltip>
                Delete
              </q-tooltip>
            </q-btn>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
    
    <q-dialog v-model="showNewInput" persistent>
        <q-card style="min-width: 500px" class="bg-blue-grey-1">
          <q-card-section class="q-pt-none">
            <div class="text-h6 q-pa-md">  </div>

            <q-input 
              class="q-pa-sm"
              v-model="newlink.href" 
              filled 
              type="url" 
              label="https://" 
              autofocus
              dense
              placeholder="https://example.com/"
              >
              <!-- <template v-slot:prepend>
                  <q-icon name="fas fa-plus" />
              </template> -->
            </q-input>

            <q-select 
              dense
              class="q-pa-md"
              v-model="newlink.timeout" 
              :options="timeoutOptions"
              option-value="id"
              option-label="desc" 
              label="I want to read this within">
            </q-select>


            <q-select
                ref="tagsearchElement"
                dense
                class="tagselector q-pa-sm"
                filled
                label="Tags (Enter comma separated tags and press Enter)"
                v-model="newlink.tags"
                use-input
                use-chips
                multiple
                input-debounce=0
                @new-value="createValue"
                :options="tagOptions"
                @filter="filterFn"
                @input="onTagsInput"
              />

          </q-card-section>
          <q-separator />

          <q-card-actions align="right" class="q-pa-lg">
            <q-btn no-caps class="q-pr-md" unelevated size="md" dense color="primary" icon="done" label="Save Link" @click="addLink"/>
            <q-btn flat no-caps dense size="md" color="primary" icon="close" label="Cancel" v-close-popup @click="goback" />
          </q-card-actions>
        </q-card>
      </q-dialog>

  </q-page>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  data () {
    return {
        commonSelectStatus: 'check_box_outline_blank',
        // links: [],
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
        tagOptions: [],
      }
    },

    created: async function() {
      try {
        await this.$store.dispatch('fetchLinks')
        await this.$store.dispatch('fetchTags')
        if (this.$route.query.filter) {
          var filter = JSON.parse(window.decodeURIComponent(this.$route.query.filter))
          this.$store.commit('setFilter', filter);
        }
        this.tagOptions = this.$store.state.tags.map(t => t.tag);
        // await this.$store.dispatch('fetchTags')
      } catch (e) {
      }
    },

    computed: {
      ...mapGetters(['links']),
      ...mapState(['tags']),
      filterTags: {
        get () {
          return this.$store.state.filter.tags
        },
        set (value) {
          var filter = this.$store.state.filter;
          filter.tags = value
          this.$store.commit('setFilter', filter);
        }
      }
    },

    watch: {
      filterTags(oldval, newval) {
        this.$store.dispatch('fetchLinks')
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

        getRemainingTimeLeft(datestring) {
          var date = new Date(datestring);
          var today = new Date();
          var days = Math.round((date-today)/(24 * 60 * 60 * 1000))
          if (days > 0) {
            return days + " day(s) remaining to complete";
          } else {
            return "Must have been completed reading by " + days + " day(s)";
          }
        },

        getBookmarkedDate(datestring) {
          var date = new Date(datestring);
          var today = new Date();
          var days = Math.round((today-date)/(24 * 60 * 60 * 1000));
          const rtf = new Intl.RelativeTimeFormat("en", {
              localeMatcher: "best fit", // other values: "lookup"
              numeric: "always", // other values: "auto"
              style: "long", // other values: "short" or "narrow"
          });
          return "Added " + rtf.format(-days, "days");
        },

        openEditDialog(link) {
          this.newlink.href=  link.href;
          this.newlink.tags = link.tags.map(t => t.tag) || [];
          this.showNewInput = true;
        },

        addLink() {
          var linkParams = {
            href: this.newlink.href,
            timeout: this.newlink.timeout.id,
            tags: this.newlink.tags
          }
          this.$store.dispatch('addLink', linkParams);
          this.showNewInput = false;
        },

        deleteLinks(links) {
          this.$store.dispatch('deleteLinks', links);
        },

        deleteSelectedLinks() {
          var selectedLinks = this.links.filter(l => l.isSelected).map(l => l.id);
          this.deleteLinks(selectedLinks);
        },

        readSelectedLinks() {
          var selectedLinks = this.links.filter(l => l.isSelected).map(l => l.id);
          this.setNotifyStatus(selectedLinks, false);
        },

        setNotifyStatus(links, status) {
          this.$store.dispatch('setNotifyStatus', {links, status});
        },

        onTagsInput() {
          var self = this;
          this.$refs.tagsearchElement.updateInputValue("");
          setTimeout(()=> {
            self.$refs.tagsearchElement.hidePopup();
          }, 0)
        },

        onTagsFilterInput() {
          var self = this;
          this.$refs.tagFilterElement.updateInputValue("");
          setTimeout(()=> {
            self.$refs.tagFilterElement.hidePopup();
          }, 0)
        },

        addToFilter(tag) {
          if (this.filterTags.includes(tag.tag)) {
            return;            
          }
          this.filterTags.push(tag.tag);
        },

        clearFilterTags() {
          var self = this;
          this.filterTags = [];
          setTimeout(()=> {
            self.$refs.tagFilterElement.hidePopup();
          }, 0)
        },

        goback() {
          this.$router.currentRoute.name != 'inbox' && this.$router.push({name: 'inbox'});
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

          // strip away initial '#' char if user type with hash

          var self = this;
          if (val.length > 0) {
            const model = (this.newlink.tags || []).slice()
            val
              .split(/[,\s]+/)
              .map(v => v.trim())
              .filter(v => v.length > 0)
              .map(v => v.startsWith('#') ? v.substring(1): v)
              .forEach(v => {
                if (self.tagOptions.includes(v) === false) {
                  self.tagOptions.push(v);
                }
                if (model.includes(v) === false) {
                  model.push(v);
                }
              })

            done(null)
            this.newlink.tags = model;
            this.onTagsInput();
          }
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

<style lang="sass">
.bookmarks-list
  .q-item

    &.selected
      background-color: #ffebee

    .bookmarked-time
      display: block
      font-size: 14px

    .bookmark-action
      visibility: hidden

    &:hover
    
      .bookmark-action
        visibility: visible


.tagselector
  .q-chip
    background-color: #e8eaf6;


.link-href
  word-break: break-all
</style>