<template>
  <q-page padding style="padding-top: 66px">
    
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



    <q-page-sticky expand position="top">
      <q-toolbar class="bg-white text-black">          
        <q-toolbar-title>
          
        </q-toolbar-title>
      </q-toolbar>
    </q-page-sticky>
  </q-page>
</template>

<script>
export default {
    data () {
        return {
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
    }
}
</script>

<style>
    a{
        color:brown;
    }
</style>