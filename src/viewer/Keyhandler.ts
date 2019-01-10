// Using ES6 strict mode (not 100% needed, but ensure that the compiled JS is in strict mode)
'use strict';

// Node/NPM dependencies
import Viewer from './Viewer';


// Used for debugging
import * as fs from 'fs';
import { program } from 'blessed';

// This file contains the class for handling key events for the viewer's class's
// textArea UI component

export default class KeyHandler {

    // The viewerInstance allows us to access features from the Viewer class instance to do things
    // like change state, etc.
    private viewerInstance: Viewer;

    constructor(viewerInstance: Viewer) {
        this.viewerInstance = viewerInstance;
    }

    leftArrowHandler() {

    }

    rightArrowHandler() {

    }

    upArrowHandler() {

    }

    downArrowHandler() {
        // This callback returns an err and data object, the data object has the x/y position 
        // of the cursor
        this.viewerInstance.program.getCursor((err: any, cursor: any) => {
            // This visually keeps the cursor within bottom bound of the viewing window,
            // accounting for the extra the statusbar height
            if (cursor.y < this.viewerInstance.screen.height - 1) {
                // If the cursor isn't at the bottom of the textArea, move it down by one
                this.viewerInstance.program.cursorDown();
                this.viewerInstance.screen.render();
                this.viewerInstance.textArea.verticalScrollOffset++;
            }
            // Scroll the text down by one if the cursor is at the bottom of the textArea
            else if (cursor.y == this.viewerInstance.screen.height - 1) {
                if (this.viewerInstance.textArea.textArea.getScrollPerc() !== 100) {

                    // Scroll the textArea down by one
                    this.viewerInstance.textArea.textArea.scroll(1);
                    // Ensure the scroll rendered before the text reform function is called
                    this.viewerInstance.screen.render();

                    // Make sure that the next line is on the right horizontal scroll index
                    this.viewerInstance.textArea.reformTextDownArrow();
                    // Render the text reform
                    this.viewerInstance.screen.render();

                    // Keep the cursor in its previous position
                    // For some reason setting y to 2 here scrolls more 'smoothly' than 3
                    // (less cursor jank)
                    let relativeBottomHeight = this.viewerInstance.screen.height - 2;
                    this.viewerInstance.program.cursorPos(relativeBottomHeight, cursor.x - 1);
                    // Render the cursor change
                    this.viewerInstance.screen.render();
                    // Increase the verticalScrollOffset by one to match the blessed scroll index
                    this.viewerInstance.textArea.verticalScrollOffset++;
                    this.viewerInstance.textArea.internalVerticalOffset++;
                } else {
                    // TODO: Visually indicate that the end of the file has been reached
                }
            }
        });
    }

    homeHandler() {

    }

    endHandler() {

    }
}