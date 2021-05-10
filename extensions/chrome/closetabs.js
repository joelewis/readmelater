// Example POST method implementation:
function postJSON(url, json, headers) {
    // Default options are marked with *
    var opts = {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(json) // body data type must match "Content-Type" header
    }

    Object.keys(headers).forEach(key => {
        opts.headers[key] = headers[key]
    });

    return fetch(url, opts);
}

var tryBookmarkingCurrentTab = function() {
    try {
        browser.storage.local.get('jwt').then(function(data) {
            console.log('jwt: ', data.jwt);
            if (data.jwt) {
                // check if valid token by calling api
                postJSON(browser.runtime.getManifest().domainUrl + '/bookmark', { key: 'value' }, { 'Authorization': 'Bearer ' + data.jwt }).then(function(r) {
                    if (r.status === 200) {
                        console.log(r.json().then(json => console.log(json)))
                        // show bookmark success
                        document.querySelector('#bookmarked').style.display = 'block';
                    } else if (r.statue === 401) {
                        // show logged out ui
                        document.querySelector('#cannot-bookmark').style.display = 'block';
                    } else {
                        // show error ui
                        document.querySelector('#cannot-bookmark').style.display = 'block';
                    }
                })
            }
        });
    } catch (e) {
        // jwt not found
        // so show logged out ui

    }
}

var signout = function() {
    browser.storage.local.remove('jwt');
    window.close();
}

document.addEventListener("DOMContentLoaded", function() {
    var loginUrl = browser.runtime.getManifest().domainUrl + "/auth/google?from_extension_url=" + browser.extension.getURL("/");
    document.querySelector('#sign-in-btn').setAttribute("href", loginUrl);
    document.querySelector('#sign-out-btn').addEventListener('click', signout);

    tryBookmarkingCurrentTab();
});
