const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Supabase Connection Settings
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://hwhrsmftwowbxvauqopj.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3aHJzbWZ0d293Ynh2YXVxb3BqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMTM1MjcsImV4cCI6MjEwNjg4OTUyN30.LhHsXtRzqkeeQW2IqOrKSLIQSvVGiakySHKpUHyXIYg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const secretRouter = require('./secret');

// Mount secret route router
app.use('/i-ready', secretRouter);

// Root Route - Serve Login Page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>i-Ready - Student Login</title>
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
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    margin: 0;
                }
                .login-card {
                    background: rgba(0, 20, 10, 0.85);
                    border: 1px solid #00ff66;
                    border-radius: 20px;
                    padding: 35px;
                    width: 380px;
                    text-align: center;
                    box-shadow: 0 0 30px rgba(0, 255, 100, 0.3);
                }
                h1 {
                    color: #00ff66;
                    font-size: 2.5rem;
                    margin-bottom: 5px;
                    text-shadow: 0 0 10px rgba(0, 255, 100, 0.5);
                }
                p {
                    color: #aaffcc;
                    font-size: 0.95rem;
                    margin-bottom: 25px;
                }
                .input-field {
                    width: 85%;
                    padding: 12px;
                    margin: 10px 0;
                    background: #050f05;
                    border: 1px solid rgba(0, 255, 100, 0.4);
                    border-radius: 10px;
                    color: #00ff66;
                    font-family: 'Quicksand', sans-serif;
                    font-size: 1rem;
                    text-align: center;
                    outline: none;
                }
                .btn {
                    background: rgba(0, 255, 100, 0.2);
                    border: 1px solid #00ff66;
                    color: #00ffcc;
                    padding: 10px 25px;
                    border-radius: 25px;
                    font-weight: 700;
                    cursor: pointer;
                    margin-top: 15px;
                    width: 90%;
                    transition: all 0.2s ease;
                }
                .btn:hover {
                    background: rgba(0, 255, 100, 0.4);
                    box-shadow: 0 0 15px rgba(0, 255, 100, 0.6);
                }
                .error {
                    color: #ff4444;
                    font-size: 0.85rem;
                    margin-top: 10px;
                    display: none;
                }
            </style>
        </head>
        <body>
            <div class="login-card">
                <h1>LIMELY</h1>
                <p>Log in to access your dashboard</p>
                <input type="text" id="username" class="input-field" placeholder="Username...">
                <input type="password" id="password" class="input-field" placeholder="Password...">
                <div id="error" class="error"></div>
                <button class="btn" onclick="login()">Log In</button>
            </div>

            <script>
                async function login() {
                    const username = document.getElementById('username').value.trim();
                    const password = document.getElementById('password').value.trim();
                    const errDiv = document.getElementById('error');

                    if (!username || !password) {
                        errDiv.innerText = 'Username and password required';
                        errDiv.style.display = 'block';
                        return;
                    }

                    errDiv.style.display = 'none';

                    try {
                        const res = await fetch('/api/auth', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username, password })
                        });
                        const data = await res.json();

                        if (data.success) {
                            localStorage.setItem('limely_username', data.username);
                            window.location.href = '/i-ready/home';
                        } else {
                            errDiv.innerText = data.message || 'Login failed';
                            errDiv.style.display = 'block';
                        }
                    } catch (err) {
                        errDiv.innerText = 'Server error. Please try again.';
                        errDiv.style.display = 'block';
                    }
                }
            </script>
        </body>
        </html>
    `);
});

// Authentication Endpoint
app.post('/api/auth', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    try {
        const cleanUser = username.toLowerCase().trim();

        // Check if user exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('username', cleanUser)
            .maybeSingle();

        if (existingUser) {
            if (existingUser.password === password) {
                return res.json({ success: true, isNew: false, username: existingUser.username });
            } else {
                return res.status(401).json({ success: false, message: 'Incorrect password for existing account' });
            }
        }

        // Check password usage
        const { data: passCheck } = await supabase
            .from('users')
            .select('id')
            .eq('password', password);

        if (passCheck && passCheck.length > 0) {
            return res.status(400).json({ success: false, message: 'That password is already in use by another user' });
        }

        // Insert new user
        const { error: insertError } = await supabase
            .from('users')
            .insert([{ username: cleanUser, password }]);

        if (insertError) {
            console.error('Supabase Insert Error:', insertError);
            return res.status(500).json({ success: false, message: 'Database error: ' + insertError.message });
        }

        // Create profile entry
        await supabase
            .from('profiles')
            .upsert({ username: cleanUser }, { onConflict: 'username' });

        return res.json({ success: true, isNew: true, username: cleanUser });

    } catch (err) {
        return res.status(500).json({ success: false, message: 'Server error processing request' });
    }
});

// Profile Update Endpoint
app.post('/api/profile/update', async (req, res) => {
    const { username, bio, avatar_url } = req.body;
    if (!username) return res.status(400).json({ success: false, message: 'Username required' });

    const { error } = await supabase
        .from('profiles')
        .upsert({ username: username.toLowerCase(), bio, avatar_url }, { onConflict: 'username' });

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.json({ success: true, message: 'Profile updated!' });
});

// Fetch Profile Endpoint
app.get('/api/profile/:username', async (req, res) => {
    const { username } = req.params;
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username.toLowerCase())
        .maybeSingle();

    if (error || !data) return res.status(404).json({ success: false, message: 'User not found' });
    return res.json({ success: true, profile: data });
});

// Add Friend Endpoint
app.post('/api/friends/add', async (req, res) => {
    const { username, friendUsername } = req.body;
    if (!username || !friendUsername) return res.status(400).json({ success: false, message: 'Both usernames required' });

    const userA = username.toLowerCase().trim();
    const userB = friendUsername.toLowerCase().trim();

    if (userA === userB) return res.status(400).json({ success: false, message: 'Cannot add yourself' });

    const { error } = await supabase
        .from('friends')
        .insert([{ user_a: userA, user_b: userB, status: 'accepted' }]);

    if (error) return res.status(400).json({ success: false, message: 'Already friends or invalid request' });
    return res.json({ success: true, message: `Added ${friendUsername} as friend!` });
});

// List Friends Endpoint
app.get('/api/friends/:username', async (req, res) => {
    const user = req.params.username.toLowerCase().trim();
    const { data, error } = await supabase
        .from('friends')
        .select('*')
        .or(`user_a.eq.${user},user_b.eq.${user}`);

    if (error) return res.status(500).json({ success: false, message: error.message });

    const friendsList = data.map(f => f.user_a === user ? f.user_b : f.user_a);
    return res.json({ success: true, friends: friendsList });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
