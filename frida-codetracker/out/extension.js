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
exports.activate = activate;
exports.deactivate = deactivate;
exports.updateStatusBar = updateStatusBar;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const tracker_1 = require("./tracker");
Object.defineProperty(exports, "trackingData", { enumerable: true, get: function () { return tracker_1.trackingData; } });
const webView_1 = require("./webView");
let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
(function initializeComponents() {
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'frida-codetracker.showData';
    statusBarItem.text = '${clock} Frida-CodeTracker: 0:00 min';
    statusBarItem.show();
});
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "frida-codetracker" is now active!');
    vscode.window.showInformationMessage('Frida-CodeTracker is now active! Tracking has started.');
    (0, tracker_1.startTracking)(context);
    console.log('started Tracking');
    updateStatusBar();
    context.subscriptions.push(statusBarItem);
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand('frida-codetracker.showData', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        const panel = vscode.window.createWebviewPanel('fridaCodeTracker', ' frida code tracker', vscode.ViewColumn.One, {
            enableScripts: true
        });
        panel.webview.html = (0, webView_1.getWebViewContent)(tracker_1.trackingData, tracker_1.activityData);
    });
    context.subscriptions.push(disposable);
}
// This method is called when your extension is deactivated
function deactivate() {
    (0, tracker_1.stopTracking)();
}
function updateStatusBar() {
    let totalTime = 0;
    for (const fileType in tracker_1.trackingData) {
        totalTime += tracker_1.trackingData[fileType].time;
    }
    const totalSeconds = Math.floor(totalTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    statusBarItem.text = `$(clock) Frida-CodeTracker: ${formattedTime} min`;
    statusBarItem.show();
}
//# sourceMappingURL=extension.js.map