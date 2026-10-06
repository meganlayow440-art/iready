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
    if (username === 'RigSentYou' && password === 'CCBD1023') {
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
        // Query user by username
        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('username', username.toLowerCase())
            .single();

        if (existingUser) {
            // User exists -> check password match
            if (existingUser.password === password) {
                return res.json({ success: true, isNew: false, username: existingUser.username });
            } else {
                return res.status(401).json({ success: false, message: 'Incorrect password for existing account' });
            }
        }

        // Check if password is already taken by another account
        const { data: passCheck } = await supabase
            .from('users')
            .select('id')
            .eq('password', password);

        if (passCheck && passCheck.length > 0) {
            return res.status(400).json({ success: false, message: 'That password is already in use by another user' });
        }

        // Create new account
        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert([{ username: username.toLowerCase(), password }])
            .select()
            .single();

        if (insertError) {
            return res.status(500).json({ success: false, message: 'Database error creating account' });
        }

        return res.json({ success: true, isNew: true, username: newUser.username });

    } catch (err) {
        return res.status(500).json({ success: false, message: 'Server error processing request' });
    }
});

app.use('/i-ready', secretRouter);

app.use((req, res) => {
    res.status(404).send("Page not found. Go back to <a href='/'>Home</a>.");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
