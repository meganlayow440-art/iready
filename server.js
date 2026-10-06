const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const app = express();

const PORT = process.env.PORT || 3000;

// Supabase Connection Settings
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://hwhrsmftwowbxvauqopj.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3aHJzbWZ0d293Ynh2YXVxb3BqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMTM1MjcsImV4cCI6MjEwNjg4OTUyN30.LhHsXtRzqkeeQW2IqOrKSLIQSvVGiakySHKpUHyXIYg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const secretRouter = require('./secret');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Login portal check
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'RigSentYou' && password === '1111') {
        return res.redirect('/i-ready/home');
    } else {
        return res.redirect('/?error=invalid');
    }
});

// Account Creation / Login API powered by Supabase
app.post('/api/auth', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    try {
        const cleanUser = username.toLowerCase().trim();

        // Check if username exists
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

        // Insert new account
        const { error: insertError } = await supabase
            .from('users')
            .insert([{ username: cleanUser, password }]);

        if (insertError) {
            console.error('Supabase Insert Error:', insertError);
            return res.status(500).json({ success: false, message: 'Database error: ' + insertError.message });
        }

        return res.json({ success: true, isNew: true, username: cleanUser });

    } catch (err) {
        return res.status(500).json({ success: false, message: 'Server error processing request' });
    }
});

// --- Profile Update Route ---
app.post('/api/profile/update', async (req, res) => {
    const { username, bio, avatar_url } = req.body;
    if (!username) return res.status(400).json({ success: false, message: 'Username required' });

    const { data, error } = await supabase
        .from('profiles')
        .upsert({ username: username.toLowerCase(), bio, avatar_url }, { onConflict: 'username' });

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.json({ success: true, message: 'Profile updated!' });
});

// --- Fetch User Profile Route ---
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

// --- Add Friend Route ---
app.post('/api/friends/add', async (req, res) => {
    const { username, friendUsername } = req.body;
    if (!username || !friendUsername) return res.status(400).json({ success: false, message: 'Both usernames required' });

    const userA = username.toLowerCase();
    const userB = friendUsername.toLowerCase();

    if (userA === userB) return res.status(400).json({ success: false, message: 'Cannot add yourself' });

    const { error } = await supabase
        .from('friends')
        .insert([{ user_a: userA, user_b: userB, status: 'accepted' }]);

    if (error) return res.status(400).json({ success: false, message: 'Already friends or invalid request' });
    return res.json({ success: true, message: `Added ${friendUsername} as friend!` });
});

// --- List Friends Route ---
app.get('/api/friends/:username', async (req, res) => {
    const user = req.params.username.toLowerCase();
    const { data, error } = await supabase
        .from('friends')
        .select('*')
        .or(`user_a.eq.${user},user_b.eq.${user}`);

    if (error) return res.status(500).json({ success: false, message: error.message });

    const friendsList = data.map(f => f.user_a === user ? f.user_b : f.user_a);
    return res.json({ success: true, friends: friendsList });
});

app.use('/i-ready', secretRouter);

app.use((req, res) => {
    res.status(404).send("Page not found. Go back to <a href='/'>Home</a>.");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
