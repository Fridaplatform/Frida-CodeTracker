"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebViewContent = getWebViewContent;
function getWebViewContent(trackingData) {
    const chartData = JSON.stringify(trackingData);
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
            <canvas id="fileTypeChart" width="400" height="200"></canvas>
            <script>
                const ctx = document.getElementById('fileTypeChart').getContext('2d');
                const data = ${chartData};
                const labels = Object.keys(data);
                const values = Object.values(data).map(item => item.time);
                const dates = Object.values(data).map(item => item.date);

                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Time Spent (ms)',
                            data: values,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    afterLabel: function(context) {
                                        return 'Date: ' + dates[context.dataIndex];
                                    }
                                }
                            }
                        }
                    }
                });
            </script>
        </body>
        </html>
    `;
}
//# sourceMappingURL=webView.js.map