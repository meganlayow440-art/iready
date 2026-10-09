const express = require('express');
const router = express.Router();

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

                /* Chat Box Custom Styles */
                #chat-messages-box {
                    background: #020802;
                    border: 1px solid rgba(0, 255, 100, 0.3);
                    border-radius: 12px;
                    height: 200px;
                    overflow-y: auto;
                    padding: 12px;
                    text-align: left;
                    font-size: 0.9rem;
                    margin-bottom: 10px;
                }

                .chat-msg {
                    margin-bottom: 8px;
                    line-height: 1.3;
                    word-wrap: break-word;
                }

                .chat-msg-user {
                    color: #00ffcc;
                    font-weight: 700;
                }

                .chat-msg-text {
                    color: #aaffcc;
                }
            </style>
        </head>
        <body>
            <!-- Onboarding Overlay -->
            <div id="onboarding-overlay">
                <div class="modal-card">
                    <h2>Welcome to Limely.</h2>
                    <p>Log in to chat. New username? An account is created with the password you enter.</p>
                    <input type="text" id="username-input" class="modal-input" placeholder="Username..." maxlength="20" autocomplete="username">
                    <input type="password" id="password-input" class="modal-input" placeholder="Password..." maxlength="100" autocomplete="current-password" onkeydown="if(event.key==='Enter') handleAuth()">
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
                        <div class="games-title">🎮 AVAILABLE GAMES</div>
                        <div class="games-grid">
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

                    <!-- Global Chat Room -->
                    <div class="games-section" style="margin-top: 40px;">
                        <div class="games-title">💬 GLOBAL CHAT ROOM</div>
                        <div style="max-width: 600px; margin: 0 auto;" onclick="event.stopPropagation()">
                            <div id="chat-messages-box">
                                <p style="color:#88cc99; text-align:center;">Loading messages...</p>
                            </div>
                            <div style="display:flex; gap:10px;">
                                <input type="text" id="chat-input" class="custom-url-input" style="flex:1; margin:0;" placeholder="Type a message..." onkeydown="if(event.key==='Enter') sendMessage()">
                                <button class="modal-btn" style="margin:0; padding: 8px 20px;" onclick="sendMessage()">Send</button>
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
                function escapeHtml(str) {
                    return String(str)
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/"/g, '&quot;')
                        .replace(/'/g, '&#39;');
                }

                function showAuthError(text) {
                    const errorDiv = document.getElementById('auth-error');
                    if (errorDiv) {
                        errorDiv.innerText = text;
                        errorDiv.style.display = 'block';
                    }
                }

                function showLogin(message) {
                    localStorage.removeItem('limely_username');
                    localStorage.removeItem('limely_token');
                    document.getElementById('user-display').innerText = '👤 Guest';
                    const overlay = document.getElementById('onboarding-overlay');
                    if (overlay) overlay.style.display = 'flex';
                    if (message) showAuthError(message);
                }

                async function handleAuth() {
                    const usernameEl = document.getElementById('username-input');
                    const passwordEl = document.getElementById('password-input');
                    const username = usernameEl ? usernameEl.value.trim() : '';
                    const password = passwordEl ? passwordEl.value : '';
                    const errorDiv = document.getElementById('auth-error');

                    if (!username) { showAuthError('Please enter a username'); return; }
                    if (!password) { showAuthError('Please enter a password'); return; }

                    if (errorDiv) errorDiv.style.display = 'none';

                    try {
                        const res = await fetch('/api/chat/auth', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username, password })
                        });
                        const data = await res.json();

                        if (!data.success) {
                            showAuthError(data.message || 'Login failed');
                            return;
                        }

                        localStorage.setItem('limely_username', data.username);
                        localStorage.setItem('limely_token', data.token);
                        if (passwordEl) passwordEl.value = '';

                        document.getElementById('user-display').innerText = '👤 ' + data.username;
                        document.getElementById('onboarding-overlay').style.display = 'none';
                        fetchMessages();
                    } catch (e) {
                        showAuthError('Could not reach the server');
                    }
                }

                function switchAccount() {
                    const usernameEl = document.getElementById('username-input');
                    const passwordEl = document.getElementById('password-input');
                    if (usernameEl) usernameEl.value = '';
                    if (passwordEl) passwordEl.value = '';
                    showLogin();
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

                // --- Live Chat Logic ---
                async function fetchMessages() {
                    try {
                        const res = await fetch('/api/chat/messages');
                        const data = await res.json();
                        const box = document.getElementById('chat-messages-box');

                        if (data.success && data.messages.length > 0) {
                            let html = '';
                            for (let i = 0; i < data.messages.length; i++) {
                                const m = data.messages[i];
                                html += '<div class="chat-msg"><span class="chat-msg-user">' + escapeHtml(m.username) + ':</span> <span class="chat-msg-text">' + escapeHtml(m.message) + '</span></div>';
                            }
                            box.innerHTML = html;
                            box.scrollTop = box.scrollHeight;
                        } else {
                            box.innerHTML = '<p style="color:#88cc99; text-align:center;">No messages yet. Be the first to say hi!</p>';
                        }
                    } catch(e) {}
                }

                async function sendMessage() {
                    const token = localStorage.getItem('limely_token');
                    const input = document.getElementById('chat-input');
                    const message = input.value.trim();

                    if (!message) return;
                    if (!token) { showLogin('Please log in to chat'); return; }
                    input.value = '';

                    try {
                        const res = await fetch('/api/chat/send', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + token
                            },
                            body: JSON.stringify({ message })
                        });

                        if (res.status === 401) {
                            input.value = message;
                            showLogin('Session expired, please log in again');
                            return;
                        }
                        fetchMessages();
                    } catch(e) {}
                }

                // Poll chat messages every 3 seconds
                setInterval(fetchMessages, 3000);

                window.addEventListener('DOMContentLoaded', () => {
                    const savedUser = localStorage.getItem('limely_username');
                    const savedToken = localStorage.getItem('limely_token');
                    if (savedUser && savedToken) {
                        document.getElementById('user-display').innerText = '👤 ' + savedUser;
                        document.getElementById('onboarding-overlay').style.display = 'none';
                        fetchMessages();
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

module.exports = router;
