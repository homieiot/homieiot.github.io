'use strict';

/**
 * In this file the document progress bar and ajax page loading are realized
 */

document.addEventListener("DOMContentLoaded", () => {
    // document read progress bar
    var progress = document.querySelector('.progress')
    if (progress) {
        document.addEventListener('scroll', function () {
            const st = 'scrollTop';
            const sh = 'scrollHeight';
            var scroll = (document.documentElement[st] || document.body[st]) / ((document.documentElement[sh] || document.body[sh]) - document.documentElement.clientHeight) * 100;
            progress.style.setProperty('--scroll', scroll + '%');
        });
    }

    document.dispatchEvent(new Event('MainContentChanged'));
}); 
