import * as vscode from 'vscode';
import { updateStatusBar } from './extension';

export interface TrackingData{
    [key:string]:{
        time: number;
        lastStart: number | null;
    };
}

export interface ActivityData{[key:string]:number};

export interface MostUsedFileData{
    name:string;
    time:number;
}

const trackingData: TrackingData = {};
const activityData: ActivityData = {
    'Opening Projects': 0,
    'Coding' : 0,
    'File Switching': 0,
};

const fileUsageData:ActivityData = {};
let mostUsedFiles: MostUsedFileData[] = [];

let chronometerInterval: NodeJS.Timeout | undefined;
let activityTimeout: NodeJS.Timeout | undefined;

const FLATLINE_TIME = 5*60*1000;
let currentChronometerId = 1;

export function startTracking(context: vscode.ExtensionContext){
    
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(onFileOpen));
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(onTextChange));
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(onFileSwitch));
    context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(onTextSelect));
    startChronometer(currentChronometerId);
}

export function stopTracking(){
    stopChronometer();
}

function onFileOpen(document: vscode.TextDocument){
    resetInactivityTimer(document.languageId);
    const fileData: MostUsedFileData = {
        name: document.fileName,
        time: 1000 // Starting time, adjust as needed
    };
    trackMostUsedFile(fileData);
    activityData['Opening Projects'] += 1;

    
}

function onTextChange(event: vscode.TextDocumentChangeEvent){
    resetInactivityTimer(event.document.languageId);
    activityData['Coding'] +=1;

    const fileType = getFileType(event.document.fileName);
    if (!fileUsageData[fileType]) {
        fileUsageData[fileType] = 0;
    }
    fileUsageData[fileType] += 1;
}

function onFileSwitch(editor: vscode.TextEditor | undefined){
    if (editor) {
        resetInactivityTimer(editor.document.languageId);
        activityData['File Switching'] +=1;

        const fileType = getFileType(editor.document.fileName);
        if (!fileUsageData[fileType]) {
            fileUsageData[fileType] = 0;
        }
        fileUsageData[fileType] += 1;

        const fileData: MostUsedFileData = {
            name: editor.document.fileName,
            time: 1000 // Starting time, adjust as needed
        };

        trackMostUsedFile(fileData);
    }else{
        console.log('no active editor');
    }
    }

function onTextSelect(event: vscode.TextEditorSelectionChangeEvent){
    if(event.textEditor){
        resetInactivityTimer(event.textEditor.document.languageId);

        const fileType = getFileType(event.textEditor.document.fileName);
        if (!fileUsageData[fileType]) {
            fileUsageData[fileType] = 0;
        }
        fileUsageData[fileType] += 1;
    }
}

function getFileType(fileName: string): string {
    const extension = fileName.split('.').pop();
    return extension ? `.${extension}` : 'Unknown';
}

function trackMostUsedFile(file: MostUsedFileData) {
    console.log('Tracking file:', file.name);
    const now = Date.now();
    const existingFileIndex = mostUsedFiles.findIndex(file => file.name === file.name);
    console.log(existingFileIndex);
    if (existingFileIndex !== -1) {
        const elapsedTime = now - mostUsedFiles[existingFileIndex].time;
        mostUsedFiles[existingFileIndex].time += elapsedTime; // Increase time spent in file
    } else {
        mostUsedFiles.push({ name: file.name, time: 1000 }); // Start tracking if not already tracked
    }
    const masamenos = mostUsedFiles.sort((a, b) => b.time - a.time); // Sort by descending time
    console.log(masamenos);
}

export function startChronometer(chronometerId: number){
    if(!trackingData[chronometerId]){
        trackingData[chronometerId] = { time: 0, lastStart: 0 };
    }

    if(!chronometerInterval){
        chronometerInterval = setInterval(() => {
            trackingData[chronometerId].time += 1000;
            updateStatusBar();
        },1000);
    }
    currentChronometerId ++;
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
        startChronometer(currentChronometerId);
    }

    activityTimeout = setTimeout(() => {
        vscode.window.showInformationMessage('No activity detected, tracking stopped.');
        stopChronometer();
    }, FLATLINE_TIME);
}



export { trackingData, activityData, fileUsageData, mostUsedFiles };