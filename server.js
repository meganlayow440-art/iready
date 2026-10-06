const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const app = express();

const PORT = process.env.PORT || 3000;

// Supabase Connection Settings
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://hwhrsmftwowbxvauqopj.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3aHJzbWZ0d293Ynh2YXVxb3BqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMTM1MjcsImV4cCI6MjEwNjg4OTUyN30.LhHsXtRzqkeeQW2IqOrKSLIQSvVGiakySHKpUHyXIYg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Import the separate secret route script
const secretRouter = require('./secret');

// Middleware to parse incoming form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Handle the login form submission
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check your custom credentials
    if (username === 'RigSentYou' && password === 'CCBD1023') {
        // Redirects to /i-ready/home which is managed by secret.js
        return res.redirect('/i-ready/home');
    } else {
        return res.redirect('/?error=invalid');
    }
});

// Mount the secret script routes
app.use('/i-ready', secretRouter);

// --- New Features Endpoints ---

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

// Fallback catch-all route for any missing paths
app.use((req, res) => {
    res.status(404).send("Page not found. Go back to <a href='/'>Home</a>.");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
