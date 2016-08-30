# EX3MP's Kickstarter

## Required installations

```bash
gem install scss_lint sass
```

```bash
apt-get install nodejs;
npm install -g grunt-cli bower;
```

use scss-lint from <https://github.com/airbnb/css>

## statics/

static files: images (logo) and fonts

### styles/

sass or scss files

```
main.scss // frontend main css
fonts.scss // fonts
editor.scss // backend or editor scss (ckeditor / tinymce)
```

### install/

used for yo processwire

### scripts/

load modules in header

```html
<head>
    [....]
    <script>
    app.main
        .add('ls-respimg', "./testlibs/ls.respimg.min.js")
        .add('ls-bgset', "./testlibs/ls.bgset.min.js")
        .add('lazysizes', "./testlibs/lazysizes.min.js", ['ls-respimg', 'ls-bgset'])
        .add("jquery", 'http://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js')
        .add('owl', './testlibs/owl.carousel.min.js', ['jquery'])
        .add('example', '../scripts/modules/_example.js')
        .add('slider', '../scripts/modules/_slider.js', ['jquery', 'owl']);
    </script>
    [....]
</head>
```

use module in html

```html
<ul data-module="slider">
    [...]
</ul>
```

a example module js file

```javascript
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
    var newEl = function _newEl(el) { // el is the element with the data-module
        if(!el){ return false;}
        el.classList.add('gangnam-style');
    };
    return {
        init: init,
        new: newEl // for each data-module this funciton will be called
    };
})();
```
