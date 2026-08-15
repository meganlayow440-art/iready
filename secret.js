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

                /* Top-right corner status bar */
                .status-bar {
                    position: absolute;
                    top: 15px;
                    right: 25px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    background: rgba(255, 255, 255, 0.05);
                    padding: 8px 15px;
                    border-radius: 20px;
                    border: 1px solid rgba(0, 255, 204, 0.2);
                    font-size: 0.9rem;
                    color: #00ffcc;
                    letter-spacing: 0.5px;
                }

                .status-item {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
            </style>
        </head>
        <body>
            <!-- Top Corner Status Bar (Time, Battery, Wifi) -->
            <div class="status-bar">
                <div class="status-item" id="live-clock">--:-- --</div>
                <div class="status-item">📶 5G</div>
                <div class="status-item">⚡ <span id="battery-level">98%</span></div>
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
                    hours = hours ? hours : 12; // the hour '0' should be '12'
                    document.getElementById('live-clock').innerText = hours + ':' + minutes + ' ' + ampm;
                }
                updateClock();
                setInterval(updateClock, 1000);

                // Optional: Automatically fetch real device battery if supported by browser
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
