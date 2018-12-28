#!/usr/bin/env node
// The above line tells OS that this is NOT a shell script, and needs a specific interpreter

// Using ES6 strict mode (not 100% needed, but ensure that the compiled JS is in strict mode)
'use strict';


// Local dependencies
import Viewer from "./viewer/Viewer";


// Main entry point for the viewer, check for an argument, 
// if not then launch a blank viewer

if (process.argv[2]) {
    // Perform the operations to attempt to read/open a file
    const viewer = new Viewer(process.argv[2]);
    console.log(`\nLoading file: ${process.argv[2]}...`);
} else {
    console.log('\n\nPlease provide a file to read.');
    console.log('\n\nUsage: tview [file name or path]')
}