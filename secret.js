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
            <!-- Import a rounded, circley font from Google Fonts -->
            <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700&display=swap" rel="stylesheet">
            <style>
                body { 
                    background-color: #050f05; 
                    background-image: 
                        linear-gradient(rgba(0, 255, 100, 0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0, 255, 100, 0.05) 1px, transparent 1px);
                    background-size: 30px 30px;
                    color: #00ff66; 
                    font-family: 'Quicksand', sans-serif; 
                    text-align: center; 
                    padding-top: 100px; 
                    margin: 0;
                    position: relative;
                    min-height: 100vh;
                    overflow-x: hidden;
                }

                /* Futuristic glowing grid accent effect */
                body::before {
                    content: "";
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: radial-gradient(circle at center, rgba(0,255,100,0.1) 0%, transparent 70%);
                    pointer-events: none;
                }

                .content-container {
                    position: relative;
                    z-index: 2;
                }

                /* Cartoony Lime Image Styling */
                .lime-image {
                    width: 140px;
                    height: 140px;
                    object-fit: contain;
                    filter: drop-shadow(0 0 20px rgba(0, 255, 100, 0.6));
                    animation: float 3s ease-in-out infinite;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }

                h1 { 
                    font-size: 4rem; 
                    letter-spacing: 4px;
                    color: #00ff66;
                    text-shadow: 0 0 15px rgba(0, 255, 100, 0.8), 0 0 30px rgba(0, 255, 100, 0.4); 
                    margin: 10px 0;
                    font-weight: 700;
                }

                p { 
                    font-size: 1.3rem; 
                    color: #aaffcc; 
                    text-shadow: 0 0 5px rgba(0,255,100,0.3); 
                    font-weight: 700;
                }

                /* Top-left corner logout button styled as a bubble */
                .top-left-bar {
                    position: absolute;
                    top: 20px;
                    left: 25px;
                    z-index: 10;
                }

                .logout-bubble {
                    background: rgba(0, 20, 10, 0.6);
                    backdrop-filter: blur(5px);
                    padding: 12px 22px;
                    border-radius: 30px;
                    border: 1px solid rgba(0, 255, 100, 0.4);
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #00ffcc;
                    letter-spacing: 0.5px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.5), inset 0 0 10px rgba(0,255,100,0.1);
                    text-decoration: none;
                    display: inline-block;
                    transition: all 0.2s ease;
                }

                .logout-bubble:hover {
                    background: rgba(0, 255, 100, 0.2);
                    box-shadow: 0 0 15px rgba(0, 255, 100, 0.5);
                }

                /* Top-right corner container for separate bubbles */
                .status-bar {
                    position: absolute;
                    top: 20px;
                    right: 25px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    z-index: 10;
                }

                /* Individual larger bubble styling with green theme */
                .status-bubble {
                    background: rgba(0, 20, 10, 0.6);
                    backdrop-filter: blur(5px);
                    padding: 12px 20px;
                    border-radius: 30px;
                    border: 1px solid rgba(0, 255, 100, 0.4);
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #00ff66;
                    letter-spacing: 0.5px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.5), inset 0 0 10px rgba(0,255,100,0.1);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
            </style>
        </head>
        <body>
            <!-- Top-Left Corner Logout Bubble -->
            <div class="top-left-bar">
                <a href="/" class="logout-bubble">Log out</a>
            </div>

            <!-- Top-Right Corner Status Bar with Live Ping & Battery -->
            <div class="status-bar">
                <div class="status-bubble" id="live-clock">--:-- --</div>
                <div class="status-bubble" id="ping-bubble"><span id="ping-icon">🟢</span> <span id="ping-text">-- ms</span></div>
                <div class="status-bubble">⚡ <span id="battery-level">98%</span></div>
            </div>

            <div class="content-container">
                <!-- Cartoony Lime Image -->
                <img src="https://api.iconify.design/noto:lime.svg" alt="Cartoony Lime" class="lime-image">
                <h1>LIME</h1>
                <p>made by Rig</p>
            </div>

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
                    fetch('/i-ready/home', { method: 'HEAD', cache: 'no-store' })
                        .then(() => {
                            const duration = Math.round(performance.now() - startTime);
                            const pingText = document.getElementById('ping-text');
                            const pingIcon = document.getElementById('ping-icon');
                            
                            pingText.innerText = duration + ' ms';

                            if (duration < 100) {
                                pingIcon.innerText = '🟢';
                            } else if (duration < 300) {
                                pingIcon.innerText = '🟡';
                            } else {
                                pingIcon.innerText = '🔴';
                            }
                        })
                        .catch(() => {
                            document.getElementById('ping-text').innerText = 'Error';
                            document.getElementById('ping-icon').innerText = '🔴';
                        });
                }
                
                checkPing();
                setInterval(checkPing, 5000);

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
