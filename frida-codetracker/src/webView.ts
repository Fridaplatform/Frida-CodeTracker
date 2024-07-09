import { TrackingData } from './tracker';

export function getWebViewContent(trackingData: TrackingData) {
    const labels = Object.keys(trackingData);
    const data = labels.map(label => trackingData[label].time / 1000 / 60); // Convert to minutes

    const pieChartConfig = {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56'],
            }]
        }
    };

    const totalTime = data.reduce((a, b) => a + b, 0).toFixed(2);

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
                const fileTypesChart = new Chart(ctxFileTypes, ${JSON.stringify(pieChartConfig)});

                const ctxActivity = document.getElementById('activityChart').getContext('2d');
                const activityChart = new Chart(ctxActivity, ${JSON.stringify(pieChartConfig)});

                // Example of how to access serialized trackingData
                const data = ${serializedData};
                console.log(data); // Use data in JavaScript here
            </script>
        </body>
        </html>`;
}
