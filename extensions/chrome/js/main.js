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
        isLoggedIn: false,
        chromeRunTimeId: chrome.runtime.id
    },

    beforeCreate: function() {
        var self = this
        // Check whether user has logged in or not
        chrome.storage.local.get('jwt', function(data) {
            if(data.jwt) {
                self.isLoggedIn = true
            } else {
                self.isLoggedIn = false   
            }
        })

        // Get the current Tab URL
        // Send it to the server to bookmark
        // -> URL exist already or not, show it in badges itself
    },

    methods: {
        signOut: function() {         
            // Removing the token from chrome local
            // store and showing the loggin screen   
            chrome.storage.local.remove('jwt');
            this.isLoggedIn = false
        }
    }
})