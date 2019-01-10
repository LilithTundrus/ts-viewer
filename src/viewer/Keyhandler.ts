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

    // The viewerInstance allows us to access features from the Editor class instance to do things
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
            // This visually keeps the cursor within bottom bound of the editing window,
            // accounting for the extra the statusbar height
            if (cursor.y < this.viewerInstance.screen.height - 1) {
                // If the cursor isn't at the bottom of the textArea, move it down by one
                this.viewerInstance.program.cursorDown();
                this.viewerInstance.screen.render();
                this.viewerInstance.textArea.verticalScrollOffset++;
            }
        });
    }

    homeHandler() {

    }

    endHandler() {

    }
}