import * as vscode from 'vscode';
import { updateStatusBar } from './extension';
import { TrackingData} from './interfaces';


const FLATLINE_TIME = 5*60*1000;
const trackingData: TrackingData = {};
let currentChronometerId = 1;
let chronometerInterval: NodeJS.Timeout | undefined;
let activityTimeout: NodeJS.Timeout | undefined;

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

export { trackingData, currentChronometerId, startChronometer, stopChronometer, resetInactivityTimer };