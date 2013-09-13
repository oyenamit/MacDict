/* ***** BEGIN LICENSE BLOCK *****
 *
 * Copyright 2013 Namit Bhalla (oyenamit@gmail.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * The original code is the MacDict Firefox extension.
 *
 * ***** END LICENSE BLOCK ***** */


/*jslint browser: true, vars: true, white: true, indent: 4 */

"use strict";

// ---------------------------------------------------------------------------------------------------------
// The MacDict Namespace. 
// All functions and 'global' variables reside inside it.
// Define it if it has not been done before.
// ---------------------------------------------------------------------------------------------------------
if ( typeof NSMacDict === 'undefined' )
{
    var NSMacDict = {};
}


// ---------------------------------------------------------------------------------------------------------
// The BrowserOverlay object contains all variables and functions that are related 
// to browser overlay XUL.
// Define it if it has not been done before.
// ---------------------------------------------------------------------------------------------------------
if ( typeof NSMacDict.BrowserOverlay === 'undefined' )
{
    NSMacDict.BrowserOverlay = {};
}


// ---------------------------------------------------------------------------------------------------------
// The text selected by the user (with leading and trailing whitespace trimmed)
// ---------------------------------------------------------------------------------------------------------
NSMacDict.BrowserOverlay.mSelectedText = "";


// ---------------------------------------------------------------------------------------------------------
// This is a callback function that is invoked during "onLoad" event of the "window" object.
// It registers our method for the popup menu.
// ---------------------------------------------------------------------------------------------------------
NSMacDict.BrowserOverlay.init = function()
{
   var FirefoxContextMenu = document.getElementById("contentAreaContextMenu");
   if (FirefoxContextMenu)
   {
      FirefoxContextMenu.addEventListener("popupshowing", NSMacDict.BrowserOverlay.showHideContextMenuEntry, false);
   }

}; // NSMacDict.BrowserOverlay.init()


// ---------------------------------------------------------------------------------------------------------
// Decides if our entry into the Firefox context menu should be visible or not.
// ---------------------------------------------------------------------------------------------------------
NSMacDict.BrowserOverlay.showHideContextMenuEntry = function(aEvent)
{
    // When ANY menu popup is going to be shown (not just right click menu), this method will be called.
    // We need to process the event only if it was for the right click context menu.
    if (aEvent.target.id === "contentAreaContextMenu")
    {
        // Abbreviation for our namespace for a cleaner code.
        var nsbo                = NSMacDict.BrowserOverlay;

        var contextMenuEntry    = null;
        var canShowMenu         = false;

        nsbo.mSelectedText      = nsbo.getSelectedText(aEvent.target.triggerNode);
        canShowMenu             = (nsbo.mSelectedText !== "") && (nsbo.mSelectedText !== null);

        // Show the context menuitem only if user has selected some text in the browser.
        contextMenuEntry = document.getElementById("macdict-menuitem");
        if( contextMenuEntry )
        {
            contextMenuEntry.hidden = !canShowMenu;
        }
    }

}; // NSMacDict.BrowserOverlay.showHideContextMenuEntry()


// ---------------------------------------------------------------------------------------------------------
// Retrieves the text selected by the user.
// ---------------------------------------------------------------------------------------------------------
NSMacDict.BrowserOverlay.getSelectedText = function(triggerNode)
{
    var selectedText = "";

    // Retrieve the selected text directly from the content window.
    // If the selected text is inside a textbox or textarea, this method will not work.
    selectedText = content.getSelection().toString();

    // If the selected text is inside a textbox or textarea, we need a different way to retrieve it.
    if (selectedText === "" || selectedText === null)
    {
        if ( ("type" in triggerNode) && 
             ("selectionStart" in triggerNode) &&
             (triggerNode.type.toLowerCase() === "textarea" || 
              triggerNode.type.toLowerCase() === "text") )
        {
            var offsetStart = triggerNode.selectionStart;
            var offsetEnd   = triggerNode.selectionEnd;
            selectedText    = triggerNode.value.substr(offsetStart, offsetEnd - offsetStart);
        }
    }

    return selectedText.trim();

}; // NSMacDict.BrowserOverlay.getSelectedText()


// ---------------------------------------------------------------------------------------------------------
// This function is called when the user selects some text and invokes the dictionary lookup menuitem.
// It launches the Mac's built-in Dictionary application and looks up the selected text in it.
// The dict protocol is used to launch the application (For example, open dict://"ad nauseam")
// ---------------------------------------------------------------------------------------------------------
NSMacDict.BrowserOverlay.onLookupDict = function(aEvent)
{
    // Abbreviation for our namespace for a cleaner code.
    var nsbo        = NSMacDict.BrowserOverlay;

    var file        = null;
    var process     = null;
    var args        = [""];

    // create an nsIFile for the executable
    file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);
    file.initWithPath("/usr/bin/open");

    // create an nsIProcess
    process = Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);
    process.init(file);
    
    // Launch the process with selected text as an argument
    args = ["dict://" + nsbo.mSelectedText];
    process.run(false , args, args.length);  // false argument indicates that calling process should not be blocked.
    
}; // NSMacDict.BrowserOverlay.onLookupDict()


// ---------------------------------------------------------------------------------------------------------
// Register our initialization method so that is is called when the window finishes loading.
// ---------------------------------------------------------------------------------------------------------
window.addEventListener("load", NSMacDict.BrowserOverlay.init, false);
