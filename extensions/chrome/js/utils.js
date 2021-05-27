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

function makeReq(url, headers, method, body) {
    // Default options are marked with *
    var opts = {
        method: method || 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    }

    if (body) {
        opts.body = JSON.stringify(body) 
    }

    Object.keys(headers).forEach(key => {
        opts.headers[key] = headers[key]
    });

    return fetch(url, opts);
}

function getDomainUrl() {
    return browser.runtime.getManifest().domainUrl;
}