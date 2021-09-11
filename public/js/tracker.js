//  simpleTracker.js
//  V 1.0.0
window.simpleTrack = (function () {
    'use strict';

    var md = {},
        dc = document,
        wn = window,
        nv = wn.navigator,
        sc = screen,
        config = {},
        url = wn.location.protocol + '//' + wn.location.hostname + (wn.location.port ? ':' + wn.location.port : '') + '/api/tracker';
    // url = 'http://127.0.0.1:8000/api/tracker';
    // url = 'http://localhost/website-analytics/index.php';

    //  function to get device from width
    function getDevice(ua) {
        var device = "";
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            device = "tablet";
        } else if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            device = "mobile";
        } else {
            device = "Desktop";
        }

        return device;
    }

    //  function to check if string is empty
    function isEmpty(str) {
        return (!str || str.length === 0);
    }

    //  custom event listener function
    function eventListener(element, event, callback) {
        element.addEventListener(event, callback, true);
    }

    //  function to check for external link
    function checkForExternalLinks(path) {
        const tmp = document.createElement('a');
        tmp.href = path;
        return tmp.host !== window.location.host;
    }

    //  function to check for absolute and relatiive path
    //  if its absolute, covert to relative
    function isAbsoluteRelative(path) {
        var r = new RegExp('^(?:[a-z]+:)?//', 'i');
        if (r.test(path)) {
            return path;
        } else {
            return new URL(path, dc.baseURI).href
        }
    }

    //  function to get all links
    function getAllLinks() {
        var allLinks = [];
        var anchors = document.getElementsByTagName('a');
        for (var z = 0; z < anchors.length; z++) {
            allLinks.push({
                url: isAbsoluteRelative(anchors[z].href),
                isExternal: checkForExternalLinks(isAbsoluteRelative(anchors[z].href)),
                time: Math.floor(Date.now() / 1000)
            });
        }

        return allLinks;
    }

    //  get OS Listeners
    function getOSDetails() {
        var userAgent = nv.userAgent,
            platform = nv.platform,
            macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
            windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
            iosPlatforms = ['iPhone', 'iPad', 'iPod'],
            os = 'Unknown';

        if (macosPlatforms.indexOf(platform) !== -1) {
            os = 'Mac OS';
        } else if (iosPlatforms.indexOf(platform) !== -1) {
            os = 'iOS';
        } else if (windowsPlatforms.indexOf(platform) !== -1) {
            os = 'Windows';
        } else if (/Android/.test(userAgent)) {
            os = 'Android';
        } else if (!os && /Linux/.test(platform)) {
            os = 'Linux';
        } else {
            os = 'Unknown';
        }

        return os;
    }

    //  function to get device details
    function getDevice(sc) {
        var device = [];

        device.push({
            deviceWidth: sc.width || null,
            deviceHeight: sc.height || null
        });

        return device;
    }

    function sendData(url, data) {

        var request = wn.XMLHttpRequest ? new wn.XMLHttpRequest() : wn.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : null;
        request.open('POST', url);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send(JSON.stringify(data));

        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                console.log(request.responseText);
            }
        };

    }

    function track(id, callback) {
        config = {};
        config.id = id;
        config.url = wn.location.href;
        config.title = dc.title;
        config.domain = dc.domain;
        config.charSet = dc.characterSet || dc.charset;
        config.device = getDevice(sc);
        config.userAgent = nv.userAgent;
        config.operatingSystem = getOSDetails();
        config.timeTakenToLoad = parseFloat(wn.performance.now());
        config.internalLinks = getAllLinks();
        config.lastModified = dc.lastModified;
        config.time = Math.floor(Date.now() / 1000);

        sendData(url, config);

        if (callback && typeof (callback) === "function") {
            callback();
        }
    }

    md.onTrack = function (trackid, props, callback) {
        if (typeof props !== 'undefined') {
            //  check if trackLink prop is true for tracking link
            if (props.trackLink) {
                var anchors = document.getElementsByTagName('a');
                for (var z = 0; z < anchors.length; z++) {
                    anchors[z].onclick = function () {
                        config = {};
                        config.clickedURL = [{
                            url: isAbsoluteRelative(this.href),
                            isExternal: checkForExternalLinks(isAbsoluteRelative(this.href)),
                            time: Math.floor(Date.now() / 1000)
                        }];
                        sendData(url, config);
                    }
                }
            }
        }

        eventListener(wn, "DOMContentLoaded", track(trackid, callback, props));
        // wn.addEventListener("DOMContentLoaded", track(trackid, callback, props));
    }

    //  function to create events
    md.createEvent = function (evTarget, evListener, evArgs) {
        [...document.querySelectorAll(evTarget)].forEach(function (item) {
            eventListener(item, evListener, function () {
                console.log(evArgs);
            });
        });
    }

    return md;
})();