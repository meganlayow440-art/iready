const express = require('express');
const path = require('path');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase Settings
const SUPABASE_URL = process.env.SUPABASE_URL;
// Use the service key on the server (it bypasses RLS, so the tables can stay locked
// to the public anon key). Falls back to the anon key if you haven't set it up yet.
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing SUPABASE_URL and SUPABASE_SERVICE_KEY (or SUPABASE_ANON_KEY) environment variables.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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

// ---------- Chat accounts (username + password required) ----------
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const TOKEN_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

function hashPassword(password, salt) {
    return crypto.scryptSync(password, salt, 64).toString('hex');
}

function signToken(username) {
    const payload = Buffer.from(JSON.stringify({ u: username, t: Date.now() })).toString('base64url');
    const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
    return payload + '.' + sig;
}

function verifyToken(token) {
    if (typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const expected = crypto.createHmac('sha256', SESSION_SECRET).update(parts[0]).digest('base64url');
    const a = Buffer.from(parts[1]);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    try {
        const data = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
        if (!data.u || Date.now() - data.t > TOKEN_MAX_AGE_MS) return null;
        return data.u;
    } catch (e) {
        return null;
    }
}

// Tiny in-memory rate limiter (per IP)
const hits = new Map();
function rateLimited(key, max, windowMs) {
    const now = Date.now();
    const entry = hits.get(key) || { count: 0, start: now };
    if (now - entry.start > windowMs) { entry.count = 0; entry.start = now; }
    entry.count++;
    hits.set(key, entry);
    return entry.count > max;
}

// Chat Room API Routes
app.post('/api/chat/auth', async (req, res) => {
    if (rateLimited('auth:' + req.ip, 20, 15 * 60 * 1000)) {
        return res.status(429).json({ success: false, message: 'Too many attempts. Try again later.' });
    }

    const username = String(req.body.username || '').trim();
    const password = String(req.body.password || '');

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required' });
    }
    if (username.length > 20 || !/^[A-Za-z0-9_ .-]+$/.test(username)) {
        return res.status(400).json({ success: false, message: 'Username: up to 20 letters, numbers, spaces, _ . -' });
    }
    if (password.length < 4 || password.length > 100) {
        return res.status(400).json({ success: false, message: 'Password must be 4-100 characters' });
    }

    const usernameKey = username.toLowerCase();

    try {
        const { data: existing, error } = await supabase
            .from('chat_users')
            .select('username, salt, password_hash')
            .eq('username_key', usernameKey)
            .maybeSingle();

        if (error) return res.status(500).json({ success: false, message: 'Server error' });

        if (existing) {
            const attempt = Buffer.from(hashPassword(password, existing.salt), 'hex');
            const stored = Buffer.from(existing.password_hash, 'hex');
            if (attempt.length !== stored.length || !crypto.timingSafeEqual(attempt, stored)) {
                return res.status(401).json({ success: false, message: 'Incorrect password' });
            }
            return res.json({ success: true, username: existing.username, token: signToken(existing.username) });
        }

        // New username: create the account
        const salt = crypto.randomBytes(16).toString('hex');
        const { error: insertError } = await supabase
            .from('chat_users')
            .insert([{ username, username_key: usernameKey, salt, password_hash: hashPassword(password, salt) }]);

        if (insertError) return res.status(500).json({ success: false, message: 'Could not create account' });
        return res.json({ success: true, username, token: signToken(username) });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/api/chat/send', async (req, res) => {
    const header = req.get('Authorization') || '';
    const username = verifyToken(header.replace(/^Bearer\s+/i, ''));
    if (!username) return res.status(401).json({ success: false, message: 'Please log in again' });

    if (rateLimited('send:' + username, 20, 60 * 1000)) {
        return res.status(429).json({ success: false, message: 'Slow down a little' });
    }

    const message = String(req.body.message || '').trim();
    if (!message) return res.status(400).json({ success: false, message: 'Message is empty' });
    if (message.length > 300) return res.status(400).json({ success: false, message: 'Message too long (300 max)' });

    try {
        const { error } = await supabase
            .from('messages')
            .insert([{ username, message, created_at: new Date() }]);

        if (error) return res.status(500).json({ success: false, message: 'Could not send message' });
        return res.json({ success: true });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/api/chat/messages', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('messages')
            .select('username, message, created_at')
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
