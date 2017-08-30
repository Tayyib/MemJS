// ==UserScript==
// @name          MemJS
// @version       0.8
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
var thingsMatch = [];
var promises = [];
var dataURL;
var levelCount;
var step;

(function ()
{
    'use strict';

    if (document.URL.search(databasePageRegex) === 0)
    {
        thingsMatch.push('tr.thing', 'div.text');

        dataURL = document.URL + '?page=%s';
        levelCount = Number($(".pagination-centered li:nth-last-child(2)").text().replace(/\s+/g, ''));
    }
    else if (document.URL.search(editPageRegex) === 0)
    {
        thingsMatch.push('tr.thing', 'div.text');  // fixme

        dataURL = document.URL + '%s';
        levelCount = Number($(".level.collapsed:last-child .level-handle")[0].textContent);
    }
    else if ($(".levels.clearfix").length !== 0)
    {
        thingsMatch.push('div.text-text', 'div[class^="col_"]');

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
            $('#MemJS-CopyData').click(CopyData);
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
            promises[i] = "";
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

    function AbstractData(data, status, jqXHR)
    {
        $('#MemJS-Title').html("Loading... " + step + "/" + levelCount);

        $(data).find(thingsMatch[0]).each(function (index)
        {
            var match = $(this).find(thingsMatch[1]);
            match.each(function (index)
            {
                promises[jqXHR.level] += $(this).text();
                if (index !== match.length - 1) promises[jqXHR.level] += columnDelimiter;
            });

            promises[jqXHR.level] += '\n';
        });

        if (step === levelCount) OnFinish();
        else step++;
    }

    function OnFinish()
    {
        $('#MemJS-CopyData').show();
        $("#MemJS-TextArea").append(promises);
        $('#MemJS-TextArea').show();

        $('#MemJS-Title').text("Here is the course data (text only):");
    }

    function CopyData()
    {
        $('#MemJS-TextArea').select();
        document.execCommand('copy');
    }
})();

function print(string)
{
    console.log("[MEMJS] " + string);
}
