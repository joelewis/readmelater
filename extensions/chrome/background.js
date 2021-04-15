// chrome.runtime.onStartup.addListener(function callback)

// chrome.runtime.onInstalled.addListener(function(details) {
//     alert('Hey')
//     // chrome.storage.sync.set({clean_news_feed: true});
// });

// chrome.tabs.onSelectionChanged.addListener(function(tabId) {
//     // chrome.browserAction.setIcon({ 
//     //     path: 'twitter.png', 
//     //     tabId: tabId
//     // });

//     // chrome.browserAction.setIcon({
//     //     imageData: draw(i*2, i*4), 
//     //     tabId: tabId
//     // });
// });
  
// chrome.tabs.getSelected(null, function(tab) {
//     chrome.browserAction.setIcon({
//         imageData: draw(i*2, i*4), tabId: tab.id
//     });
// });
  
//   chrome.pageAction.onClicked.addListener(function(tab) {
//       chrome.tabs.sendRequest(tab.id, {}, null);
//   });

function getJSON(url, headers) {
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

var checkAndUpdateBookmarkExtentionIcon = function(url, tabId) {
    try {
        chrome.storage.local.get('jwt', function(data) {
            if (data.jwt) {
                getJSON(chrome.runtime.getManifest().domainUrl + `/is/bookmarked?href=${encodeURIComponent(url)}`, {'Authorization': 'Bearer ' + data.jwt}).then(function(r) {
                    if (r.status === 200) {
                        r.json().then(json => {
                            // bookmarked
                            updateBrowserIcon('BOOKMARKED', tabId)
                        })
                    } else if (r.status === 401){
                        // unauthorized
                        updateBrowserIcon('UNAUTHORIZED', tabId)
                    } else {
                        // Error
                        updateBrowserIcon('NOT_BOOKMARKED', tabId)
                    }
                })
            } else {
                // Login
                updateBrowserIcon('UNAUTHORIZED', tabId)
            }
          });
    } catch(e) {
        // Login
        updateBrowserIcon('UNAUTHORIZED', tabId)
    }
}

// // listen to tab URL changes
// chrome.tabs.onUpdated.addListener(checkAndUpdateBookmarkExtentionIcon);

// // listen to tab switching
// chrome.tabs.onActivated.addListener(checkAndUpdateBookmarkExtentionIcon);

// // listen for window switching
// chrome.windows.onFocusChanged.addListener(checkAndUpdateBookmarkExtentionIcon);

chrome.tabs.onSelectionChanged.addListener(function(tabId) {
    chrome.windows.getCurrent(function(w) {
        chrome.tabs.getSelected(w.id, function (response){
            checkAndUpdateBookmarkExtentionIcon(response.url, tabId)
        });
    })
})

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && tab.status == 'complete' && tab.url != undefined) {
        chrome.windows.getCurrent(function(w) {
            chrome.tabs.getSelected(w.id, function (response){
                checkAndUpdateBookmarkExtentionIcon(response.url, tabId)
            });
        })
    }
})

