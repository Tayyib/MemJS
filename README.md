# MemJS
An unofficial Memrise utility allowing Memrise users and creators to download courses (only text data).

# Installation
First, you will need to install Tampermonkey add-on for your browser:
- [for Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- [for Firefox](https://addons.mozilla.org/en-us/firefox/addon/tampermonkey/) 
 
Next, [just click here](https://github.com/Tayyib/MemJS/raw/master/MemJS.user.js) 
and you should be prompted to install the script. That's it!

# Features & Instruction
Currently, MemJS only adds the ability to export the list of text data from a Memrise course.
Once the script is installed, navigating to the main/database page of a course will add a new "MemJS" button 
which shows and hides MemJS UI.

![Screenshot1](/Images/Instruction1.png)

Just click "Download" and wait for process to finish. Once that is complete, a textarea will appear with a 
tab-separated (or comma-separated according to your choice) list of words, definitions and other text columns 
of your course (if you download from a database page).

![Screenshot2](/Images/Instruction2.png)

Simply click "Copy to clipboard", and paste it into another app such as LWT.
You can also save the list as a file and it will import into Anki to create a deck.
