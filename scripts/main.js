var app = app || {};
/**
 * @name main
 * @description Loads all submodules
 * @author Pascal Franzke <pascal.franzke@googlemail.com>
 * @requires jQuery Tiny Pub/Sub - v0.7 - http://benalman.com/
 * @requires jQuery
 * @namespace main
 * @memberof app
 * @param {window} Object - The window Object
 * @todo initNode as funciton, where you can init all modules inside a container
 * @return {object}
 */
app.main = (function (window) {
    'use strict';

    var debug = true,
        elements = [],
        scripts = [],
        query = [], 
        modules = [],
        puffer = {};

    /*
     * HasOwnProperty-helper
     */
    var hasOwn = function _hasOwn(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    };

    var inIframe = function _inIframe() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    };

    var runModuleFn = function _runModuleFn(modulename, functionName, el) {
        if (hasOwn(app[modulename], functionName) || typeof app[modulename][functionName] === 'function') {
            var fn = app[modulename][functionName];
            if (typeof el !== 'undefined' && typeof el.length !== 'undefined' && el.length > 1) {
                for (var i in el) {
                    if (debug) console.log(functionName + ' -> ' + (inIframe() ? '/iframe' : '') + '/' + modulename + '/' + functionName);
                    fn(el[i]);
                }
            } else {
                if (debug) console.log(functionName + ' -> ' + (inIframe() ? '/iframe' : '') + '/' + modulename + '/' + functionName);
                fn(el);
            }
        }
        return true;
    };

    /**
     * initElements
     * gets all elements inside elnode or document and adds them to app.main.elements[modulename] (modulename comes from data-module)
     */
    var getElements = function _getElements(elnode) { // elnode ist der container
        var els = elnode ? elnode.querySelectorAll('::scope [data-module]') : document.querySelectorAll('[data-module]');
        var out = [];
        var len = els.length;
        for (var i = 0; i < len; i++) {
            var el = els[i];
            var mods = el.getAttribute('data-module').split(',');
            for (var j in mods) {
                var mod = mods[j];

                if (typeof elements[mod] === 'undefined') {
                    elements[mod] = [];
                }
                if (typeof out[mod] === 'undefined') {
                    out[mod] = [];
                }
                if (elements[mod].indexOf(el) < 1) {
                    elements[mod].push(el);
                }
                if (out[mod].indexOf(el) < 1) {
                    out[mod].push(el);
                }
            }
        }
        return out;
    };

    /**
     * Init
     */
    var init = function __init() {
        if (document.readyState === 'complete') {
            var els = getElements(); // bereitet var elements[] vor
            if (query.length > 0) {
                for (var i in query) {
                    runModuleFn(query[i], 'init');
                    runModuleFn(query[i], 'new', els[query[i]]);
                }
            }
        }
        return true;
    };

    var checkDependencies = function _checkDependencies(data) {
        for (var i in data) {
            if (scripts.indexOf(data[i]) < 0) {
                return false;
            }
        }
        return true;
    };

    var depIntervalFn = function _depInterval() {
        for (var i in puffer) {
            if (checkDependencies(puffer[i].dep)) {
                var name = i,
                    dep = puffer[i].dep,
                    src = puffer[i].src;
                delete puffer[i];
                add(name, src, dep);
            }
        }
        return true;
    };

    /* jshint -W003 */
    var add = function _add(name, src, dep) {
        /* jshint +W003 */
        if (typeof dep === 'object') {
            if (!checkDependencies(dep)) {
                puffer[name] = {
                    'src': src,
                    'dep': dep
                };
                return this;
            }
        }
        var script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = function () {
            newScript(name);
            depIntervalFn();
        };
        document.head.appendChild(script);
        return this;
    };

    var newScript = function _newScript(message) {
        scripts.push(message);
        if (typeof app[message] !== 'undefined') {
            if (debug) {
                console.log('Loaded: /app/' + message);
            }
            modules.push(message);
            if (document.readyState !== 'complete') {
                query.push(message);
                return true;
            }
            runModuleFn(message, 'init');
            runModuleFn(message, 'new', elements[message]);
        } else {
            if (debug) {
                console.log('Loaded: /' + message);
            }
        }
    };

    return {
        init: init,
        depIntervalFn: depIntervalFn,
        new: newScript,
        add: add
    };
})(window);
document.addEventListener('readystatechange', app.main.depIntervalFn);
document.addEventListener('readystatechange', app.main.init);
