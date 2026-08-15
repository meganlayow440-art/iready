const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

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
        return res.redirect('/secret-dashboard');
    } else {
        return res.redirect('/?error=invalid');
    }
});

// Secret dashboard route (the hidden part of the site)
app.get('/secret-dashboard', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Secret Area</title>
            <style>
                body { background-color: #121212; color: #00ffcc; font-family: Arial, sans-serif; text-align: center; padding-top: 100px; }
                h1 { font-size: 3rem; text-shadow: 0 0 10px #00ffcc; }
                p { font-size: 1.2rem; color: #ffffff; }
                a { color: #ff00ff; text-decoration: none; font-weight: bold; }
            </style>
        </head>
        <body>
            <h1>Welcome to the Secret Zone</h1>
            <p>You have successfully bypassed authorization using the hidden credentials.</p>
            <br>
            <a href="/">Log out</a>
        </body>
        </html>
    `);
});

// Fallback catch-all route for any missing paths
app.use((req, res) => {
    res.status(404).send("Page not found. Go back to <a href='/'>Home</a>.");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
