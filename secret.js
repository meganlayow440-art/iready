const express = require('express');
const router = express.Router();

// Secret dashboard route masked as an i-Ready student portal page
router.get('/home', (req, res) => {
    const gameParam = req.query.game;

    // If a game is selected, render the embedded game view
    if (gameParam) {
        // Define your games data directory
const gamesList = {

    'ThornsAndBaloons': { name: 'thorns And Balloons', url: 'https://thornandballoons.com/game/index.html' }
};

        const currentGame = gamesList[gameParam] || { name: 'Game', url: 'about:blank' };

        return res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>i-Ready - ${currentGame.name}</title>
                <link rel="icon" type="image/png" href="/images/favicon.png">
                <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700&display=swap" rel="stylesheet">
                <style>
                    body { 
                        background-color: #050f05; 
                        margin: 0;
                        padding-top: 80px;
                        height: 100vh;
                        box-sizing: border-box;
                        font-family: 'Quicksand', sans-serif;
                        overflow: hidden;
                        display: flex;
                        flex-direction: column;
                    }

                    /* Top-left Back button bubble */
                    .top-left-bar {
                        position: absolute;
                        top: 20px;
                        left: 25px;
                        z-index: 10;
                    }

                    .back-bubble {
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

                    .back-bubble:hover {
                        background: rgba(0, 255, 100, 0.2);
                        box-shadow: 0 0 15px rgba(0, 255, 100, 0.5);
                    }

                    /* Top-right status bar */
                    .status-bar {
                        position: absolute;
                        top: 20px;
                        right: 25px;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        z-index: 10;
                    }

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

                    /* Game Embed Container */
                    .embed-container {
                        flex: 1;
                        width: 100%;
                        border: none;
                        background: #000;
                    }

                    iframe {
                        width: 100%;
                        height: 100%;
                        border: none;
                    }
                </style>
            </head>
            <body>
                <!-- Top-Left Back Button -->
                <div class="top-left-bar">
                    <a href="/i-ready/home" class="back-bubble">← Back</a>
                </div>

                <!-- Top-Right Status Bar -->
                <div class="status-bar">
                    <div class="status-bubble" id="live-clock">--:-- --</div>
                    <div class="status-bubble" id="ping-bubble"><span id="ping-icon">🟢</span> <span id="ping-text">-- ms</span></div>
                    <div class="status-bubble">⚡ <span id="battery-level">98%</span></div>
                </div>

                <!-- Game Embed Frame -->
                <div class="embed-container">
                    <iframe src="${currentGame.url}" title="${currentGame.name}"></iframe>
                </div>

                <script>
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

                    function checkPing() {
                        const startTime = performance.now();
                        fetch('/i-ready/home', { method: 'HEAD', cache: 'no-store' })
                            .then(() => {
                                const duration = Math.round(performance.now() - startTime);
                                const pingText = document.getElementById('ping-text');
                                const pingIcon = document.getElementById('ping-icon');
                                pingText.innerText = duration + ' ms';
                                if (duration < 100) pingIcon.innerText = '🟢';
                                else if (duration < 300) pingIcon.innerText = '🟡';
                                else pingIcon.innerText = '🔴';
                            })
                            .catch(() => {
                                document.getElementById('ping-text').innerText = 'Error';
                                document.getElementById('ping-icon').innerText = '🔴';
                            });
                    }
                    checkPing();
                    setInterval(checkPing, 5000);

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
    }

    // Default Main Dashboard View
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>i-Ready - Student Dashboard</title>
            <link rel="icon" type="image/png" href="/images/favicon.png">
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
                    padding-top: 80px; 
                    padding-bottom: 50px;
                    margin: 0;
                    position: relative;
                    min-height: 100vh;
                    overflow-x: hidden;
                }

                body::before {
                    content: "";
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: radial-gradient(circle at center, rgba(0,255,100,0.1) 0%, transparent 70%);
                    pointer-events: none;
                }

                .content-container {
                    position: relative;
                    z-index: 2;
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 0 20px;
                }

                .lime-image {
                    width: 120px;
                    height: 120px;
                    object-fit: contain;
                    filter: drop-shadow(0 0 20px rgba(0, 255, 100, 0.6));
                    animation: float 3s ease-in-out infinite;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }

                h1 { 
                    font-size: 3.5rem; 
                    letter-spacing: 4px;
                    color: #00ff66;
                    text-shadow: 0 0 15px rgba(0, 255, 100, 0.8), 0 0 30px rgba(0, 255, 100, 0.4); 
                    margin: 10px 0;
                    font-weight: 700;
                }

                p { 
                    font-size: 1.2rem; 
                    color: #aaffcc; 
                    text-shadow: 0 0 5px rgba(0,255,100,0.3); 
                    font-weight: 700;
                    margin-bottom: 30px;
                }

                .games-section {
                    margin-top: 40px;
                    text-align: left;
                }

                .games-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #00ff66;
                    text-shadow: 0 0 10px rgba(0,255,100,0.5);
                    margin-bottom: 15px;
                    text-align: center;
                    letter-spacing: 1px;
                }

                .games-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 20px;
                }

                .game-card {
                    background: rgba(0, 20, 10, 0.6);
                    backdrop-filter: blur(5px);
                    border: 1px solid rgba(0, 255, 100, 0.4);
                    border-radius: 20px;
                    padding: 20px;
                    text-align: center;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.5), inset 0 0 10px rgba(0,255,100,0.1);
                    transition: all 0.2s ease;
                    text-decoration: none;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .game-card:hover {
                    transform: translateY(-5px);
                    background: rgba(0, 35, 15, 0.8);
                    border-color: #00ff66;
                    box-shadow: 0 0 20px rgba(0, 255, 100, 0.6);
                }

                .game-icon {
                    font-size: 2.5rem;
                    margin-bottom: 10px;
                }

                .game-name {
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: #00ffcc;
                    margin-bottom: 5px;
                }

                .game-desc {
                    font-size: 0.9rem;
                    color: #88cc99;
                    font-weight: 500;
                }

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

                .status-bar {
                    position: absolute;
                    top: 20px;
                    right: 25px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    z-index: 10;
                }

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
            <div class="top-left-bar">
                <a href="/" class="logout-bubble">Log out</a>
            </div>

            <div class="status-bar">
                <div class="status-bubble" id="live-clock">--:-- --</div>
                <div class="status-bubble" id="ping-bubble"><span id="ping-icon">🟢</span> <span id="ping-text">-- ms</span></div>
                <div class="status-bubble">⚡ <span id="battery-level">98%</span></div>
            </div>

            <div class="content-container">
                <img src="https://api.iconify.design/noto:lime.svg" alt="Cartoony Lime" class="lime-image">
                <h1>LIME</h1>
                <p>made by Rig</p>

                <div class="games-section">
                    <div class="games-title">🎮 AVAILABLE GAMES</div>
                    <div class="games-grid">
                        <a href="/i-ready/home?game=ccbd-land" class="game-card">
                            <div class="game-icon">🟩</div>
                            <div class="game-name">CCBD LAND</div>
                            <div class="game-desc">Explore custom worlds & assets</div>
                        </a>
                        <a href="/i-ready/home?game=adopt-pets" class="game-card">
                            <div class="game-icon">🐶</div>
                            <div class="game-name">Adopt Pets</div>
                            <div class="game-desc">Trade and collect rare companions</div>
                        </a>
                        <a href="/i-ready/home?game=speed-run" class="game-card">
                            <div class="game-icon">⚡</div>
                            <div class="game-name">Speed Run X</div>
                            <div class="game-desc">Test your reflexes and parkour</div>
                        </a>
                        <a href="/i-ready/home?game=neon-puzzle" class="game-card">
                            <div class="game-icon">🧩</div>
                            <div class="game-name">Neon Puzzle</div>
                            <div class="game-desc">Cyberpunk grid matching game</div>
                        </a>
                    </div>
                </div>
            </div>

            <script>
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

                function checkPing() {
                    const startTime = performance.now();
                    fetch('/i-ready/home', { method: 'HEAD', cache: 'no-store' })
                        .then(() => {
                            const duration = Math.round(performance.now() - startTime);
                            const pingText = document.getElementById('ping-text');
                            const pingIcon = document.getElementById('ping-icon');
                            pingText.innerText = duration + ' ms';
                            if (duration < 100) pingIcon.innerText = '🟢';
                            else if (duration < 300) pingIcon.innerText = '🟡';
                            else pingIcon.innerText = '🔴';
                        })
                        .catch(() => {
                            document.getElementById('ping-text').innerText = 'Error';
                            document.getElementById('ping-icon').innerText = '🔴';
                        });
                }
                checkPing();
                setInterval(checkPing, 5000);

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
