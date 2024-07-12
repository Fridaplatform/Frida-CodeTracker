import * as vscode from 'vscode';
import { TrackingData} from './interfaces';


const FLATLINE_TIME = 5*60*1000;
const trackingData: TrackingData = {};
let currentChronometerId = 1;
let chronometerInterval: NodeJS.Timeout | undefined;
let activityTimeout: NodeJS.Timeout | undefined;
let statusBarItem:vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);;

function startChronometer(chronometerId: number){
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

function updateStatusBar(){
	let totalTime = 0;
    for (const fileType in trackingData) {
        totalTime += trackingData[fileType].time;
    }
	const totalSeconds = Math.floor(totalTime / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    statusBarItem.text = `$(clock) Frida-CodeTracker: ${formattedTime}`;
    statusBarItem.show();
}

export { trackingData, currentChronometerId, statusBarItem, startChronometer, stopChronometer, resetInactivityTimer, updateStatusBar };