import * as vscode from 'vscode';
import { updateStatusBar } from './extension';

export interface TrackingData{
    [key:string]:{
        time: number;
        lastStart: number | null;
    };
}

const trackingData: TrackingData = {};

let chronometerInterval: NodeJS.Timeout | undefined;
let activityTimeout: NodeJS.Timeout | undefined;

const FLATLINE_TIME = 5*60*1000;

export function startTracking(context: vscode.ExtensionContext){
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(onFileOpen));
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(onTextChange));
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(onFileSwitch));
    context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(onTextSelect));
    startChronometer('initial');
}

export function stopTracking(){
    stopChronometer();
}

function onFileOpen(document: vscode.TextDocument){
    resetInactivityTimer(document.languageId);
}

function onTextChange(event: vscode.TextDocumentChangeEvent){
    resetInactivityTimer(event.document.languageId);
}

function onFileSwitch(editor: vscode.TextEditor | undefined){
    if (editor) {
        resetInactivityTimer(editor.document.languageId);
        } 
    }

function onTextSelect(event: vscode.TextEditorSelectionChangeEvent){
    if(event.textEditor){
        resetInactivityTimer(event.textEditor.document.languageId);
    }
}

export function startChronometer(languageId: string){
    if(!trackingData[languageId]){
        trackingData[languageId] = { time: 0, lastStart: 0 };
    }

    if(!chronometerInterval){
        chronometerInterval = setInterval(() => {
            trackingData[languageId].time += 1000;
            updateStatusBar();
        },1000);
    }
}


function stopChronometer(){
    if(chronometerInterval){
        clearInterval(chronometerInterval);
        chronometerInterval = undefined;
    }
}

function resetInactivityTimer(languageId:string){
    if(activityTimeout){
        clearTimeout(activityTimeout);
    }

    if(!chronometerInterval){
        startChronometer(languageId);
    }

    activityTimeout = setTimeout(() => {
        vscode.window.showInformationMessage('No activity detected, tracking stopped.');
        stopChronometer();
    }, FLATLINE_TIME);
}




export { trackingData };