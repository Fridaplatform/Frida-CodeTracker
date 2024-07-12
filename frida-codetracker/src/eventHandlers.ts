import * as vscode from 'vscode';
import { ActivityData, MostUsedFileData } from './interfaces';
import { trackMostUsedFile, activityData} from './tracker';
import { resetInactivityTimer } from './chronometer';


export const fileUsageData:ActivityData = {};

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

export { onFileOpen, onFileSwitch, onTextChange, onTextSelect };