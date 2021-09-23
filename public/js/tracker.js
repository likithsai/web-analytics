//  simpleTracker.js
//  Simple web tracker analytics
//  V 1.0.0

//  Analytics reference
//  https://www.optimizesmart.com/event-tracking-guide-google-analytics-simplified-version/
//  https://www.optimizesmart.com/understanding-channels-in-google-analytics/
//  https://www.optimizesmart.com/custom-campaigns-google-analytics-complete-guide/
//  https://www.optimizesmart.com/virtual-pageviews-google-analytics-complete-guide/
//  https://www.optimizesmart.com/understanding-universal-analytics-measurement-protocol/

var simpleTrack = (window.simpleTrack) ? window.simpleTrack : {};
simpleTrack = (function () {
    'use strict';

    var md = {},
        log = [],
        dc = document,
        wn = window,
        nv = wn.navigator,
        sc = screen,
        config = {},
        cf = {},
        urlDomain = wn.location.protocol + '//' + wn.location.hostname + (wn.location.port ? ':' + wn.location.port : ''),
        url = urlDomain + '/api/tracker', //  URL Alias
        sendDataInterval = 60000; //  1min interval time


    // //  function to set tracker cookie
    // function setTrackerCookie(name, value, expires) {
    //     var expires = "";
    //     if (expires) {
    //         var date = new Date();
    //         date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000));
    //         expires = "; expires=" + date.toUTCString();
    //     }
    //     dc.cookie = name + "=" + (value || "") + expires + "; path=/";
    // }

    // //  function to get tracker cookie
    // function getTrackerCookie(cookieName) {
    //     var match = dc.cookie.match(RegExp('(?:^|;\\s*)' + cookieName + '=([^;]*)'));
    //     return match ? match[1] : null;
    // }


    //  function to get referrer
    function getReferrer() {
        var referrer = '';

        try {
            referrer = wn.top.document.referrer;
        } catch (e) {
            if (wn.parent) {
                try {
                    referrer = wn.parent.document.referrer;
                } catch (e2) {
                    referrer = '';
                }
            }
        }

        if (referrer === '') {
            referrer = dc.referrer;
        }

        return referrer;
    }

    //  function to print message to console
    function logConsole(logType, logMessage) {
        // needed to write it this way for jslint
        var consoleType = typeof console;
        if (consoleType !== 'undefined' && console) {
            switch (logType.toLowerCase()) {
                case 'error':
                    console.error(logMessage);
                    break;

                case 'warn':
                    console.warn(logMessage);
                    break;

                default:
                    console.log(logMessage);
            }
        }
    }

    //  function to generate UID
    function randomUid() {
        var timestamp = (new Date()).getTime().toString(36);
        var random1 = Math.floor(Math.random() * 0x7fffffff).toString(36);
        var random2 = Math.floor(Math.random() * 0x7fffffff).toString(36);

        return [timestamp, random1, random2].join('');
    }

    //  function to get device from width
    function getDeviceType(ua) {
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
        if (element.addEventListener) {
            element.addEventListener(event, callback);
            return true;
        } else if (element.attachEvent) {
            return element.attachEvent('on' + event, callback);
        }
        // } else {
        //     element['on' + event] = callback;
        // }
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
            deviceType: getDeviceType(nv.userAgent),
            deviceOperatingSystem: getOSDetails(),
            deviceResolution: parseInt(sc.width, 10) + "X" + parseInt(sc.height, 10),
            deviceColorDepth: sc.colorDepth || null
        });

        return device;
    }

    function sendData(url, data) {
        var request = wn.XMLHttpRequest ? new wn.XMLHttpRequest() : wn.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : null;
        request.open('POST', url);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.withCredentials = true;
        request.send(JSON.stringify(data));

        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                console.log(request.responseText);
                log = [];
            }
        };

    }

    function getPerformanceTiming() {
        return (typeof wn.performance.timing === 'object') && wn.performance.timing ? wn.performance.timing : undefined;
    }

    function track(id, callback) {
        // if (getTrackerCookie('tracker_session') === null) {
        //     setTrackerCookie('tracker_session', id, 1);
        // }

        config = {};
        // config.id = id;
        config.eventType = 'Loaded';
        config.url = wn.location.href;
        config.title = dc.title;
        config.domain = dc.domain;
        config.charSet = dc.characterSet || dc.charset;
        config.device = getDevice(sc);
        config.userAgent = nv.userAgent;
        config.referrer = getReferrer();
        config.timing = getPerformanceTiming();
        // config.timeTakenToLoad = parseFloat(wn.performance.now() || wn.performance.mozNow() || wn.performance.msNow() || wn.performance.oNow() || wn.performance.webkitNow());
        config.internalLinks = getAllLinks();
        config.lastModified = dc.lastModified;
        config.time = Math.floor(Date.now() / 1000);

        log.push({
            id: id,
            data: config
        });

        setInterval(function () {
            if (log.length > 0) {
                sendData(url, log);
            } else {
                logConsole('warn', 'No data to display');
            }
        }, sendDataInterval);

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
                        cf = {};
                        // config.id = trackid;
                        cf.eventType = wn.event.type;
                        cf.url = isAbsoluteRelative(this.href);
                        cf.isExternal = checkForExternalLinks(isAbsoluteRelative(this.href));
                        cf.domain = dc.domain;
                        cf.device = getDevice(sc);
                        cf.userAgent = nv.userAgent;
                        cf.referrer = dc.referrer || '';
                        cf.timing = getPerformanceTiming();
                        cf.time = Math.floor(Date.now() / 1000);

                        log.push({
                            id: trackid,
                            data: cf
                        });
                    }
                }
            }

            //  check if trackForm is enabled or not
            if (props.trackForm) {

            }
        }

        eventListener(wn, "DOMContentLoaded", track(trackid, callback, props));
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