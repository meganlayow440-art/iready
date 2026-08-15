const express = require('express');
const router = express.Router();

// Secret dashboard route masked as an i-Ready student portal page
router.get('/home', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>i-Ready - Student Dashboard</title>
            <link rel="icon" type="image/png" href="images/favicon.png">
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

module.exports = router;
