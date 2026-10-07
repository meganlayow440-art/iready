const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase Settings
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://hwhrsmftwowbxvauqopj.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3aHJzbWZ0d293Ynh2YXVxb3BqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMTM1MjcsImV4cCI6MjEwNjg4OTUyN30.LhHsXtRzqkeeQW2IqOrKSLIQSvVGiakySHKpUHyXIYg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Import secret router
const secretRouter = require('./secret');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Login handler
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'RigSentYou' && password === 'CCBD1023') {
        return res.redirect('/i-ready/home');
    } else {
        return res.redirect('/?error=invalid');
    }
});

// Mount secret script routes
app.use('/i-ready', secretRouter);

// Chat Room API Routes
app.post('/api/chat/send', async (req, res) => {
    const { username, password, message } = req.body;
    if (!username || !message) return res.status(400).json({ success: false, message: 'Missing fields' });

    try {
        const { error } = await supabase
            .from('messages')
            .insert([{ username, password, message, created_at: new Date() }]);

        if (error) return res.status(500).json({ success: false, message: error.message });
        return res.json({ success: true });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

app.get('/api/chat/messages', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) return res.status(500).json({ success: false, messages: [] });
        return res.json({ success: true, messages: data ? data.reverse() : [] });
    } catch (err) {
        return res.status(500).json({ success: false, messages: [] });
    }
});

// Fallback catch-all route
app.use((req, res) => {
    res.status(404).send("Page not found. Go back to <a href='/'>Home</a>.");
});

app.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
});
