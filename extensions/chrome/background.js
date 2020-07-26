// Example POST method implementation:
function postJSON(url, headers) {
    // Default options are marked with *
    var opts = {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        // body: JSON.stringify(json) // body data type must match "Content-Type" header
    }

    Object.keys(headers).forEach(key => {
        opts.headers[key] = headers[key]
    });
    
    return fetch(url, opts);
}

var tryBookmarkingCurrentTab = function(url, tabId) {
    try {
        chrome.storage.local.get('jwt', function(data) {
            if (data.jwt) {
                postJSON(`http://localhost:3000/is/bookmarked?href=${url}`, {'Authorization': 'Bearer ' + data.jwt}).then(function(r) {
                    if (r.status === 200) {
                        r.json().then(json => {
                            chrome.browserAction.setBadgeText({text: 'BOOKMARKED'});
                            chrome.browserAction.setBadgeBackgroundColor({
                                color: '#e74c3c',
                                tabId: tabId
                            })
                        })
                    } else if (r.status === 401){
                        chrome.browserAction.setBadgeText({text: 'LOGIN'});
                        chrome.browserAction.setBadgeBackgroundColor({
                            color: '#f1c40f',
                            tabId: tabId
                        })
                    } else {
                        chrome.browserAction.setBadgeText({text: 'AVAILABLE'});
                        chrome.browserAction.setBadgeBackgroundColor({
                            color: '#2ecc71',
                            tabId: tabId
                        })
                    }
                })
            } else {
                chrome.browserAction.setBadgeText({text: 'LOGIN'});
                chrome.browserAction.setBadgeBackgroundColor({
                    color: '#f1c40f',
                    tabId: tabId
                })
            }
          });
    } catch(e) {
        chrome.browserAction.setBadgeText({text: 'LOGIN'});
        chrome.browserAction.setBadgeBackgroundColor({
            color: '#f1c40f',
            tabId: tabId
        })
    }
}

chrome.tabs.onActivated.addListener(function(info) {
    chrome.windows.getCurrent(function(w) {
        chrome.tabs.getSelected(w.id,
        function (response){
            tryBookmarkingCurrentTab(response.url, info.tabId)
        });
    });
})

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    chrome.windows.getCurrent(function(w) {
        chrome.tabs.getSelected(w.id,
        function (response){
            tryBookmarkingCurrentTab(response.url, tabId)
        });
    });
});