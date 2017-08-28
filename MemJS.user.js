// ==UserScript==
// @name          MemJS
// @version       0.3
// @description   Download Memrise courses. For users and creators.
// @author        Tayyib <m.tayyib.yel@gmail.com>
// @copyright     Licensed under Apache 2.0
// @namespace     https://github.com/Tayyib
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
var dataURL;
var levelCount;
var step;

(function ()
{
    'use strict';

    if (document.URL.search(databasePageRegex) === 0)
    {
        dataURL = document.URL + '?page=%s';
        levelCount = $(".pagination-centered li:nth-last-child(2)").text().replace(/\s+/g, '');
    }
    else if (document.URL.search(editPageRegex) === 0)
    {
        dataURL = document.URL + '%s';
        levelCount = $(".level.collapsed:last-child .level-handle")[0].textContent;
    }
    else if ($(".levels.clearfix").length !== 0)
    {
        dataURL = document.URL + '%s';
        levelCount = $(".level:last-child .level-index")[0].textContent;
    }
    else
    {
        print("Unrelated page!");
        return;
    }

    PrepareUI();

    function PrepareUI()
    {
        var htmlButton = "<li><button class='tab' id='MemJS-Button' style='font-weight:bold;'>Download!</button></li>";
        var htmlMemJS =
            "<div id='MemJS-UI'>" +
            "<div id='MemJS-Header'>" +
            "<h3 id='MemJS-Title' style='display:inline;'>Loading...</h3>" +
            "<button style='float:right;'>Copy Data</button>" +
            "</div>" +
            "<textarea id='MemJS-TextArea' style='width:100%; height:222px;'></textarea>" +
            "</div>";

        $('ul.nav-pills').append(htmlButton);
        $('div.container-main').prepend(htmlMemJS);
        // $('#MemJS-UI').hide();

        $('#MemJS-Button').click(OnClick);
    }

    function OnClick()  // TODO
    {
        $('#MemJS-Button').unbind('click');
        $('#MemJS-Button').text("In progress...");

        step = 0;

        for (var i = 1; i <= levelCount; i++)
        {
            // @formatter:off
            $.ajax({
                dataType: 'html',
                url: dataURL.replace(/%s/, i),
                success: AbstractData,
                beforeSend: function (jqXHR, settings) { jqXHR.level = i; }
            });
            // @formatter:on
        }
    }

    function AbstractData(data, status, jqXHR) // TODO
    {
        step++;
        $('#MemJS-Title').html("Loading... " + step + "/" + levelCount);

        $(data).find("tbody.things > tr div.text").each(function (index)  // fixme!
        {
            // TODO
        });

        if (step === levelCount) OnFinish();
    }

    function OnFinish()  // TODO
    {
        $('#MemJS-Button').bind('click');
    }
})();

function print(string)
{
    console.log("[MEMJS] " + string);
}
