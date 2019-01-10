// Using ES6 strict mode (not 100% needed, but ensure that the compiled JS is in strict mode)
'use strict';

// NPM dependencies
import * as blessed from 'blessed';
// Node dependencies
import * as fs from 'fs';
import * as path from 'path';
// Local dependencies
import { viewerState } from '../interfaces';
import TextArea from './ui-components/TextArea';


export default class Viewer {

    // State variable for handling state changes for the viewer/anything else that must be shared
    state: viewerState;

    // Variable for holding the given path to the file being viewed
    filePath: string;

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

    // This is the viewer's instance of the textArea class
    textArea: TextArea;
    // This is the viewer's instance of the statusBar class
    // statusBar: StatusBar;


    /** Creates an instance of Viewer.
     * @param {string} filePath
     * @memberof Viewer
     */
    constructor(filePath: string) {
        // Initialize the state of the viewer
        this.state = {
            currentPath: '',
            resolvedFilePath: '',
            relativePath: filePath,
            fileName: ''
        };

        // Set the relative path state for the viewer
        this.state.relativePath = filePath;
        // Set the current path state to the directory that the viewer was started from
        this.state.currentPath = __dirname;
        // Get the FULL path to the current file and set the path to the viewer's state
        let resolvedPath = path.resolve(this.state.currentPath, this.state.relativePath);
        this.state.resolvedFilePath = resolvedPath;
        // Get the file's name on its own and set the fileName viewer state variable
        let fileName = path.basename(this.state.resolvedFilePath);
        this.state.fileName = fileName;
    }

    start() {
        // First, make sure the path exists from the viewer state
        if (!fs.existsSync(this.state.relativePath)) {
            console.log(`\nFile ${this.state.relativePath} does not exist.`);
            process.exit(1);
        }

        // Variable to hold the contents of the file being read and used throughout the classs
        let contents: Buffer;

        // Try and read the file
        try {
            contents = fs.readFileSync(this.state.relativePath);
        }
        // Else, print an error that the file cannot be opened after starting the viewer
        catch (err) {
            console.log(`Could not read file ${this.state.relativePath}: ${err}`);
            process.exit(1);
        }

        let parsedContent: string;
        // Try to read the content as a buffer
        try {
            parsedContent = contents.toString();
        }
        // Else, print an error that the file cannot be opened
        catch (err) {
            console.log(`\nCould not convert buffer to string: ${err}`);
            return process.exit(0);
        }

        // Set the title of the terminal window (if any title bar exists)
        this.screen.title = `TVIEW - ${this.state.resolvedFilePath}`;

        // Initialize all classes needed to construct the base UI
        this.textArea = new TextArea(this, parsedContent);
        // this.statusBar = new StatusBar(this);

        // Set the label of the textArea to indicate what file is being viewed
        this.textArea.textArea.setLabel(`${this.state.fileName}`);

        // Append each UI element to the blessed screen
        this.screen.append(this.textArea.textArea);
        // this.screen.append(this.statusBar.statusBar);

        // Reset the cursor position before rendering the UI
        this.screen.program.getCursor((err, data) => {
            this.screen.program.cursorUp(this.screen.height);
            this.screen.program.cursorBackward(this.screen.width);
            // Put the cursor at line 1, column 1 of the viewing window, including the UI
            this.screen.program.cursorForward(1);
            this.screen.program.cursorDown(2);
        });

        // Render the screen so all changes are ensured to show up
        this.screen.render();
        // Focus the textArea to start so that the key listeners for the textarea are used
        this.textArea.textArea.focus();
    }
}
