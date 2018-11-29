'use strict';

/**
 * In this file the document progress bar and ajax page loading are realized
 */

function loadUrl(newUrl) {
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

        location.hash = newUrl.hash;

        var elem = (newUrl.hash) ? document.getElementById(newUrl.hash.replace("#","")) : null;
        if (elem)
            elem.scrollIntoView({ behavior: 'smooth' });
        else
            window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    }).catch(function(error) {
        console.log('Fetch failed', error);
        window.location.href = "/404.html"
    });
}

function changeToURL(newUrl, event) {
    // External links should instead open in a new tab
    // var domain = window.location.origin;
    if (newUrl.hostname !== window.location.hostname) {
        // Other domain -> default behaviour
    } else if (newUrl.pathname === window.location.pathname) {
        // Only anchor changed -> default behaviour
        if (newUrl.hash === window.location.hash)
            if (event) event.preventDefault(); // Same url -> do nothing
        else {
            location.hash = newUrl.hash;
            //location.reload();
        }
    } else {
        if (event) event.preventDefault();
        loadUrl(newUrl);
        history.pushState({consider:true} /*stateObj*/, "" /*title*/, newUrl);
    }
}

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

    window.addEventListener("popstate", e => {
        if (e.state && e.state.consider)
            loadUrl(new URL(document.location));
    });

    history.replaceState({consider:true} /*stateObj*/, "" /*title*/, document.location);
    document.dispatchEvent(new Event('MainContentChanged'));
    window.loaded = true;

    // Ajax loading of pages. Intercept link clicks.
    document.body.addEventListener("click", event => {
        if (event.target.tagName !== "A" ||
            event.target.dataset["fullreload"]) return;
        if (history === null || event.target.href === "") return;

        changeToURL(new URL(event.target.href), event);
    })
}); 
