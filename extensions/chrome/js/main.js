
const ICON_IMG_URL = {
    BOOKMARKED: 'img/closetab-bookmarked.png',
    NOT_BOOKMARKED: 'img/closetab-not-bookmarked.png',
    UNAUTHORIZED: 'img/closetab-logo.png',
}

var updateBrowserIcon = function(type, tabId) {
    console.log(type, tabId);
    browser.browserAction.setIcon({
        path: ICON_IMG_URL[type],
        tabId: tabId
    });
}

function BookmarkObj() {
    return {
        href: '',
        timeout: '2w',
        tags: []
    }
}

Vue.component('top-bar', {
    template: `
        <nav>
            <img src="/img/closeTab.svg" class="img-responsive" /> <b>CloseTab</b>
        </nav>
    `
})

var app = new Vue({
    el: '#app',

    data: {
        isLoggedIn: false,
        chromeRunTimeId: browser.runtime.id,
        extensionURL: browser.extension.getURL("/"),
        tag: '',
        tags: [],
        bookmark: { href: '', timeout: '2w', tags: [] },
        tagOptions: [],
        isLoading: false,
        domainUrl: getDomainUrl(),
        currentPageBookmarked: false,
        isExistingBookmark: false,
        tabId: '',
        jwt: ''
    },

    computed: {
        filteredTags() {
            return this.tagOptions.filter(i => {
                return i.text.toLowerCase().indexOf(this.tag.toLowerCase()) !== -1;
            });
        }
    },

    beforeCreate: function() {
        var self = this;
        browser.tabs.query({ active: true, currentWindow: true }).then(function(tabs) {
            self.tabId = tabs[0].id;
            browser.storage.local.get('jwt').then(function(data) {
                if (data.jwt) {
                    self.isLoggedIn = true;
                    self.jwt = data.jwt;
                } else {
                    self.isLoggedIn = false;
                    updateBrowserIcon('UNAUTHORIZED', self.tabId)
                }
            });
        });

    },

    mounted() {
        var self = this;
        // Check whether user has logged in or not
        if (!this.isLoggedIn) {
            // do nothing
            return;
        }
    },

    watch: {
        isLoggedIn(val, oldval) {
            if (val === true) {
                this.initBookmark();
            }
        }
    },

    methods: {
        signOut: function() {
            // Removing the token from chrome local
            // store and showing the loggin screen
            browser.storage.local.remove('jwt');
            this.isLoggedIn = false
        },

        updateBookmarkTags: function(tags) {
            var tags = tags.map(tag => {
                return tag.text.split(/[,\s]+/)
                    .map(v => v.trim())
                    .filter(v => v.length > 0)
                    .map(v => v.startsWith('#') ? v.substring(1) : v)
            }).flat();

            this.tags = Array.from(new Set(tags));

            this.bookmark.tags = this.tags;

            this.updateBookmark()
        },

        updateBookmark: function() {
            var self = this;
            self.saveBookmark(self.jwt, self.bookmark.href); // same url
        },

        getTags: function(jwt) {
            var self = this;
            self.stopLoading();
            makeReq(this.domainUrl + '/tags', { 'Authorization': 'Bearer ' + jwt }, 'GET').then(resp => {
                self.isLoading = false;
                return resp.json()
            }).then(resp => {
                self.tagOptions = resp.map(t => {
                    return { text: t.tag }
                });
            })
        },

        saveBookmark: function(jwt, url) {
            var self = this
            self.isLoading = true
            self.bookmark.href = url;
            postJSON(this.domainUrl + '/bookmark', self.bookmark, { 'Authorization': 'Bearer ' + jwt }).then(function(r) {
                self.stopLoading();
                if (r.status === 200) {
                    // show bookmark success
                    r.json().then(json => {
                        self.isLoggedIn = true
                        self.currentPageBookmarked = true;
                        self.bookmark.timeout_date = json.timeout;
                        console.log('updating icon to bookmarked for tab: ' + self.tabId);
                        updateBrowserIcon('BOOKMARKED', self.tabId)
                    })
                } else if (r.statue === 401) {
                    // show logged out ui
                    self.isLoggedIn = false
                    updateBrowserIcon('UNAUTHORIZED', self.tabId)
                } else {
                    updateBrowserIcon('NOT_BOOKMARKED', self.tabId)
                }

            })
        },


        undoBookmark: function() {
            console.log('undoing bookmark')
            var self = this;
            self.isLoading = true;
            makeReq(browser.runtime.getManifest().domainUrl + `/bookmark`, { 'Authorization': 'Bearer ' + self.jwt }, 'DELETE', {links: [self.bookmark.id]}).then(function() {
                updateBrowserIcon('NOT_BOOKMARKED', self.tabId)
                self.isLoading = false;
                window.close();
            })
        },

        initBookmark: function() {
            var self = this;
            browser.tabs.get(this.tabId).then(function(tab) {
                self.bookmark.href = tab.url
                self.tabId = tab.id;
                self.getOrSaveBookmark(self.jwt, tab.url)
            })
        },

        getOrSaveBookmark: function(jwt, url) {
            var self = this;
            this.isLoading = true;
            makeReq(browser.runtime.getManifest().domainUrl + `/is/bookmarked?href=${encodeURIComponent(url)}`, { 'Authorization': 'Bearer ' + jwt }, 'GET').then(r => {
                this.isLoading = false;
                if (r.status === 200) {
                    // bookmark already exists, just update client data with server data
                    r.json().then(bookmark => {
                        bookmark.timeout_date = bookmark.timeout;
                        bookmark.timeout = '2w'
                        bookmark.tags = bookmark.tags.map(t => t.tag);
                        self.bookmark = bookmark;
                        self.tags = bookmark.tags;
                        self.currentPageBookmarked = true;
                        self.isExistingBookmark = true;
                        self.bookmark.id = bookmark.id;
                    });
                    updateBrowserIcon('BOOKMARKED', self.tabId)
                } else if (r.status === 401) {
                    // unauthorized, just show logged out ui
                    this.isLoggedIn = false;
                    updateBrowserIcon('UNAUTHORIZED', self.tabId)
                } else {
                    // not yet bookmarked
                    this.isLoggedIn = true;
                    self.saveBookmark(jwt, url);
                    updateBrowserIcon('NOT_BOOKMARKED', self.tabId)
                }
            })
        },

        getRemainingTime: function(datestring) {
            var date = new Date(datestring);
            var today = new Date();
            var days = Math.round((date - today) / (24 * 60 * 60 * 1000))
            if (days > 0) {
                return days + " day(s) remaining to complete";
            } else {
                return "Must have been completed reading by " + days + " day(s)";
            }
        },

        stopLoading: function() {
            var self = this;
            setTimeout(() => {
                self.isLoading = false;
            }, 300)
        },

        getTimeoutText: function(timeout) {
            var number = timeout[0];
            var dimension = timeout[1];

            if (dimension === 'd') {
                return number + ' ' + (number > 1 ? 'Days' : 'Day')
            } else if (dimension === 'w') {
                return number + ' ' + (number > 1 ? 'Weeks' : 'Week')
            } else if (dimension === 'm') {
                return number + ' ' + (number > 1 ? 'Months' : 'Month')
            }
        },

        viewAllLinks: function() {
            window.open(this.domainUrl + '/inbox');
        }
    }
})