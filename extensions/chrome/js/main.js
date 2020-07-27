const ICON_IMG_URL = {
    BOOKMARKED: 'bookmarked.png',
    NOT_BOOKMARKED: 'not-bookmarked.png',
    UNAUTHORIZED: 'login.png',
}

var updateBrowserIcon = function(type, tabId) {
    chrome.browserAction.setIcon({ 
        path: ICON_IMG_URL[type], 
        tabId: tabId
    });
}

function BookmarkObj() {
    return {
        href: '',
        timeout: '1w',
        tags: []
    }
}

Vue.component('top-bar', {
    template: `
        <nav>
            <img src="/img/logo.png" class="img-responsive" />
        </nav>
    `
})

var app = new Vue({
    el: '#app',
    
    data: {
        loader: false,
        isLoggedIn: false,
        chromeRunTimeId: chrome.runtime.id,
        tag: '',
        tags: [],
        bookmark: BookmarkObj()
    },

    beforeCreate: function() {
        var self = this
        // Check whether user has logged in or not
        chrome.storage.local.get('jwt', function(data) {
            if(data.jwt) {
                // Get the current Tab URL
                // Send it to the server to bookmark
                // -> URL exist already or not, show it in badges itself
                chrome.windows.getCurrent(function(w) {
                    chrome.tabs.getSelected(w.id,
                    function (response){
                        self.bookmark.href = response.url
                        self.saveBookmark(self.bookmark, data.jwt);
                    });
                });
            } else {
                updateBrowserIcon('UNAUTHORIZED', tabId)
            }
        })
    },

    methods: {
        signOut: function() {         
            // Removing the token from chrome local
            // store and showing the loggin screen   
            chrome.storage.local.remove('jwt');
            this.isLoggedIn = false
        },

        updateBookmarkTags: function(tags) {
            this.bookmark.tags = tags.map(tag => {
                return tag.text
            })
            
            this.updateBookmark()
        },

        updateBookmark: function() {
            var self = this
            chrome.storage.local.get('jwt', function(data) {
                if(data.jwt) {
                    self.saveBookmark(self.bookmark, data.jwt);
                }
            })
        },

        saveBookmark: function(bookmark, jwt) {
            var self = this
            postJSON('http://localhost:3000/bookmark', bookmark , {'Authorization': 'Bearer ' + jwt }).then(function(r) {
                if (r.status === 200) {
                    // show bookmark success
                    r.json().then(json => {
                        self.isLoggedIn = true    
                        updateBrowserIcon('BOOKMARKED', tabId)
                    })
                } else if (r.statue === 401){
                    // show logged out ui
                    self.isLoggedIn = false      
                    updateBrowserIcon('UNAUTHORIZED', tabId)              
                } else {
                    updateBrowserIcon('NOT_BOOKMARKED', tabId)
                }
            })
        }
    }
})