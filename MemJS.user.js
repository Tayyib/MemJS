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

var methodTwoRegex = /.*\/edit\/.*/i;
var methodThreeRegex = /.*\/edit\/database\/.*/i;

function Main()
{
    if (document.URL.search(methodThreeRegex) === 0)
    {
        console.log("Yöntem 3: Veritabanından getir.");
    }
    else if (document.URL.search(methodTwoRegex) === 0)
    {
        console.log("Yöntem 2: Düzenleyici ekranından getir.");
    }
    else
    {
        console.log("Yöntem 1: Kurs ekranından getir.");
    }
}

function InsertButton()  // TODO
{
    // TODO
}

Main();
