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
exports.mostUsedFiles = exports.activityData = void 0;
exports.startTracking = startTracking;
exports.stopTracking = stopTracking;
exports.trackMostUsedFile = trackMostUsedFile;
const vscode = __importStar(require("vscode"));
const eventHandlers_1 = require("./eventHandlers");
const chronometer_1 = require("./chronometer");
const activityData = {
    'Opening Projects': 0,
    'Coding': 0,
    'File Switching': 0,
};
exports.activityData = activityData;
let mostUsedFiles = [];
exports.mostUsedFiles = mostUsedFiles;
function startTracking(context) {
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(eventHandlers_1.onFileOpen));
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(eventHandlers_1.onTextChange));
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(eventHandlers_1.onFileSwitch));
    context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(eventHandlers_1.onTextSelect));
    (0, chronometer_1.startChronometer)(chronometer_1.currentChronometerId);
}
function stopTracking() {
    (0, chronometer_1.stopChronometer)();
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
    const sorted = mostUsedFiles.sort((a, b) => b.time - a.time); // Sort by descending time
    console.log(sorted);
}
//# sourceMappingURL=tracker.js.map