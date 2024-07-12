import { mostUsedFiles } from './tracker';
import { activityData } from './eventHandlers';
import { fileUsageData } from './eventHandlers';
import { TrackingData } from './interfaces';


function getWebViewContent(trackingData: TrackingData) {
    const chronometerLabels = Object.keys(trackingData);
    const chronometerData = chronometerLabels.map(label => trackingData[label].time / 1000 / 60); // Convert to minutes

    const activityLabels = Object.keys(activityData);
    const activityValues = activityLabels.map(label => activityData[label]);

    const fileTypeLabels = Object.keys(fileUsageData);
    const fileTypeData = fileTypeLabels.map(label => fileUsageData[label] / 60); // Convert to hours

    const mostUsedFileLabels: string[] = mostUsedFiles.map(file => file.name);
    const mostUsedFileData: number[] = mostUsedFiles.map(file => file.time / 1000 / 60); // Convert to minutes

    const chronometerPieChartConfig = {
        type: 'pie',
        data: {
            labels: chronometerLabels,
            datasets: [{
                data: chronometerData,
                backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56'],
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 32
                        }
                    }
                }
            }
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
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 32
                        }
                    }
                }
            }
        }
    };

    const fileTypePieChartConfig = {
        type: 'pie',
        data: {
            labels: fileTypeLabels,
            datasets: [{
                data: fileTypeData,
                backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56'],
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 32
                        }
                    }
                }
            }
        }
    };

    const mostUsedFileBarChartConfig = {
        type: 'bar',
        data: {
            labels: mostUsedFileLabels,
            datasets: [{
                label: 'Most Used Files',
                data: mostUsedFileData,
                backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56'],
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 32
                        }
                    }
                }
            }
        }
};

    const totalTime = chronometerData.reduce((a, b) => a + b, 0).toFixed(2);

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
                .chart-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin: 20px 0;
                }
                canvas {
                    width: 200px !important;
                    height: 200px !important;
                }
            </style>
        </head>
        <body>
            <h1>Frida Code Tracker</h1>
            <h2>Chronometer Chart</h2>
            <canvas id="chronometerChart"></canvas>
            <h2>Activity Chart</h2>
            <canvas id="activityChart"></canvas>
            <h2>File Type Chart</h2>
            <canvas id="fileTypeChart"></canvas>
            <h2>Most Used Files</h2>
            <canvas id="mostUsedFileChart"></canvas>
            <script>
                const ctxChronometer = document.getElementById('chronometerChart').getContext('2d');
                const chronometerChart = new Chart(ctxChronometer, ${JSON.stringify(chronometerPieChartConfig)});
                
                const ctxActivity = document.getElementById('activityChart').getContext('2d');
                const activityChart = new Chart(ctxActivity, ${JSON.stringify(activityPieChartConfig)});

                const ctxFileType = document.getElementById('fileTypeChart').getContext('2d');
                const fileTypeChart = new Chart(ctxFileType, ${JSON.stringify(fileTypePieChartConfig)});

                const ctxMostUsedFile = document.getElementById('mostUsedFileChart').getContext('2d');
                const mostUsedFileChart = new Chart(ctxMostUsedFile, ${JSON.stringify(mostUsedFileBarChartConfig)});
            </script>
        </body>
        </html>`;
}

export { getWebViewContent };
