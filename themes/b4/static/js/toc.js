'use strict';

var extendObj = function (src, target) {
    for (var prop in target) {
        if (target.hasOwnProperty(prop) && target[prop]) {
            src[prop] = target[prop];
        }
    }

    return src;
};

var getHeaders = function (selector, scope) {
    var ret = [];
    var target = document.querySelectorAll(scope);

    Array.prototype.forEach.call(target, function (elem) {
        var elems = elem.querySelectorAll(selector);
        ret = ret.concat(Array.prototype.slice.call(elems));
    });

    ret = ret.filter(el => el.offsetParent !== null)
    return ret;
};

var getLevel = function (header) {
    if (typeof header !== 'string') {
        return 0;
    }

    var decs = header.match(/\d/g);
    return decs ? Math.min.apply(null, decs) : 1;
};

var createList = function (wrapper, count) {
    while (count--) {
        wrapper = wrapper.appendChild(
            document.createElement('ol')
        );

        if (count) {
            wrapper = wrapper.appendChild(
                document.createElement('li')
            );
        }
    }

    return wrapper;
};

var jumpBack = function (currentWrapper, offset) {
    while (offset--) {
        currentWrapper = currentWrapper.parentElement;
    }

    return currentWrapper;
};

var setAttrs = function (overwrite, prefix) {
    return function (src, target, index) {
        var content = src.textContent;
        var pre = prefix + '-' + index;
        target.textContent = content;

        var id = overwrite ? pre : (src.id || pre);

        id = encodeURIComponent(id);

        src.id = id;
        target.href = '#' + id;
    };
};

var buildTOC = function (options) {
    var selector = options.selector;
    var scope = options.scope;

    var ret = document.createElement('ol');
    var wrapper = ret;
    var lastLi = null;

    var _setAttrs = setAttrs(options.overwrite, options.prefix);

    getHeaders(selector, scope).reduce(function (prev, cur, index) {
        var currentLevel = getLevel(cur.tagName);
        var offset = currentLevel - prev;

        if (offset > 0) {
            wrapper = createList(lastLi, offset);
        }

        if (offset < 0) {
            wrapper = jumpBack(wrapper, -offset * 2);
        }

        wrapper = wrapper || ret;

        var li = document.createElement('li');
        var a = document.createElement('a');

        _setAttrs(cur, a, index);

        wrapper.appendChild(li).appendChild(a);

        lastLi = li;

        return currentLevel;
    }, getLevel(selector));

    return ret;
};

var initTOC = function (options) {
    var defaultOpts = {
        selector: 'h1, h2, h3, h4, h5, h6',
        scope: 'body',
        overwrite: false,
        prefix: 'toc'
    };

    options = extendObj(defaultOpts, options);

    var selector = options.selector;

    if (typeof selector !== 'string') {
        throw new TypeError('selector must be a string');
    }

    if (!selector.match(/^(?:h[1-6],?\s*)+$/g)) {
        throw new TypeError('selector must contains only h1-6');
    }

    var currentHash = location.hash;

    if (currentHash) {
        setTimeout(function () {
            var anchor = document.getElementById(currentHash.slice(1));
            if (anchor) anchor.scrollIntoView();
        }, 0);
    }

    return buildTOC(options);
};

window.initTOC = initTOC;

document.addEventListener("DOMContentLoaded", () => {
    // document read progress bar
    var progress = document.querySelector('.progress')
    document.addEventListener('scroll', function() {
      const st = 'scrollTop';
      const sh = 'scrollHeight';
      var scroll = (document.documentElement[st]||document.body[st]) / ((document.documentElement[sh]||document.body[sh]) - document.documentElement.clientHeight) * 100;
      progress.style.setProperty('--scroll', scroll + '%');
    });

    document.addEventListener('MainContentChanged', function() {
        const varlist = initTOC({selector:'h2, h3, h4, h5, h6',overwrite:false,prefix:'toc' });
        document.querySelectorAll(".toc").forEach(e => e.appendChild(varlist.cloneNode(true)));
    });

    document.dispatchEvent(new Event('MainContentChanged'));
    window.loaded = true;

    // Ajax loading of pages. Intercept link clicks.
    document.body.addEventListener("click", event => {
        if (event.target.tagName !== "A" ||
            event.target.dataset["fullreload"]) return;
        if (history === null || event.target.href === "") return;

        // External links should instead open in a new tab
        var newUrl = new URL(event.target.href);
        if (newUrl.hostname !== window.location.hostname) {
            // Other domain -> default behaviour
        } else if (newUrl.pathname === window.location.pathname) {
            // Only anchor changed -> default behaviour
            if (newUrl.hash === window.location.hash)
                event.preventDefault(); // Same url -> do nothing
        } else {
            event.preventDefault();
            fetch(newUrl)
            .then(response => {
                if(response.ok)
                    return response.text();
                throw new Error('Network response was not ok.',response);
            })
            .then(text => new DOMParser().parseFromString(text, "text/html"))
            .then(doc => {
                if (doc === null) return;

                var newContent = doc.getElementById("mainContent");
                var elemLanguage = doc.getElementById("mainmenu");
                if (newContent === null || elemLanguage === null) {
                    console.log("elements missing!")
                    return;
                }

                document.title = doc.title;
                document.getElementById("mainContent").replaceWith(newContent);
                document.getElementById("mainmenu").replaceWith(elemLanguage);

                document.dispatchEvent(new Event('MainContentChanged'));

                window.scroll({
                    top: 0, 
                    left: 0, 
                    behavior: 'smooth' 
                  });
            }).catch(function(error) {
                console.log('Fetch failed: ', error.message);
            });
            history.pushState(null /*stateObj*/, "" /*title*/, newUrl);
        }
    })
}); 
