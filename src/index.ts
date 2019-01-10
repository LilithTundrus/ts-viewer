#!/usr/bin/env node
// The above line tells OS that this is NOT a shell script, and needs a specific interpreter

// Using ES6 strict mode (not 100% needed, but ensure that the compiled JS is in strict mode)
'use strict';

// Local dependencies
import Viewer from './viewer/Viewer';

// Main entry point for the viewer, check for an argument, 
// if not then launch a blank viewer
if (process.argv[2]) {
    // Create a new viewer instance to set up the state for the viewer
    const viewer = new Viewer(process.argv[2]);
    // In case the file is large, log that it is being loaded
    console.log(`\nLoading file: ${process.argv[2]}...`);
    // This method call will attempt to read the file and build the UI for viewing text
    // If anything goes wrong the viewer will exit and print an error
    viewer.start();
} else {
    // TODO: This should launch a viewer with a message about opening a file/etc.
    console.log('\n\nPlease provide a file to read.');
    console.log('\n\nUsage: tview [file name or path]');
}