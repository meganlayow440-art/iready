const express = require('express');
const router = express.Router();

// Main Student Dashboard Route
router.get('/home', (req, res) => {
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

                #onboarding-overlay {
                    position: fixed;
                    top: 0; left: 0; width: 100vw; height: 100vh;
                    background: rgba(5, 15, 5, 0.95);
                    backdrop-filter: blur(10px);
                    z-index: 100;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .modal-card {
                    background: rgba(0, 20, 10, 0.85);
                    border: 1px solid #00ff66;
                    border-radius: 20px;
                    padding: 35px;
                    width: 420px;
                    box-shadow: 0 0 30px rgba(0, 255, 100, 0.3);
                }

                .modal-input {
                    width: 80%;
                    padding: 12px;
                    margin: 8px 0;
                    background: #050f05;
                    border: 1px solid rgba(0, 255, 100, 0.4);
                    border-radius: 10px;
                    color: #00ff66;
                    font-family: 'Quicksand', sans-serif;
                    font-size: 1rem;
                    text-align: center;
                    outline: none;
                }

                .modal-btn {
                    background: rgba(0, 255, 100, 0.2);
                    border: 1px solid #00ff66;
                    color: #00ffcc;
                    padding: 10px 25px;
                    border-radius: 25px;
                    font-weight: 700;
                    cursor: pointer;
                    margin-top: 15px;
                    transition: all 0.2s ease;
                }

                .modal-btn:hover {
                    background: rgba(0, 255, 100, 0.4);
                    box-shadow: 0 0 15px rgba(0, 255, 100, 0.6);
                }

                .error-msg {
                    color: #ff4444;
                    font-size: 0.9rem;
                    margin-top: 10px;
                    display: none;
                }

                #main-view {
                    padding-top: 80px; 
                    padding-bottom: 50px;
                    display: block;
                }

                #game-view {
                    display: none;
                    position: fixed;
                    top: 0; left: 0; width: 100vw; height: 100vh;
                    background: #050f05;
                    box-sizing: border-box;
                    padding-top: 80px;
                    flex-direction: column;
                    z-index: 5;
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
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    flex-wrap: wrap;
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
                    width: 240px;
                    cursor: pointer;
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

                .custom-url-input {
                    width: 85%;
                    padding: 8px 10px;
                    margin-top: 6px;
                    background: #050f05;
                    border: 1px solid rgba(0, 255, 100, 0.4);
                    border-radius: 8px;
                    color: #00ff66;
                    font-family: 'Quicksand', sans-serif;
                    font-size: 0.85rem;
                    text-align: center;
                    outline: none;
                }

                .top-left-bar {
                    position: absolute;
                    top: 20px;
                    left: 25px;
                    z-index: 10;
                    display: flex;
                    gap: 10px;
                }

                .logout-bubble, .back-bubble {
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
                    cursor: pointer;
                }

                .logout-bubble:hover, .back-bubble:hover {
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
            <!-- Onboarding Overlay with Password -->
            <div id="onboarding-overlay">
                <div class="modal-card">
                    <h2>Welcome to Limely.</h2>
                    <p>Enter your account credentials:</p>
                    <input type="text" id="username-input" class="modal-input" placeholder="Username...">
                    <input type="password" id="password-input" class="modal-input" placeholder="Password...">
                    <div id="auth-error" class="error-msg"></div>
                    <br>
                    <button class="modal-btn" type="button" onclick="handleAuth()">Enter Site</button>
                </div>
            </div>

            <div class="status-bar">
                <div class="status-bubble" id="user-display">👤 Guest</div>
                <div class="status-bubble" id="live-clock">--:-- --</div>
                <div class="status-bubble" id="ping-bubble"><span id="ping-icon">🟢</span> <span id="ping-text">-- ms</span></div>
                <div class="status-bubble">⚡ <span id="battery-level">98%</span></div>
            </div>

            <div id="main-view">
                <div class="top-left-bar">
                    <a href="/" class="logout-bubble">Log out</a>
                    <div onclick="switchAccount()" class="logout-bubble">Switch Account</div>
                </div>

                <div class="content-container">
                    <img src="https://api.iconify.design/noto:lime.svg" alt="Cartoony Lime" class="lime-image">
                    <h1>LIME</h1>
                    <p>made by Rig</p>

                    <div class="games-section">
                        <div class="games-title">🎮 AVAILABLE GAMES & HUB</div>
                        <div class="games-grid">
                            
                            <!-- Full Page Chatroom Button Card -->
                            <div onclick="window.location.href='/i-ready/chat'" class="game-card">
                                <div class="game-icon">💬</div>
                                <div class="game-name">Global Chatroom</div>
                                <div class="game-desc">Open the full page live chatroom</div>
                            </div>

                            <div onclick="openGame('https://thornandballoons.com/game/index.html')" class="game-card">
                                <div class="game-icon">🎈</div>
                                <div class="game-name">Thorns and Balloons</div>
                                <div class="game-desc">Pop balloons with sharp thorns</div>
                            </div>
                            <div onclick="openGame('https://cinecat.eu/')" class="game-card">
                                <div class="game-icon">🟪🐱</div>
                                <div class="game-name">Cinecat</div>
                                <div class="game-desc">Watch Movies And TV for free</div>
                            </div>
                            <div onclick="openGame('https://beta.cinecat.eu/')" class="game-card">
                                <div class="game-icon">🌐🐱</div>
                                <div class="game-name">Beta Cinecat</div>
                                <div class="game-desc">Basically Cinecat But A Little Bit Better</div>
                            </div>
                            <div onclick="openGame('https://distrosea.com/')" class="game-card">
                                <div class="game-icon">🐧</div>
                                <div class="game-name">DistroSea</div>
                                <div class="game-desc">VM Service meant for testing distros</div>
                            </div>
                            <div onclick="openGame('https://j.xj2.workers.dev/')" class="game-card">
                                <div class="game-icon">🏝️</div>
                                <div class="game-name">Page Sandbox</div>
                                <div class="game-desc">Allows you to go on any site</div>
                            </div>
                            
                            <!-- Custom URL Card -->
                            <div class="game-card" onclick="event.stopPropagation()">
                                <div class="game-icon">🔗</div>
                                <div class="game-name">Custom Site</div>
                                <div class="game-desc">Open any website in iframe</div>
                                <input type="text" id="custom-url-field" class="custom-url-input" placeholder="https://example.com" onkeydown="if(event.key==='Enter') openCustomUrl()">
                                <button class="modal-btn" style="padding: 6px 15px; margin-top: 8px; font-size: 0.85rem;" onclick="openCustomUrl()">Go</button>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            <div id="game-view">
                <div class="top-left-bar">
                    <div onclick="closeGame()" class="back-bubble">← Back</div>
                </div>

                <div class="embed-container">
                    <iframe id="game-iframe" title="Game View"></iframe>
                </div>
            </div>

            <script>
                function handleAuth() {
                    const username = document.getElementById('username-input').value.trim();
                    const password = document.getElementById('password-input').value.trim();
                    const errorDiv = document.getElementById('auth-error');

                    if (!username || !password) {
                        if (errorDiv) {
                            errorDiv.innerText = 'Username and password required';
                            errorDiv.style.display = 'block';
                        }
                        return;
                    }

                    if (errorDiv) errorDiv.style.display = 'none';
                    localStorage.setItem('limely_username', username);
                    localStorage.setItem('limely_password', password);
                    
                    const userDisplay = document.getElementById('user-display');
                    if (userDisplay) userDisplay.innerText = '👤 ' + username;

                    const overlay = document.getElementById('onboarding-overlay');
                    if (overlay) overlay.style.display = 'none';
                }

                function switchAccount() {
                    localStorage.removeItem('limely_username');
                    localStorage.removeItem('limely_password');
                    document.getElementById('username-input').value = '';
                    document.getElementById('password-input').value = '';
                    const overlay = document.getElementById('onboarding-overlay');
                    if (overlay) overlay.style.display = 'flex';
                }

                function openGame(url) {
                    document.getElementById('game-iframe').src = url;
                    document.getElementById('main-view').style.display = 'none';
                    document.getElementById('game-view').style.display = 'flex';
                }

                function openCustomUrl() {
                    let inputUrl = document.getElementById('custom-url-field').value.trim();
                    if (!inputUrl) return;

                    if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) {
                        inputUrl = 'https://' + inputUrl;
                    }

                    openGame(inputUrl);
                }

                function closeGame() {
                    document.getElementById('game-iframe').src = '';
                    document.getElementById('game-view').style.display = 'none';
                    document.getElementById('main-view').style.display = 'block';
                }

                window.addEventListener('DOMContentLoaded', () => {
                    const savedUser = localStorage.getItem('limely_username');
                    if (savedUser) {
                        document.getElementById('user-display').innerText = '👤 ' + savedUser;
                        document.getElementById('onboarding-overlay').style.display = 'none';
                    }
                });

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

// Full Page Chat Room Route
router.get('/chat', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Limely - Full Page Chat</title>
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
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                }

                .chat-header {
                    background: rgba(0, 20, 10, 0.85);
                    border-bottom: 1px solid #00ff66;
                    padding: 15px 25px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .back-btn {
                    background: rgba(0, 255, 100, 0.2);
                    border: 1px solid #00ff66;
                    color: #00ffcc;
                    padding: 8px 18px;
                    border-radius: 20px;
                    font-weight: 700;
                    text-decoration: none;
                    transition: all 0.2s ease;
                }

                .back-btn:hover {
                    background: rgba(0, 255, 100, 0.4);
                    box-shadow: 0 0 10px rgba(0, 255, 100, 0.5);
                }

                .chat-box {
                    flex: 1;
                    padding: 25px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .chat-bubble {
                    background: rgba(0, 20, 10, 0.7);
                    border: 1px solid rgba(0, 255, 100, 0.3);
                    border-radius: 12px;
                    padding: 12px 18px;
                    max-width: 75%;
                    word-wrap: break-word;
                    align-self: flex-start;
                }

                .chat-bubble.mine {
                    align-self: flex-end;
                    border-color: #00ffcc;
                    background: rgba(0, 40, 20, 0.8);
                }

                .chat-user {
                    font-weight: 700;
                    color: #00ffcc;
                    font-size: 0.85rem;
                    margin-bottom: 4px;
                }

                .chat-text {
                    color: #aaffcc;
                    font-size: 1rem;
                }

                .chat-input-bar {
                    background: rgba(0, 20, 10, 0.9);
                    border-top: 1px solid #00ff66;
                    padding: 20px;
                    display: flex;
                    gap: 15px;
                }

                .chat-input {
                    flex: 1;
                    background: #050f05;
                    border: 1px solid rgba(0, 255, 100, 0.4);
                    border-radius: 25px;
                    padding: 12px 20px;
                    color: #00ff66;
                    font-family: 'Quicksand', sans-serif;
                    font-size: 1rem;
                    outline: none;
                }

                .send-btn {
                    background: rgba(0, 255, 100, 0.2);
                    border: 1px solid #00ff66;
                    color: #00ffcc;
                    padding: 12px 25px;
                    border-radius: 25px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .send-btn:hover {
                    background: rgba(0, 255, 100, 0.4);
                    box-shadow: 0 0 15px rgba(0, 255, 100, 0.6);
                }
            </style>
        </head>
        <body>
            <div class="chat-header">
                <a href="/i-ready/home" class="back-btn">← Back to Dashboard</a>
                <h2 style="margin:0; font-size:1.4rem; color:#00ff66;">💬 LIMELY GLOBAL CHATROOM</h2>
                <div id="chat-user-tag" style="font-weight:700; color:#00ffcc;">👤 Guest</div>
            </div>

            <div class="chat-box" id="chat-box">
                <p style="color:#88cc99; text-align:center;">Loading room messages...</p>
            </div>

            <div class="chat-input-bar">
                <input type="text" id="chat-field" class="chat-input" placeholder="Type a message..." onkeydown="if(event.key==='Enter') sendChatMessage()">
                <button class="send-btn" onclick="sendChatMessage()">Send</button>
            </div>

            <script>
                const username = localStorage.getItem('limely_username') || 'Guest';
                const password = localStorage.getItem('limely_password') || '';
                document.getElementById('chat-user-tag').innerText = '👤 ' + username;

                async function fetchChatMessages() {
                    try {
                        const res = await fetch('/api/chat/messages');
                        const data = await res.json();
                        const box = document.getElementById('chat-box');

                        if (data.success && data.messages.length > 0) {
                            let html = '';
                            for (let i = 0; i < data.messages.length; i++) {
                                const m = data.messages[i];
                                const isMine = m.username.toLowerCase() === username.toLowerCase();
                                html += '<div class="chat-bubble ' + (isMine ? 'mine' : '') + '">' +
                                        '<div class="chat-user">' + m.username + '</div>' +
                                        '<div class="chat-text">' + m.message + '</div>' +
                                        '</div>';
                            }
                            box.innerHTML = html;
                            box.scrollTop = box.scrollHeight;
                        } else {
                            box.innerHTML = '<p style="color:#88cc99; text-align:center;">No messages yet. Say hi!</p>';
                        }
                    } catch(e) {}
                }

                async function sendChatMessage() {
                    const field = document.getElementById('chat-field');
                    const message = field.value.trim();

                    if (!message) return;
                    field.value = '';

                    try {
                        await fetch('/api/chat/send', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username, password, message })
                        });
                        fetchChatMessages();
                    } catch(e) {}
                }

                fetchChatMessages();
                setInterval(fetchChatMessages, 2500);
            </script>
        </body>
        </html>
    `);
});

module.exports = router;
