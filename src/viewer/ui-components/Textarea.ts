// Using ES6 strict mode (not 100% needed, but ensure that the compiled JS is in strict mode)
'use strict';

// Node dependencies
import * as blessed from 'blessed';
// Local dependencies
import Viewer from '../Viewer';
import KeyHandler from '../KeyHandler';


// This file contains one of the blessed components for constructing the UI in an effort to
// keep this project modular

// Create the textArea textbox, where the text being viewed will be displayed

export default class TextArea {

    // The viewerInstance allows us to access features from the Viewer class instance to do things
    // like change state, etc.
    private viewerInstance: Viewer;
    private content: any;
    // The shadowContent will be used to update the actual text of the file
    // For example, any time a line's content is change, it will first occur
    // in the shadow content and THEN be visually updated on the screen.
    shadowContent: string[];

    // Used to store the offset of the horizontal view of the text being viewed
    viewOffSet: number;
    textArea: blessed.Widgets.BoxElement;

    keyHandler: KeyHandler;
    // Used to store the vertical offset from the first line
    verticalScrollOffset: number = 0;
    // Used to keep a way to get visible lines
    internalVerticalOffset: number = 0;

    constructor(viewerInstance: Viewer, content) {

        this.viewerInstance = viewerInstance;
        this.content = content;
        this.keyHandler = new KeyHandler(viewerInstance);

        // Create the textArea blessed box (declared as any due to some typings being incorrect)
        this.textArea = blessed.box(<any>{
            // Parent option for the component, controls how the element interacts with others
            parent: this.viewerInstance.screen,

            // Component relative position options

            // The top of this element should be the parent width plus 1
            top: 1,


            // Component size options

            // Keep the width of this element to 100% of the screen
            width: '100%+1',
            // Height should be the entire screen minus 1 because of the statusBar 
            // (not doing this would hide part of the text entry window)
            height: '100%-1',


            // Key related options

            // Allow input of the element
            input: true,
            // Dissallow default key mappings
            keys: false,
            // Set the element to support all key inputs
            keyable: true,


            // Content control options

            // Don't capture SGR blessed escape codes, that could cause issues
            tags: false,
            // Don't shrink the text box if the window resizes
            shrink: false,
            // Dissallow text to wrap down the the next line (not documented but still works)
            wrap: false,
            visible: true,


            // Alignment options

            // Left align the text for this element
            align: 'left',


            // Scrolling options

            // Allow the element to be scrollable
            scrollable: true,
            // Always allow the element to be scrollable, even if the content is shorter
            // than the height of the windows
            alwaysScroll: true,
            // Scrollbar styles, using extended characters here to 
            // represent the scroll location character
            scrollbar: {
                ch: '█',
                track: {
                    bg: 'black',
                    ch: '░'
                },
            },
            // Limit the maximum content to 16,000 lines (at least initially)
            baseLimit: 16000,


            // Border options

            border: {
                type: 'line'
            },


            // Styling options

            // This style matches the DOS edit theme
            style: {
                fg: 'bold',
                bg: 'blue',
                border: {
                    fg: 'light-grey',
                },
                label: {
                    fg: 'black',
                    bg: 'light-grey'
                }
            },

            // Content/label options

            // The label is a string that sits on the top left corner of the element,
            // this is similar to a title windows
            label: this.viewerInstance.filePath,
            // The content is what text the box should display
            content: this.content,
        });

        // Use the private method to reigster the key listeners for the textArea when focused
        this.registerKeyListeners();

        // This is the TRUE content of the file being viewed, not effected by the viewing window
        this.shadowContent = this.textArea.getLines();
    }


    /** Register the key listeners for the textArea element
     * @private
     * @memberof TextArea
     */
    private registerKeyListeners() {

        // Quit on Control-W
        // TODO: This should be aware of whether or not the editor has a file that isn't saved/etc.
        this.textArea.key(['C-w'], () => {
            return process.exit(0);
        });

        this.textArea.key('left', () => {
            this.keyHandler.leftArrowHandler();
        });

        this.textArea.key('right', () => {
            this.keyHandler.rightArrowHandler();
        });

        this.textArea.key('up', () => {
            this.keyHandler.upArrowHandler();
        });

        this.textArea.key('down', () => {
            this.keyHandler.downArrowHandler();
        });

        this.textArea.key('home', () => {
            // this.keyHandler.homeHandler();
        });

        this.textArea.key('end', () => {
            // this.keyHandler.endHandler();
        });

    }

    // This function ensures that on a vertical scroll, the previous line is still on the right
    // horizontal view offset
    reformTextDownArrow() {
        // Get all currently visible lines as an array
        let visibleLines = this.getVisibleLines();
        // Get the next line index to what is currently visible
        let nextVisibleLineIndex = visibleLines.length + this.internalVerticalOffset;

        // Get the 'true' text of the next line, plus the view offset
        let trueContent = this.shadowContent[nextVisibleLineIndex].substring(this.viewOffSet);
        // Set the line to the 'true' content before it is seen
        this.textArea.setLine(nextVisibleLineIndex, trueContent);
    }

    /** Return the visible lines of the textArea as an array
     * @returns
     * @memberof TextArea
     */
    getVisibleLines() {
        let visibleLines = [];
        // Relative height of the textArea itself
        let textAreaRelativeHeight = this.textArea.height - 2;
        // Offset is just shorthand for the class's vertical offset
        let offset = this.internalVerticalOffset;

        for (let i = offset; i < textAreaRelativeHeight + offset; i++) {
            // Push the current line to the temporary array
            visibleLines.push(this.textArea.getLine(i));
        }
        return visibleLines;
    }

    // Basic function to get the scrolling cursor offset (used frequently for each key handler)
    calculateScrollingOffset(cursor) {
        // Get the cursor position relative to the textArea (minus the menubar and the texarea's borders)
        let cursorYRelative = cursor.y - 3;
        // Position of the cursor relative to the BOTTOM of the textArea
        let cursorYFromRelativeBottom = this.textArea.height - cursorYRelative;

        // getscroll() is the LAST line of the textarea
        // For some the cursor.y relative offset must be removed (add 3)
        let currentLineScrollOffset = this.textArea.getScroll() - cursorYFromRelativeBottom + 3;

        if (this.textArea.getScroll() == 0) {
            currentLineScrollOffset = cursorYRelative;
        }

        return this.verticalScrollOffset;
    }
}