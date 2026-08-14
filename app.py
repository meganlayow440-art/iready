from flask import Flask, render_template, request, redirect, url_for, session

app = Flask(__name__)
app.secret_key = 'x9#mK$7qL!pZ2vR*wY8$bN3'

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/signin', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        # Check custom credentials
        if username == 'RigsHere' and password == 'CCBD1234':
            session['authenticated'] = True
            return redirect(url_for('secret_page'))
        else:
            error = 'Invalid username or password.'
            
    return render_template('login.html', error=error)

@app.route('/hidden-portal')
def secret_page():
    if not session.get('authenticated'):
        return redirect(url_for('login'))
    return render_template('secret.html')

@app.route('/logout')
def logout():
    session.pop('authenticated', None)
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)

3. templates/index.html

The main landing page mimicking the IXL dashboard layout.
HTML

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>IXL | Personalized K-12 learning</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f7f9fa; }
        header { background-color: #55b700; padding: 10px 30px; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 28px; font-weight: bold; background: #ffcc00; padding: 2px 10px; border-radius: 4px; color: #000; }
        nav a { color: white; text-decoration: none; margin-left: 20px; font-weight: bold; }
        .hero { background: linear-gradient(180deg, #44d5ff 0%, #ffffff 100%); text-align: center; padding: 50px 20px; }
        .hero h1 { color: #0056b3; font-size: 40px; }
        .btn-signin { background-color: #0070f3; color: white; padding: 8px 16px; border-radius: 4px; text-decoration: none; }
        .grades-container { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; padding: 40px; }
        .grade-card { background: white; border: 1px solid #cce5ff; border-radius: 8px; width: 300px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .grade-card h3 { color: #0056b3; margin-top: 0; }
        .grade-card ul { padding-left: 20px; color: #333; }
    </style>
</head>
<body>
    <header>
        <div style="display: flex; align-items: center; gap: 20px;">
            <span class="logo">IXL</span>
        </div>
        <nav>
            <a href="/">Learning</a>
            <a href="/">Assessment</a>
            <a href="/">Analytics</a>
            <a href="/signin" class="btn-signin">Sign in</a>
        </nav>
    </header>

    <div class="hero">
        <h1>IXL is personalized learning</h1>
        <p>Comprehensive K-12 curriculum, real-time analytics, and individualized guidance.</p>
    </div>

    <div class="grades-container">
        <div class="grade-card">
            <h3>Pre-K</h3>
            <ul>
                <li>Counting objects</li>
                <li>Length and size comparison</li>
                <li>Rhyming words</li>
            </ul>
        </div>
        <div class="grade-card">
            <h3>Kindergarten</h3>
            <ul>
                <li>Comparing numbers</li>
                <li>Shapes and patterns</li>
                <li>Plants and animals</li>
            </ul>
        </div>
        <div class="grade-card">
            <h3>First grade</h3>
            <ul>
                <li>Adding and subtracting</li>
                <li>Short and long vowels</li>
                <li>Rules and laws</li>
            </ul>
        </div>
    </div>
</body>
</html>
