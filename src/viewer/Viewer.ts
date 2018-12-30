// Using ES6 strict mode (not 100% needed, but ensure that the compiled JS is in strict mode)
'use strict';

// NPM dependencies
import * as blessed from 'blessed';
import * as fs from 'fs';
import * as path from 'path';

// Local dependencies

export default class Viewer {

    // Variable for holding the given path to the file being viewed
    filePath: string;

    // The editor's 'state' is going to be something that evolves over time
    viewerState: string;

    // Create the blessed program object to associate with the blessed screen for the viewer
    program = blessed.program();

    // These are the cursor options for blessed. Declared as any since blessed's typings 
    // aren't correct
    private cursorOptions: any = {
        artificial: true,
        shape: 'line',
        blink: true,
        color: null
    };

    // Blessed's screen element for setting basic options about how the terminal should operate
    screen = blessed.screen({
        smartCSR: true,
        // Autopad screen elements unless no padding it explicitly required
        autoPadding: true,
        // Associate the generated program to the screen
        program: this.program,
        // Used, but often doesn't work in windows
        cursor: this.cursorOptions
    });

    constructor(filePath: string) {

    }


    start() {

    }
}