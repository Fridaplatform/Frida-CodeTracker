import * as vscode from 'vscode';
import { updateStatusBar } from './extension';

let activityTimeout: NodeJS.Timeout;
let trackingData: { [key: string]: { time: number, date:string} } = {};
let currentFileType: string = '';
let startTime: number= 0;
let isFlatLined: boolean = true;

const FLATLINE_TIME = 5*60*1000;

export function startTracking(context: vscode.ExtensionContext){
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(onFileOpen));
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(onTextChange));
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(onFileSwitch));
    context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(onTextSelect));
}

function onFileOpen(document: vscode.TextDocument){
    startChronometer(document.languageId);
}

function onTextChange(event: vscode.TextDocumentChangeEvent){
    continueChronometer(event.document.languageId);
}

function onFileSwitch(editor: vscode.TextEditor | undefined){
    if (editor) {
        const fileType = editor.document.languageId;
        if (currentFileType === fileType) {
            continueChronometer(fileType); // Continue the existing chronometer
        } else {
            startChronometer(fileType); // Start a new chronometer for a different file type
        }
    }
}

function onTextSelect(event: vscode.TextEditorSelectionChangeEvent){
    continueChronometer(event.textEditor.document.languageId);
}

export function startChronometer(fileType:string){
    stopChronometer();
    currentFileType = fileType;
    startTime = Date.now();
    activityTimeout = setTimeout(flatline, FLATLINE_TIME);
}

function continueChronometer(fileType:string){
    if(isFlatLined = false){
        startChronometer(fileType);// Restart the chronometer if had been flatlined
    }else {
        clearTimeout(activityTimeout);
        activityTimeout = setTimeout(flatline, FLATLINE_TIME);
    }
}

function stopChronometer(){
    if(startTime !== 0 && currentFileType){
        const elapsedTime = Date.now() -  startTime;
        const date = new Date().toLocaleDateString();
        if(trackingData[currentFileType]){
            trackingData[currentFileType].time += elapsedTime;
        }else{
            trackingData[currentFileType] = { time: elapsedTime, date: date};
        }
        updateStatusBar(); // Update status bar when time is logged
    }

    clearTimeout(activityTimeout);
    startTime = 0;
    currentFileType = '';
}

function flatline(){
    stopChronometer();
    vscode.window.showInformationMessage('Frida-CodeTracker: No activity detected for 5 minutes.');
    isFlatLined = true;
}

export function stopTracking(){
    stopChronometer();
}

export { trackingData };