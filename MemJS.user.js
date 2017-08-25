// ==UserScript==
// @name          MemJS
// @version       0.1
// @description   Download Memrise courses. For users and creators.
// @author        Tayyib <m.tayyib.yel@gmail.com>
// @copyright     Licensed under Apache 2.0
// @namespace     https://tampermonkey.net
// @homepageURL   https://github.com/Tayyib/MemJS
// @updateURL     https://github.com/Tayyib/MemJS/raw/master/MemJS.user.js
// @downloadURL   https://github.com/Tayyib/MemJS/raw/master/MemJS.user.js
// @icon          https://d2rhekw5qr4gcj.cloudfront.net/img/new_favicon.ico
// @grant         none
// @match         *://www.memrise.com/course/*
// @match         *://www.memrise.com/course/*/edit
// @match         *://www.memrise.com/course/*/edit/database/*
// ==/UserScript==

/*
Forked from github.com/scytalezero/MemriseUtilities
 */

var editPageRegex = /.*\/edit\/.*/i;
var databasePageRegex = /.*\/edit\/database\/.*/i;
var onProgress = false;
var ButtonGet;
var levelCount;

(function ()
{
    'use strict';

    $("ul.nav-pills").append("<li><a class='tab' id='ButtonGet' href='#' style='font-weight: bold;'>Get Bulk</a></li>");

    ButtonGet = $("#ButtonGet");
    ButtonGet.click(OnClick);

    if (document.URL.search(databasePageRegex) === 0)
    {
        levelCount = $(".pagination-centered li:nth-last-child(2)").text().replace(/\s+/g, '');
    }
    else if (document.URL.search(editPageRegex) === 0)
    {
        levelCount = $(".level.collapsed:last-child .level-handle")[0].textContent;
    }
    else
    {
        levelCount = $(".level:last-child .level-index")[0].textContent;
    }

    function OnClick()  // TODO
    {
        if (onProgress)
        {
            console.log("[WARNING] Already in progress!");
            return;
        }

        onProgress = true;

        ButtonGet.text("In progress...");
        ButtonGet.unbind("click");

        // TODO
    }

    function OnFinish()  // TODO
    {
        onProgress = false;
        ButtonGet.bind("click");
    }
})();
