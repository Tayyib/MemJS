// ==UserScript==
// @name          MemJS
// @version       1.1
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
Forked from github.com/scytalezero/MemriseUtilities.
Refactored and added some new features:
 * UI improvements
 * Customizable options
 * Download option for course creators
 */

var html = "https://raw.githubusercontent.com/Tayyib/MemJS/master/MemJS.html";
var databasePageRegex = /.*\/edit\/database\/.*/i;
var thingMatch = [];
var promises = [];
var dataURL;
var levelCount;
var delimiter;
var setTag;
var step;

(function ()
{
    'use strict';

    if (document.URL.search(databasePageRegex) === 0)
    {
        thingMatch.push('tr.thing', 'div.text');

        dataURL = document.URL + '?page=%s';
        levelCount = Number($(".pagination-centered li:nth-last-child(2)").text().replace(/\s+/g, ''));
    }
    else if ($(".levels.clearfix").length !== 0)
    {
        thingMatch.push('div.text-text', 'div[class^="col_"]');

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
            $('#MemJS-CopyData').hide().on('click', CopyData);
            $('#MemJS-ShowHide').on('click', ToggleUI);
            $('#MemJS-Download').on('click', DoAjax);

            // TODO! Sensitive content - DO NOT FORGET to update the following line when you modify "thingMatch[]".
            if (thingMatch[0] === 'tr.thing') $('#MemJS-CheckBox, label').hide();
        });
    }

    function ToggleUI()
    {
        $('#MemJS-UI').toggle();
    }

    function DoAjax()
    {
        $('#MemJS-Download').hide();
        $('#MemJS-UI').show();
        $('#MemJS-Title').text("Preparing...");

        for (var i = 1; i <= levelCount; i++)
        {
            promises[i] = "";
        }

        step = 1;
        delimiter = $('#MemJS-ComboBox').val();
        setTag = $('#MemJS-CheckBox').is(':checked');

        for (i = 1; i <= levelCount; i++)
        {
            $.ajax({
                dataType: 'html',
                url: dataURL.replace(/%s/, i),
                success: AbstractData,
                beforeSend: function (jqXHR, settings) { jqXHR.level = i; }
            });
        }
    }

    function AbstractData(data, status, jqXHR)
    {
        $('#MemJS-Title').text("Loading... " + step + "/" + levelCount);

        var levelName = setTag ? delimiter + $(data).find('h3.progress-box-title').text().trim() : '';

        $(data).find(thingMatch[0]).each(function ()  // foreach -> things
        {
            var columns = $(this).find(thingMatch[1]).map(function () { return $(this).text(); }).get();
            promises[jqXHR.level] += columns.join(delimiter) + levelName + '\n';
        });

        if (step === levelCount) OnFinish();
        else step++;
    }

    function OnFinish()
    {
        $('#MemJS-CopyData').show();
        $("#MemJS-TextArea").append(promises).show();

        $('#MemJS-Title').text("Here is the course data (text only):");
    }

    function CopyData()
    {
        $('#MemJS-TextArea').trigger('select');
        document.execCommand('copy');
    }
})();

function print(string)
{
    console.log("[MEMJS] " + string);
}
