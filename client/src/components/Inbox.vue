<template>
  <div class="q-pa-md">
    <q-list bordered padding>
        <q-item>
        <q-item-section side>
            <!-- <span class="text-uppercase">All Links</span> -->
        </q-item-section>
        <q-item-section side>
            <q-btn disabled class="q-pa-xs" color="primary" outline dense size="sm" label="Mark as Read"></q-btn>
        </q-item-section>
        <q-item-section side>
            <q-btn disabled class="q-pa-xs" color="red" outline dense size="sm" label="Delete"></q-btn>
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
            <span v-for="tag in link.tags" style="margin-right:3px;"><a href="#" style="text-decoration:none;">#{{tag}}</a></span>
          </q-item-label>
        </q-item-section>
      </q-item>

      
    </q-list>
  </div>
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
            ]
        }
    }
}
</script>

<style>
    a{
        color:brown;
    }
</style>