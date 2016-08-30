var app = app || {};
app.helper = app.helper || {};
/**
 * scrollTo Helper
 * @author Pascal Franzke <pascal.franzke@googlemail.com>
 *
 * @namespace scrollTo
 * @example
 * var scrollTo =app.helper.scrollTo(); // inits den scroller
 * scrollTo(800, 300); //scrollt zu 800px in 300ms
 * @memberof app.helper
 * @param {window} Object - Das window-Objekt
 * @param {$} function - jQuery
 * @return Object - Die Public-API des Modules
 */
app.helper.scrollTo = function scrollTo($el, $main) {

    'use strict';

    $el = $el || $('html, body');
    $main = $main || $('main');

    var scroll = function scroll(offset, time) {
        if (!offset) {
            return false;
        }

        var $tmp = $el;

        time = (time ? time : 300);

        if (window.innerWidth < 641) {
            $tmp = $main;
            offset = $tmp.scrollTop() + offset;
        }

        $tmp.animate({
            scrollTop: offset
        }, time);

        return true;
    };

    return scroll;
};
