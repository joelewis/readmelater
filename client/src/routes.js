import HomePage from './components/HomePage.vue'
import Inbox from './components/Inbox.vue'
import Faq from './components/Faq.vue'
import Settings from './components/Settings.vue'

let routes = [
    {
        path: '/',
        redirect: '/inbox'
    },
    {
        path: '/inbox',
        name: 'inbox',
        component: Inbox
    },
    {
        path: '/settings',
        name: 'settings',
        component: Settings
    }
];

export default routes