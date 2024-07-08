import * as vscode from 'vscode';
import { TrackingData } from './tracker';

export function getWebViewContent(trackingData: TrackingData): string {
    let content = `
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
            }
            .chart {
                width: 600px;
                height: 400px;
            }
        </style>
    </head>
    <body>
        <h1>Frida Code Tracker</h1>
        <div class="chart">
            <h2>Most Used File Types</h2>
            <ul>
    `;

    for (const fileType in trackingData) {
        content += `<li>${fileType}: ${(trackingData[fileType].time / 1000 / 60).toFixed(2)} min</li>`;
    }

    content += `
            </ul>
        </div>
        <div class="chart">
            <h2>General Activity</h2>
            <p>Total coding time: ${(Object.values(trackingData).reduce((acc, { time }) => acc + time, 0) / 1000 / 60).toFixed(2)} min</p>
        </div>
    </body>
    </html>
    `;

    return content;
}

