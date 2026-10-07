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
            <script src="https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js"></script>
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
            <!-- Direct Login Overlay -->
            <div id="onboarding-overlay">
                <div class="modal-card">
                    <h3>Limely Account Setup</h3>
                    <input type="text" id="username-input" class="modal-input" placeholder="Enter Username...">
                    <input type="password" id="password-input" class="modal-input" placeholder="Enter Bio/Pin...">
                    <div id="auth-error" class="error-msg"></div>
                    <br>
                    <button class="modal-btn" onclick="handleAuth()">Submit</button>
                </div>
            </div>

            <div class="status-bar">
                <div class="status-bubble" id="user-display">👤 Guest</div>
                <div class="status-bubble" id="live-clock">--:-- --</div>
                <div class="status-bubble" id="ping-bubble"><span id="ping-icon">🟢</span> <span id="ping-text">-- ms</span></div>
                <div class="status-bubble">⚡ <span id="battery-level">98%</span></div>
            </div>

            <!-- Voice Call Bar -->
            <div id="call-bar" style="display:none; position:fixed; bottom:20px; right:20px; background:#002010; border:1px solid #00ff66; padding:15px; border-radius:15px; z-index:200;">
                <span id="call-status">🎙️ In Voice Call with <b id="call-target">--</b></span>
                <button onclick="endVoiceCall()" style="background:#ff4444; border:none; color:white; padding:5px 12px; border-radius:8px; margin-left:10px; cursor:pointer;">Hang Up</button>
            </div>
            <audio id="remote-audio" autoplay></audio>

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

                    <!-- Profile & Social Hub -->
                    <div class="games-section" style="margin-top: 40px;">
                        <div class="games-title">💬 COMMUNITY & VOICE HUB</div>
                        <div class="games-grid">
                            
                            <!-- Profile Card -->
                            <div class="game-card" style="width: 260px; text-align: left;" onclick="event.stopPropagation()">
                                <div class="game-name" style="text-align:center;">👤 Profile</div>
                                <img id="my-avatar-preview" src="https://api.iconify.design/noto:lime.svg" style="width:50px; height:50px; display:block; margin:8px auto; border-radius:50%;">
                                <label style="font-size:0.8rem; color:#88cc99;">Bio:</label>
                                <input type="text" id="edit-bio" class="custom-url-input" placeholder="Your custom bio...">
                                <label style="font-size:0.8rem; color:#88cc99; margin-top:5px; display:block;">Avatar URL:</label>
                                <input type="text" id="edit-avatar" class="custom-url-input" placeholder="https://image-link.png">
                                <button class="modal-btn" style="width:100%; font-size:0.85rem; padding:6px; margin-top:10px;" onclick="saveProfile()">Save Profile</button>
                            </div>

                            <!-- Friends & Calls Card -->
                            <div class="game-card" style="width: 260px; text-align: left;" onclick="event.stopPropagation()">
                                <div class="game-name" style="text-align:center;">👥 Friends</div>
                                <input type="text" id="friend-username-input" class="custom-url-input" placeholder="Friend username...">
                                <button class="modal-btn" style="width:100%; font-size:0.85rem; padding:6px; margin-top:8px;" onclick="addFriend()">Add Friend</button>
                                <div id="friends-list" style="margin-top:15px; max-height:120px; overflow-y:auto; font-size:0.85rem;">
                                    <p style="color:#88cc99; text-align:center;">Loading friends...</p>
                                </div>
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
                let peer = null;
                let currentCall = null;
                let localAudioStream = null;

                function handleAuth() {
                    const username = document.getElementById('username-input').value.trim();
                    const errorDiv = document.getElementById('auth-error');

                    if (!username) {
                        errorDiv.innerText = 'Please enter a username';
                        errorDiv.style.display = 'block';
                        return;
                    }

                    errorDiv.style.display = 'none';
                    localStorage.setItem('limely_username', username);
                    document.getElementById('user-display').innerText = '👤 ' + username;
                    
                    initVoiceCalls(username);
                    loadFriends();
                    loadProfile(username);
                    closeOnboarding();
                }

                function switchAccount() {
                    localStorage.removeItem('limely_username');
                    document.getElementById('username-input').value = '';
                    document.getElementById('password-input').value = '';
                    document.getElementById('auth-error').style.display = 'none';
                    document.getElementById('onboarding-overlay').style.display = 'flex';
                }

                function closeOnboarding() {
                    document.getElementById('onboarding-overlay').style.display = 'none';
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

                // --- Voice Calls & PeerJS ---
                function initVoiceCalls(username) {
                    peer = new Peer('limely-' + username.toLowerCase());

                    peer.on('call', (call) => {
                        const callerName = call.peer.replace('limely-', '');
                        const accept = confirm('Incoming call from ' + callerName + '! Answer?');
                        if (accept) {
                            navigator.mediaDevices.getUserMedia({ audio: true, video: false })
                                .then((stream) => {
                                    localAudioStream = stream;
                                    call.answer(stream);
                                    setupCallStream(call, callerName);
                                })
                                .catch(() => alert('Microphone access required to answer voice calls.'));
                        }
                    });
                }

                function callFriend(friendUser) {
                    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
                        .then((stream) => {
                            localAudioStream = stream;
                            const peerId = 'limely-' + friendUser.toLowerCase();
                            const call = peer.call(peerId, stream);
                            setupCallStream(call, friendUser);
                        })
                        .catch(() => alert('Microphone access required to make voice calls!'));
                }

                function setupCallStream(call, friendUser) {
                    currentCall = call;
                    document.getElementById('call-bar').style.display = 'block';
                    document.getElementById('call-target').innerText = friendUser;

                    call.on('stream', (remoteStream) => {
                        document.getElementById('remote-audio').srcObject = remoteStream;
                    });

                    call.on('close', () => endVoiceCall());
                }

                function endVoiceCall() {
                    if (currentCall) currentCall.close();
                    if (localAudioStream) localAudioStream.getTracks().forEach(track => track.stop());
                    document.getElementById('call-bar').style.display = 'none';
                }

                // --- Profiles & Friends Logic ---
                async function saveProfile() {
                    const username = localStorage.getItem('limely_username');
                    const bio = document.getElementById('edit-bio').value;
                    const avatar_url = document.getElementById('edit-avatar').value;

                    try {
                        const res = await fetch('/api/profile/update', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username, bio, avatar_url })
                        });
                        const data = await res.json();
                        alert(data.message);
                        if (avatar_url) document.getElementById('my-avatar-preview').src = avatar_url;
                    } catch(e) {
                        alert('Saved locally!');
                    }
                }

                async function loadProfile(username) {
                    try {
                        const res = await fetch('/api/profile/' + username);
                        const data = await res.json();
                        if (data.success && data.profile) {
                            if (data.profile.bio) document.getElementById('edit-bio').value = data.profile.bio;
                            if (data.profile.avatar_url) {
                                document.getElementById('edit-avatar').value = data.profile.avatar_url;
                                document.getElementById('my-avatar-preview').src = data.profile.avatar_url;
                            }
                        }
                    } catch(e) {}
                }

                async function loadFriends() {
                    const username = localStorage.getItem('limely_username');
                    if (!username) return;

                    const listDiv = document.getElementById('friends-list');
                    try {
                        const res = await fetch('/api/friends/' + username);
                        const data = await res.json();

                        if (data.success && data.friends.length > 0) {
                            let html = '';
                            for (let i = 0; i < data.friends.length; i++) {
                                const f = data.friends[i];
                                html += '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">' +
                                        '<span>👤 ' + f + '</span>' +
                                        '<button class="modal-btn" style="padding:2px 8px; font-size:0.75rem; margin:0;" onclick="callFriend(\'' + f + '\')">📞 Call</button>' +
                                        '</div>';
                            }
                            listDiv.innerHTML = html;
                        } else {
                            listDiv.innerHTML = '<p style="color:#88cc99; text-align:center;">No friends added yet.</p>';
                        }
                    } catch(e) {
                        listDiv.innerHTML = '<p style="color:#88cc99; text-align:center;">No friends added yet.</p>';
                    }
                }

                async function addFriend() {
                    const username = localStorage.getItem('limely_username');
                    const friendUsername = document.getElementById('friend-username-input').value.trim();

                    try {
                        const res = await fetch('/api/friends/add', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username, friendUsername })
                        });
                        const data = await res.json();
                        alert(data.message);
                        if (data.success) loadFriends();
                    } catch(e) {
                        alert('Could not add friend');
                    }
                }

                window.addEventListener('DOMContentLoaded', () => {
                    const savedUser = localStorage.getItem('limely_username');
                    if (savedUser) {
                        document.getElementById('user-display').innerText = '👤 ' + savedUser;
                        document.getElementById('onboarding-overlay').style.display = 'none';
                        initVoiceCalls(savedUser);
                        loadFriends();
                        loadProfile(savedUser);
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
