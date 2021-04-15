<template>
  <q-page>
    <div class="text-center" v-if="!links.length"><h4> You haven't tagged any links yet. <br><router-link to="/inbox/new">Start by adding new links.</router-link></h4></div>
    <q-list v-if="links.length" class="bookmarks-list bg-white">
      <q-toolbar class="bg-white text-black">          
        <q-toolbar-title>

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
            label="Mark all link in this tag as read"
            color="primary"
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
            label="Delete all links in this tag"
            color="negative"
            :disable="!isMultipleSelected(links)"
            >
            <q-tooltip>
              Delete
            </q-tooltip>
          </q-btn>
        </q-toolbar-title>
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
            <q-chip dense color="indigo-1" v-for="(tag, index) in link.tags" v-bind:key="index" clickable>
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
            <q-btn @click.stop="deleteLink(link.id)" color="negative" size="sm" outline round icon="delete">
              <q-tooltip>
                Delete
              </q-tooltip>
            </q-btn>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>
<script>
export default {
  data: () => {
    return {links: []}
  }
}
</script>
