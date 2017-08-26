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
// ==/UserScript==

/*
Forked from github.com/scytalezero/MemriseUtilities
 */

var editPageRegex = /.*\/edit\/.*/i;
var databasePageRegex = /.*\/edit\/database\/.*/i;
var onProgress = false;
var ButtonGet;
var levelCount;
var dataURL;

(function ()
{
    'use strict';

    if (document.URL.search(databasePageRegex) === 0)
    {
        dataURL = document.URL + "?page=%s";
        levelCount = $(".pagination-centered li:nth-last-child(2)").text().replace(/\s+/g, '');
    }
    else if (document.URL.search(editPageRegex) === 0)
    {
        dataURL = document.URL + "%s";
        levelCount = $(".level.collapsed:last-child .level-handle")[0].textContent;
    }
    else if ($(".levels.clearfix").length !== 0)
    {
        dataURL = document.URL + "%s";
        levelCount = $(".level:last-child .level-index")[0].textContent;
    }
    else
    {
        print("Unrelated page!");
        return;
    }

    $("ul.nav-pills").append("<li><a class='tab' id='ButtonGet' href='#' style='font-weight: bold;'>Get Bulk</a></li>");

    ButtonGet = $("#ButtonGet");
    ButtonGet.click(OnClick);

    function OnClick()  // TODO
    {
        if (onProgress)
        {
            print("Already in progress");
            return;
        }

        onProgress = true;

        ButtonGet.text("In progress...");
        ButtonGet.unbind("click");

        // TODO - ajax, push, promises, async=?
    }

    function AbstractData()
    {
        // TODO
    }

    function OnFinish()  // TODO
    {
        onProgress = false;
        ButtonGet.bind("click");
    }
})();

function print(string)
{
    console.log("[MEMJS] " + string);
}
