var app = app || {};
/**
 * @name example
 * @description Example function, witch just adds the class gangnam-style
 * @author Pascal Franzke <pascal.franzke@googlemail.com>
 * @memberof app
 * @namespace example
 * @return Object - Die Public-API des Modules
 */
app.example = (function () {

    'use strict';

    /**
     * init()
     *
     * @param {array} elements[{HTMLElement}]
     * @return {boolen}
     * @memberOf app.example
     */
    var init = function _init() {
        return true;
    };

    /**
     * newEl(element)
     *
     * @pubic new
     * @param {HTMLElement} element
     * @memberOf app.example
     */
    var newEl = function _newEl(el) {
        if (!el) {
            return false;
        }
        el.classList.add('gangnam-style');
    };
    return {
        init: init,
        new: newEl
    };

})();
