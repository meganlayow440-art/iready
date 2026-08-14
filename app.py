from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Secret credentials to unlock the disguised portal
VALID_USER = "RigsHere"
VALID_PASS = "GGs39"

@app.route("/")
def index():
    return render_template("index.html")

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
    # Hidden route masquerading with an educational/homework-style name
    return render_template("portal.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
