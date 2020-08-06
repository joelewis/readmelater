<template>
  <div class="q-pa-md">
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
            <span v-for="tag in link.tags" style="margin-right:3px;"><a href="#" style="text-decoration:none;">#{{tag}}</a></span>
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