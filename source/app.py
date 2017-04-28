from __future__ import print_function # In python 2.7
from flask import Flask
from flask import Flask, flash, redirect, render_template, request, session, abort, jsonify
import os, sys, json

app = Flask(__name__)

@app.errorhandler(404)
def not_found(error=None):
    message = {
            'status': 404,
            'message': 'Not Found: ' + request.url,
            'data': request.form,
    }
    resp = jsonify(message)
    resp.status_code = 404

    return render_template('page_404.html')

@app.route('/data', methods=['GET','POST'])
def api_data():
    if request.method == "POST":
        d = json.loads(request.data)
        print('Posted! {}'.format(d["Name"]),file=sys.stderr)
        data = {"Name":"Jimmy"}
        return jsonify(d)
    elif request.method == "GET":
        print('Gotted!',file=sys.stderr)
    data = {"Name":"Jim"}
    return jsonify(data)

@app.route('/login', methods=['POST'])
def admin_login():
    data = json.loads(request.data)
    if data['password'] == 'password' and data['username'] == 'admin':
        session['logged_in'] = True
    else:
        print('wrong password!',file=sys.stderr)
    return "Success!"

@app.route("/")
def index():
    print('home!',file=sys.stderr)
    if not session.get('logged_in'):
        print('no session!',file=sys.stderr)
        return render_template('login.html')
    else:
        return render_template('home.html')

if __name__ == "__main__":
    app.secret_key = os.urandom(12)
    app.run(host='0.0.0.0', port=5001, threaded=True, debug=True)
