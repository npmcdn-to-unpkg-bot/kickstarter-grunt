var app = app || {};
/**
 * @name slider
 * @author Pascal Franzke <pascal.franzke@googlemail.com>
 * @namespace slider
 * @memberof app
 * @param {window} Object - Das window-Objekt
 * @param {$} function - jQuery
 * @requires jQuery
 * @return Object - Die Public-API des Modules
 */
app.slider = (function () { // use data-module="slider" to start this script

    'use strict';

    var options = {
        owlClass: 'owl-carousel',
        owlFixClass: 'owl-fix' //sorgt dafür das das Owlcarousel nicht standartmäíg ausgeblendet wird und somit springt!
    };
    /**
     *	Default Owl Option
     */
    var owloptions = {
        nav: true,
        loop: true,
        dots: false,
        items: 2,
        margin: 10,
        autoplay: true,
        mouseDrag: false,
        autoHeight: true,
        autoplayTimeout: 4000,
        autoplayHoverPause: true,
        responsive: {
            items: 2,
            0: {
                items: 1
            },
            640: {
                items: 2
            }
        },
        navText: [
            '<span class="audible">Back</span><span class="icon icon--angle-left nav__icon"></span>',
            '<span class="audible">Next</span><span class="icon icon--angle-right nav__icon"></span>'
        ]

    };
    /**
     *	typebase Owl Options
     */
    var owloptionsTypes = {
        noAutoplay: {
            autoplay: false
        },
    };

    /**
     * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1 + mergest Array if a point is an Array! (but not insed the array merges things)
     * @param obj1
     * @param obj2
     * @returns obj3 a new object based on obj1 and obj2
     */
    var merge = function _merge(def, obj) {
        if (typeof obj === 'undefined') {
            return def;
        } else if (typeof def === 'undefined') {
            return obj;
        }
        for (var i in obj) {
            if (obj[i] !== null && obj[i].constructor === Object) {
                def[i] = merge(def[i], obj[i]);
            } else if (obj[i] !== null && obj[i].constructor === Array) {
                def[i] = def[i].concat(obj[i]);
            } else {
                def[i] = obj[i];
            }
        }
        return def;
    };

    var getOptionFor = function getOptionFor(type) {
        if (typeof owloptionsTypes[type] !== 'object') {
            return owloptions;
        }
        return merge(owloptions, owloptionsTypes[type]);
    };

    /**
     * slider->init(elements)
     * creates an owl carousel on all given elements
     *
     * @param {array} elements[{HTMLElement}]
     * @return {boolen}
     * @memberOf app.slider
     */
    var init = function _init() {
        return true;
    };

    /**
     * slider->initOwl(element)
     * creates an owl carousel on given element
     *
     * @private
     * @param {HTMLElement} element
     * @memberOf app.slider
     */
    var newEl = function _newEl(element) {
        var $el = $(element);

        if (!$el.hasClass(options.owlClass)) {
            $el.addClass(options.owlClass);
        }

        var typeBasedOptions = getOptionFor($el.attr('data-type'));
        var $owl = $el.owlCarousel(typeBasedOptions);

        if ($el.hasClass(options.owlFixClass)) {
            $el.removeClass(options.owlFixClass);
        }

        return $owl;

    };

    /**
     * slider->destroy(element)
     * removes owl carousel on given element
     *
     * @private
     * @param {HTMLElement} element
     * @memberOf app.slider
     */
    var destroy = function _destroy(element) {
        return $(element).data('owlCarousel').destroy();
    };

    /**
     * slider->owlChromeFix()
     * Fixs a 3d Transition problem with chrome and images
     *
     * @private
     * @return {boolen}
     * @memberOf app.owlChromeFix
     */
    var owlChromeFix = function _owlChromeFix() {
        $.fn.owlCarousel.Constructor.prototype.animate = function (coordinate) {
            var animate = this.speed() > 0;

            this.is('animating') && this.onTransitionEnd();

            if (animate) {
                this.enter('animating');
                this.trigger('translate');
            }

            if ($.support.transform3d && $.support.transition) {
                this.$slider.css({
                    transform: 'translate(' + coordinate + 'px,0px)',
                    transition: (this.speed() / 1000) + 's'
                });
            } else if (animate) {
                this.$slider.animate({
                    left: coordinate + 'px'
                }, this.speed(), this.settings.fallbackEasing, $.proxy(this.onTransitionEnd, this));
            } else {
                this.$slider.css({
                    left: coordinate + 'px'
                });
            }
        };
        return true;
    };

    return {
        init: init,
        new: newEl,
        owlChromeFix: owlChromeFix,
        destroy: destroy
    };

})();
