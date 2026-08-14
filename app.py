from flask import Flask, render_template, request, jsonify, redirect, url_for

app = Flask(__name__)

# Real credentials (takes you to the arcade portal)
ADMIN_USER = "RigSentYou"
ADMIN_PASS = "CCBD1023"

# Decoy credentials (takes you to the real-looking homework/practice page)
DECOY_USER = "AidenMarcell3"
DECOY_PASS = "24010030"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/signin")
def signin_page():
    return render_template("signin.html")

@app.route("/verify-login", methods=["POST"])
def verify_login():
    data = request.get_json() or {}
    user = data.get("username")
    passwd = data.get("password")
    
    if user == ADMIN_USER and passwd == ADMIN_PASS:
        return jsonify({"success": True, "redirect": "/learning-hub"})
    elif user == DECOY_USER and passwd == DECOY_PASS:
        return jsonify({"success": True, "redirect": "/homework-practice"})
    
    return jsonify({"success": False}), 401

@app.route("/learning-hub")
def secret_portal():
    return render_template("portal.html")

@app.route("/homework-practice")
def homework_practice():
    return render_template("homework.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
