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
        
        if username == 'RigsHere' and password == 'CCBD1023':
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
