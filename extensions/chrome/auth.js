let params = new URLSearchParams(location.search);
var token = params.get('token');


browser.storage.local.set({ 'jwt': token }).then(function(data) {
    console.log(data);
    // close current tab
    browser.tabs.query({ active: true, currentWindow: true }).then(function(tabs) {
        browser.tabs.remove(tabs[0].id);
    });
});