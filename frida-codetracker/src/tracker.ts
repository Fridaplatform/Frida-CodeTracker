import * as vscode from 'vscode';
import { MostUsedFileData } from './interfaces';
import { onFileOpen, onFileSwitch, onTextChange, onTextSelect } from './eventHandlers';
import { currentChronometerId, startChronometer, stopChronometer} from './chronometer';

let mostUsedFiles: MostUsedFileData[] = [];

function startTracking(context: vscode.ExtensionContext){
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(onFileOpen));
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(onTextChange));
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(onFileSwitch));
    context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(onTextSelect));
    startChronometer(currentChronometerId);
}

function stopTracking(){
    stopChronometer();
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
    const sorted = mostUsedFiles.sort((a, b) => b.time - a.time); // Sort by descending time
    console.log(sorted);
}




export { startTracking, stopTracking, trackMostUsedFile, mostUsedFiles };