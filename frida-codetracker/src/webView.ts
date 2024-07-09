import { TrackingData } from './tracker';

export function getWebViewContent(trackingData: TrackingData, activityData: { [key: string]: number }) {
    const filelabels = Object.keys(trackingData);
    const filedata = filelabels.map(label => trackingData[label].time / 1000 / 60); // Convert to minutes

    const activityLabels = Object.keys(activityData);
    const activityValues = activityLabels.map(label => activityData[label]);


    const filePieChartConfig = {
        type: 'pie',
        data: {
            labels: filelabels,
            datasets: [{
                data: filedata,
                backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56'],
            }]
        }
    };

    const activityPieChartConfig = {
        type: 'pie',
        data: {
            labels: activityLabels,
            datasets: [{
                data: activityValues,
                backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56'],
            }]
        }
    };

    const totalTime = filedata.reduce((a, b) => a + b, 0).toFixed(2);

    // Serialize trackingData to JSON
    const serializedData = JSON.stringify(trackingData);

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Frida Code Tracker</title>
            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
            <style>
                canvas {
                    width: 25% !important; /* Adjusts the width to 25% of its parent element */
                    height: 25%; /* Maintains aspect ratio */
                }
            </style>
        </head>
        <body>
            <h1>Frida Code Tracker</h1>
            <h2>Most Used File Types</h2>
            <canvas id="fileTypesChart"></canvas>
            <h2>General Activity</h2>
            <p>Total coding time: ${totalTime} min</p>
            <canvas id="activityChart"></canvas>
            <script>
                const ctxFileTypes = document.getElementById('fileTypesChart').getContext('2d');
                const fileTypesChart = new Chart(ctxFileTypes, ${JSON.stringify(filePieChartConfig)});

                const ctxActivity = document.getElementById('activityChart').getContext('2d');
                const activityChart = new Chart(ctxActivity, ${JSON.stringify(activityPieChartConfig)});
            </script>
        </body>
        </html>`;
}
