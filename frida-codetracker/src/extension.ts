// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { startTracking, stopTracking, trackingData, startChronometer } from './tracker';
import { getWebViewContent } from './webView';

let statusBarItem: vscode.StatusBarItem;

(function initializeComponents(){
	console.log('entered components');
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	statusBarItem.command = 'frida-codetracker.showData';
	statusBarItem.text = '${clock} Frida-CodeTracker: 0.00 min';
	statusBarItem.show();
	console.log('initialized components');
});

console.log('will it activate?');
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('entered activation');

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "frida-codetracker" is now active!');
	vscode.window.showInformationMessage('Frida-CodeTracker is now active! Tracking has started.');
	startTracking(context);

	context.subscriptions.push(statusBarItem);
	updateStatusBar();

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
			{}
		);
		panel.webview.html = getWebViewContent(trackingData);
	});

	context.subscriptions.push(disposable);
	startChronometer('initial');
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
    const formattedTime = (totalTime / 1000 / 60).toFixed(2); // Convert to minutes
    statusBarItem.text = `$(clock) Frida-CodeTracker: ${formattedTime} min`;
    statusBarItem.show();
}

export { updateStatusBar };
