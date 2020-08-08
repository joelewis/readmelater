import Inbox from './components/Inbox.vue';
import Faq from './components/Faq.vue';
import Settings from './components/Settings.vue';
import Tags from './components/Tags.vue';
import AccountSettings from './components/AccountSettings.vue';
import Terms from './components/Terms.vue';
import Privacy from './components/Privacy.vue';
import About from './components/About.vue';

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

export default routes