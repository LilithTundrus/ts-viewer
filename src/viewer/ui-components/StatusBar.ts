// Using ES6 strict mode (not 100% needed, but ensure that the compiled JS is in strict mode)
'use strict';

// NPM dependencies
import * as blessed from 'blessed';
import Viewer from '../Viewer';

// This file contains one of the blessed components for constructing the UI in an effort to
// keep this project modular

// Create the statusBar box, a single-height box that spans the entire window,
// this part of the screen displays helpful information about the current status of
// the document 

