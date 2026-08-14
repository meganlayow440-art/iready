from flask import Flask, render_template, request, jsonify, redirect, url_for

app = Flask(__name__)

VALID_USER = "RigsHere"
VALID_PASS = "GGs39"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/signin")
def signin_page():
    # Dedicated IXL sign-in page route
    return render_template("signin.html")

@app.route("/verify-login", methods=["POST"])
def verify_login():
    data = request.get_json() or {}
    user = data.get("username")
    passwd = data.get("password")
    
    if user == VALID_USER and passwd == VALID_PASS:
        return jsonify({"success": True})
    return jsonify({"success": False}), 401

@app.route("/learning-hub")
def secret_portal():
    return render_template("portal.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
