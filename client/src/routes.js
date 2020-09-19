import Inbox from './components/Inbox.vue';
import Faq from './components/Faq.vue';
import Settings from './components/Settings.vue';
import Tags from './components/Tags.vue';
import AccountSettings from './components/AccountSettings.vue';
import Terms from './components/Terms.vue';
import Privacy from './components/Privacy.vue';
import About from './components/About.vue';

import VueRouter from 'vue-router'
import store from './store'

var ensureAuth = (from, to, next) => {
    if (store.getters.isLoggedIn) {
        next()
    } else {
        console.log('redirecting to home')
        next({name: 'home'})
    }
}

let routes = [
    {
        path: '/',
        // redirect: '/inbox'
        name: 'home',
        beforeEnter: (from, to, next) => {
            if (store.getters.isLoggedIn) {
                console.log('redirecting to inbox')
                next({name: 'inbox'})
            }
        }
    },
    {
        path: '/inbox',
        name: 'inbox',
        component: Inbox,
        beforeEnter: ensureAuth
    },
    {
        path: '/inbox/new',
        name: 'addlink',
        component: Inbox,
        meta: {
            openEditor: true
        }
    },
    {
        path: '/settings',
        name: 'settings',
        component: Settings
    },
    {
        path: '/tags',
        name: 'tags',
        component: Tags
    },
    {
        path: '/faq',
        name: 'faq',
        component: Faq
    },
    {
        path: '/account-settings',
        name: 'accountSettings',
        component: AccountSettings
    },
    {
        path: '/terms',
        name: 'terms',
        component: Terms
    },
    {
        path: '/privacy',
        name: 'privacy',
        component: Privacy
    },
    {
        path: '/about',
        name: 'about',
        component: About
    },
];

const router = new VueRouter({
    mode: 'history',
    routes: routes // short for `routes: routes`
})

export default router