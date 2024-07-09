// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { startTracking, stopTracking, trackingData } from './tracker';
import { getWebViewContent } from './webView';

let statusBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);

(function initializeComponents(){
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.command = 'frida-codetracker.showData';
	statusBarItem.text = '${clock} Frida-CodeTracker: 0:00 min';
	statusBarItem.show();
});

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "frida-codetracker" is now active!');
	vscode.window.showInformationMessage('Frida-CodeTracker is now active! Tracking has started.');
	startTracking(context);
	console.log('started Tracking');

	updateStatusBar();
	context.subscriptions.push(statusBarItem);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('frida-codetracker.showData', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const panel = vscode.window.createWebviewPanel(
			'fridaCodeTracker',
			' frida code tracker',
			vscode.ViewColumn.One,
			{
				enableScripts : true
			}
		);
		panel.webview.html = getWebViewContent(trackingData);
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {
	stopTracking();
}

function updateStatusBar(){
	let totalTime = 0;
    for (const fileType in trackingData) {
        totalTime += trackingData[fileType].time;
    }
	const totalSeconds = Math.floor(totalTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    statusBarItem.text = `$(clock) Frida-CodeTracker: ${formattedTime} min`;
    statusBarItem.show();
}

export { updateStatusBar, trackingData };
