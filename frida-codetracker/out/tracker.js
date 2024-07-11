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
exports.mostUsedFiles = exports.fileUsageData = exports.activityData = exports.trackingData = void 0;
exports.startTracking = startTracking;
exports.stopTracking = stopTracking;
exports.startChronometer = startChronometer;
const vscode = __importStar(require("vscode"));
const extension_1 = require("./extension");
;
const trackingData = {};
exports.trackingData = trackingData;
const activityData = {
    'Opening Projects': 0,
    'Coding': 0,
    'File Switching': 0,
};
exports.activityData = activityData;
const fileUsageData = {};
exports.fileUsageData = fileUsageData;
let mostUsedFiles = [];
exports.mostUsedFiles = mostUsedFiles;
let chronometerInterval;
let activityTimeout;
const FLATLINE_TIME = 5 * 60 * 1000;
let currentChronometerId = 1;
function startTracking(context) {
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(onFileOpen));
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(onTextChange));
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(onFileSwitch));
    context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(onTextSelect));
    startChronometer(currentChronometerId);
}
function stopTracking() {
    stopChronometer();
}
function onFileOpen(document) {
    resetInactivityTimer(document.languageId);
    const fileData = {
        name: document.fileName,
        time: 1000 // Starting time, adjust as needed
    };
    trackMostUsedFile(fileData);
    activityData['Opening Projects'] += 1;
}
function onTextChange(event) {
    resetInactivityTimer(event.document.languageId);
    activityData['Coding'] += 1;
    const fileType = getFileType(event.document.fileName);
    if (!fileUsageData[fileType]) {
        fileUsageData[fileType] = 0;
    }
    fileUsageData[fileType] += 1;
}
function onFileSwitch(editor) {
    if (editor) {
        resetInactivityTimer(editor.document.languageId);
        activityData['File Switching'] += 1;
        const fileType = getFileType(editor.document.fileName);
        if (!fileUsageData[fileType]) {
            fileUsageData[fileType] = 0;
        }
        fileUsageData[fileType] += 1;
        const fileData = {
            name: editor.document.fileName,
            time: 1000 // Starting time, adjust as needed
        };
        trackMostUsedFile(fileData);
    }
    else {
        console.log('no active editor');
    }
}
function onTextSelect(event) {
    if (event.textEditor) {
        resetInactivityTimer(event.textEditor.document.languageId);
        const fileType = getFileType(event.textEditor.document.fileName);
        if (!fileUsageData[fileType]) {
            fileUsageData[fileType] = 0;
        }
        fileUsageData[fileType] += 1;
    }
}
function getFileType(fileName) {
    const extension = fileName.split('.').pop();
    return extension ? `.${extension}` : 'Unknown';
}
function trackMostUsedFile(file) {
    console.log('Tracking file:', file.name);
    const now = Date.now();
    const existingFileIndex = mostUsedFiles.findIndex(file => file.name === file.name);
    console.log(existingFileIndex);
    if (existingFileIndex !== -1) {
        const elapsedTime = now - mostUsedFiles[existingFileIndex].time;
        mostUsedFiles[existingFileIndex].time += elapsedTime; // Increase time spent in file
    }
    else {
        mostUsedFiles.push({ name: file.name, time: 1000 }); // Start tracking if not already tracked
    }
    const masamenos = mostUsedFiles.sort((a, b) => b.time - a.time); // Sort by descending time
    console.log(masamenos);
}
function startChronometer(chronometerId) {
    if (!trackingData[chronometerId]) {
        trackingData[chronometerId] = { time: 0, lastStart: 0 };
    }
    if (!chronometerInterval) {
        chronometerInterval = setInterval(() => {
            trackingData[chronometerId].time += 1000;
            (0, extension_1.updateStatusBar)();
        }, 1000);
    }
    currentChronometerId++;
}
function stopChronometer() {
    if (chronometerInterval) {
        clearInterval(chronometerInterval);
        chronometerInterval = undefined;
    }
}
function resetInactivityTimer(languageId) {
    if (activityTimeout) {
        clearTimeout(activityTimeout);
    }
    if (!chronometerInterval) {
        startChronometer(currentChronometerId);
    }
    activityTimeout = setTimeout(() => {
        vscode.window.showInformationMessage('No activity detected, tracking stopped.');
        stopChronometer();
    }, FLATLINE_TIME);
}
//# sourceMappingURL=tracker.js.map