// browser.runtime.onStartup.addListener(function callback)

// browser.runtime.onInstalled.addListener(function(details) {
//     alert('Hey')
//     // browser.storage.sync.set({clean_news_feed: true});
// });

// browser.tabs.onSelectionChanged.addListener(function(tabId) {
//     // browser.browserAction.setIcon({
//     //     path: 'twitter.png',
//     //     tabId: tabId
//     // });

//     // browser.browserAction.setIcon({
//     //     imageData: draw(i*2, i*4),
//     //     tabId: tabId
//     // });
// });

// browser.tabs.getSelected(null, function(tab) {
//     browser.browserAction.setIcon({
//         imageData: draw(i*2, i*4), tabId: tab.id
//     });
// });

//   browser.pageAction.onClicked.addListener(function(tab) {
//       browser.tabs.sendRequest(tab.id, {}, null);
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
    BOOKMARKED: 'img/closetab-bookmarked.png',
    NOT_BOOKMARKED: 'img/closetab-not-bookmarked.png',
    UNAUTHORIZED: 'img/closetab-logo.png',
}

var updateBrowserIcon = function(type, tabId) {
    browser.browserAction.setIcon({
        path: ICON_IMG_URL[type],
        tabId: tabId
    });
}

var checkAndUpdateBookmarkExtensionIcon = function(url, tabId) {
    try {
        browser.storage.local.get('jwt').then(function(data) {
            if (data.jwt) {
                getJSON(browser.runtime.getManifest().domainUrl + `/is/bookmarked?href=${encodeURIComponent(url)}`, { 'Authorization': 'Bearer ' + data.jwt }).then(function(r) {
                    if (r.status === 200) {
                        r.json().then(json => {
                            // bookmarked
                            updateBrowserIcon('BOOKMARKED', tabId)
                        })
                    } else if (r.status === 401) {
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
    } catch (e) {
        // Login
        updateBrowserIcon('UNAUTHORIZED', tabId)
    }
}

// // listen to tab URL changes
// browser.tabs.onUpdated.addListener(checkAndUpdateBookmarkExtensionIcon);

// // listen to tab switching
// browser.tabs.onActivated.addListener(checkAndUpdateBookmarkExtensionIcon);

// // listen for window switching
// browser.windows.onFocusChanged.addListener(checkAndUpdateBookmarkExtensionIcon);

browser.tabs.onActivated.addListener(function(activeInfo) {
    browser.tabs.query({ active: true, currentWindow: true }).then(function(tabs) {
        checkAndUpdateBookmarkExtensionIcon(tabs[0].url, activeInfo.tabId)
    });
})

browser.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && tab.status == 'complete' && tab.url != undefined) {
        browser.tabs.query({ active: true, currentWindow: true }).then(function(tabs) {
            checkAndUpdateBookmarkExtensionIcon(tabs[0].url, tabId)
        });
    }
})

