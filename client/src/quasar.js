import Vue from 'vue'

import './styles/quasar.scss'
import { Quasar } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'

Vue.use(Quasar, {
  config: {},
  
  components: { 
  },

  directives: {
  },

  plugins: {
  },

  extras: [
    'material-icons',
    'material-icons-outlined',
    'material-icons-round',
    'material-icons-sharp',
    'mdi-v3',
    'ionicons-v4',
    'eva-icons',
    'fontawesome-v5',
    'themify',
    'line-awesome'
  ]
})