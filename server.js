const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

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

// Fallback catch-all route for any missing paths
app.use((req, res) => {
    res.status(404).send("Page not found. Go back to <a href='/'>Home</a>.");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
