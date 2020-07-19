let params = new URLSearchParams(location.search);
var token = params.get('token');


chrome.storage.local.set({'jwt': token}, function(data) {
    console.log(data);
    // close current tab
    chrome.tabs.getCurrent(function(tab) {
        chrome.tabs.remove(tab.id, function() { });
    });
});