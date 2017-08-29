// ==UserScript==
// @name          MemJS
// @version       0.6
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

var html = "https://raw.githubusercontent.com/Tayyib/MemJS/master/MemJS.html";
var editPageRegex = /.*\/edit\/.*/i;
var databasePageRegex = /.*\/edit\/database\/.*/i;
var columnDelimiter = '\t';
var data = [];
var dataURL;
var levelCount;
var step;

(function ()
{
    'use strict';

    if (document.URL.search(databasePageRegex) === 0)
    {
        dataURL = document.URL + '?page=%s';
        levelCount = Number($(".pagination-centered li:nth-last-child(2)").text().replace(/\s+/g, ''));
    }
    else if (document.URL.search(editPageRegex) === 0)
    {
        dataURL = document.URL + '%s';
        levelCount = Number($(".level.collapsed:last-child .level-handle")[0].textContent);
    }
    else if ($(".levels.clearfix").length !== 0)
    {
        dataURL = document.URL + '%s';
        levelCount = Number($(".level:last-child .level-index")[0].textContent);
    }
    else
    {
        print("Unrelated page!");
        return;
    }

    PrepareUI();

    function PrepareUI()
    {
        var htmlButton = "<li><button class='tab' id='MemJS-ShowHide' style='font-weight:bold;'>MemJS</button></li>";
        var htmlHolder = "<div class='MemJS-Holder'></div>";

        $('ul.nav-pills').append(htmlButton);
        $('div.container-main').prepend(htmlHolder);
        $('div.MemJS-Holder').load(html, function ()
        {
            $('#MemJS-UI').hide();
            $('#MemJS-TextArea').hide();
            $('#MemJS-CopyData').hide();
            $('#MemJS-ShowHide').click(ShowHideMemJS);
            $('#MemJS-Download').click(DoAjax);
        });
    }

    function ShowHideMemJS()
    {
        var ui = $('#MemJS-UI');

        if (ui.is(':visible') === true) ui.hide();
        else ui.show();
    }

    function DoAjax()
    {
        $('#MemJS-Download').hide();
        $('#MemJS-UI').show();
        $('#MemJS-Title').html("Preparing...");

        for (var i = 1; i <= levelCount; i++)
        {
            data[i] = "";
        }

        step = 1;

        for (i = 1; i <= levelCount; i++)
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

    function AbstractData(ddata, status, jqXHR)
    {
        $('#MemJS-Title').html("Loading... " + step + "/" + levelCount);

        $(ddata).find("tbody.things > tr.thing").each(function (index)  // fixme!
        {
            var columnMatch = $(this).find('div.text');  // fixme!
            columnMatch.each(function (index)
            {
                data[jqXHR.level] += $(this).text();
                if (index !== columnMatch.length - 1) data[jqXHR.level] += columnDelimiter;
            });

            data[jqXHR.level] += '\n';
        });

        if (step === levelCount) OnFinish();
        else step++;
    }

    function OnFinish()
    {
        $('#MemJS-CopyData').show();
        $("#MemJS-TextArea").append(data);
        $('#MemJS-TextArea').show();

        $('#MemJS-Title').text("Here is the course data (text only):");
    }
})();

function print(string)
{
    console.log("[MEMJS] " + string);
}
