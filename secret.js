const express = require('express');
const router = express.Router();

// Secret dashboard route masked as an i-Ready student portal page
router.get('/home', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>i-Ready - Student Dashboard</title>
            <link rel="icon" type="image/png" href="images/favicon.png">
            <style>
                body { 
                    background-color: #121212; 
                    color: #00ffcc; 
                    font-family: Arial, sans-serif; 
                    text-align: center; 
                    padding-top: 100px; 
                    margin: 0;
                    position: relative;
                    min-height: 100vh;
                }
                h1 { font-size: 3rem; text-shadow: 0 0 10px #00ffcc; }
                p { font-size: 1.2rem; color: #ffffff; }
                a { color: #ff00ff; text-decoration: none; font-weight: bold; }

                /* Top-right corner container for separate bubbles */
                .status-bar {
                    position: absolute;
                    top: 20px;
                    right: 25px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                /* Individual larger bubble styling */
                .status-bubble {
                    background: rgba(255, 255, 255, 0.08);
                    padding: 12px 20px;
                    border-radius: 30px;
                    border: 1px solid rgba(0, 255, 204, 0.3);
                    font-size: 1.1rem;
                    font-weight: bold;
                    color: #00ffcc;
                    letter-spacing: 0.5px;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
            </style>
        </head>
        <body>
            <!-- Top Corner Status Bar with Live Ping Color Indicator -->
            <div class="status-bar">
                <div class="status-bubble" id="live-clock">--:-- --</div>
                <div class="status-bubble" id="ping-bubble"><span id="ping-icon">🟢</span> <span id="ping-text">-- ms</span></div>
                <div class="status-bubble">⚡ <span id="battery-level">98%</span></div>
            </div>

            <h1>Welcome to the Secret Zone</h1>
            <p>You have successfully bypassed authorization using the hidden credentials.</p>
            <br>
            <a href="/">Log out</a>

            <script>
                // Live ticking clock script
                function updateClock() {
                    const now = new Date();
                    let hours = now.getHours();
                    const minutes = now.getMinutes().toString().padStart(2, '0');
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12;
                    hours = hours ? hours : 12; 
                    document.getElementById('live-clock').innerText = hours + ':' + minutes + ' ' + ampm;
                }
                updateClock();
                setInterval(updateClock, 1000);

                // Live dynamic ping checker script
                function checkPing() {
                    const startTime = performance.now();
                    // Fetches a tiny resource or header to calculate latency
                    fetch('/i-ready/home', { method: 'HEAD', cache: 'no-store' })
                        .then(() => {
                            const duration = Math.round(performance.now() - startTime);
                            const pingText = document.getElementById('ping-text');
                            const pingIcon = document.getElementById('ping-icon');
                            
                            pingText.innerText = duration + ' ms';

                            // Change color emoji based on latency thresholds
                            if (duration < 100) {
                                pingIcon.innerText = '🟢'; // Green for low ping
                            } else if (duration < 300) {
                                pingIcon.innerText = '🟡'; // Yellow for medium ping
                            } else {
                                pingIcon.innerText = '🔴'; // Red for high ping
                            }
                        })
                        .catch(() => {
                            document.getElementById('ping-text').innerText = 'Error';
                            document.getElementById('ping-icon').innerText = '🔴';
                        });
                }
                
                checkPing();
                setInterval(checkPing, 5000); // Check ping every 5 seconds

                // Fetch real device battery if supported by browser
                if (navigator.getBattery) {
                    navigator.getBattery().then(function(battery) {
                        function updateBattery() {
                            document.getElementById('battery-level').innerText = Math.round(battery.level * 100) + '%';
                        }
                        updateBattery();
                        battery.addEventListener('levelchange', updateBattery);
                    });
                }
            </script>
        </body>
        </html>
    `);
});

module.exports = router;
