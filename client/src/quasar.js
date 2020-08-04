import Vue from 'vue'

import './styles/quasar.scss'
// import iconSet from 'quasar/icon-set/material-icons-round.js'
import iconSet from 'quasar/icon-set/fontawesome-v5.js'
// import '@quasar/extras/material-icons-round/material-icons-round.css'
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'
import { Quasar } from 'quasar'

Vue.use(Quasar, {
  config: {},
  components: { /* not needed if importStrategy is not 'manual' */ },
  directives: { /* not needed if importStrategy is not 'manual' */ },
  plugins: {
  },
  iconSet: iconSet,
  extras: [
    'material-icons',
    'material-icons-outlined',
    'material-icons-round',
    'material-icons-sharp',
    'mdi-v3',
    'fontawesome-v5',
  ]
 })