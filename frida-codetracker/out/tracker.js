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
exports.activityData = exports.trackingData = void 0;
exports.startTracking = startTracking;
exports.stopTracking = stopTracking;
exports.startChronometer = startChronometer;
const vscode = __importStar(require("vscode"));
const extension_1 = require("./extension");
const trackingData = {};
exports.trackingData = trackingData;
const activityData = {
    'Opening Projects': 0,
    'Coding': 0,
    'File Switching': 0,
    'Text Selecting': 0,
};
exports.activityData = activityData;
let chronometerInterval;
let activityTimeout;
const FLATLINE_TIME = 5 * 60 * 1000;
function startTracking(context) {
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(onFileOpen));
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(onTextChange));
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(onFileSwitch));
    context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(onTextSelect));
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        const languageId = activeEditor.document.languageId;
        startChronometer(languageId);
    }
    else {
        startChronometer('initial');
    }
}
function stopTracking() {
    stopChronometer();
}
function onFileOpen(document) {
    resetInactivityTimer(document.languageId);
    activityData['Opening Projects'] += 1;
}
function onTextChange(event) {
    resetInactivityTimer(event.document.languageId);
    activityData['Coding'] += 1;
}
function onFileSwitch(editor) {
    if (editor) {
        resetInactivityTimer(editor.document.languageId);
        activityData['File Switching'] += 1;
    }
}
function onTextSelect(event) {
    if (event.textEditor) {
        resetInactivityTimer(event.textEditor.document.languageId);
        activityData['Text Selecting'] += 1;
    }
}
function startChronometer(languageId) {
    if (!trackingData[languageId]) {
        trackingData[languageId] = { time: 0, lastStart: 0 };
    }
    if (!chronometerInterval) {
        chronometerInterval = setInterval(() => {
            trackingData[languageId].time += 1000;
            (0, extension_1.updateStatusBar)();
        }, 1000);
    }
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
        startChronometer(languageId);
    }
    activityTimeout = setTimeout(() => {
        vscode.window.showInformationMessage('No activity detected, tracking stopped.');
        stopChronometer();
    }, FLATLINE_TIME);
}
//# sourceMappingURL=tracker.js.map