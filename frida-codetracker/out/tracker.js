"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackingData = void 0;
exports.startTracking = startTracking;
exports.startChronometer = startChronometer;
exports.stopTracking = stopTracking;
const vscode = __importStar(require("vscode"));
const extension_1 = require("./extension");
let activityTimeout;
let trackingData = {};
exports.trackingData = trackingData;
let currentFileType = '';
let startTime = 0;
let isFlatLined = true;
const FLATLINE_TIME = 5 * 60 * 1000;
function startTracking(context) {
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(onFileOpen));
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(onTextChange));
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(onFileSwitch));
    context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(onTextSelect));
}
function onFileOpen(document) {
    startChronometer(document.languageId);
}
function onTextChange(event) {
    continueChronometer(event.document.languageId);
}
function onFileSwitch(editor) {
    if (editor) {
        const fileType = editor.document.languageId;
        if (currentFileType === fileType) {
            continueChronometer(fileType); // Continue the existing chronometer
        }
        else {
            startChronometer(fileType); // Start a new chronometer for a different file type
        }
    }
}
function onTextSelect(event) {
    continueChronometer(event.textEditor.document.languageId);
}
function startChronometer(fileType) {
    stopChronometer();
    currentFileType = fileType;
    startTime = Date.now();
    activityTimeout = setTimeout(flatline, FLATLINE_TIME);
}
function continueChronometer(fileType) {
    if (isFlatLined = false) {
        startChronometer(fileType); // Restart the chronometer if had been flatlined
    }
    else {
        clearTimeout(activityTimeout);
        activityTimeout = setTimeout(flatline, FLATLINE_TIME);
    }
}
function stopChronometer() {
    if (startTime !== 0 && currentFileType) {
        const elapsedTime = Date.now() - startTime;
        const date = new Date().toLocaleDateString();
        if (trackingData[currentFileType]) {
            trackingData[currentFileType].time += elapsedTime;
        }
        else {
            trackingData[currentFileType] = { time: elapsedTime, date: date };
        }
        (0, extension_1.updateStatusBar)(); // Update status bar when time is logged
    }
    clearTimeout(activityTimeout);
    startTime = 0;
    currentFileType = '';
}
function flatline() {
    stopChronometer();
    vscode.window.showInformationMessage('Frida-CodeTracker: No activity detected for 5 minutes.');
    isFlatLined = true;
}
function stopTracking() {
    stopChronometer();
}
//# sourceMappingURL=tracker.js.map