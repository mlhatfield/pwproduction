from __future__ import print_function # In python 2.7
from flask import Flask, Response, redirect, url_for, request, session, abort, \
                                flash, redirect, render_template, jsonify
from flask.ext.login import LoginManager, UserMixin, \
                                login_required, login_user, logout_user
from Crypto.Cipher import XOR
import base64, os, sys, json
import sqlite3
import flask_login


def encrypt(key, plaintext):
  cipher = XOR.new(key)
  return base64.b64encode(cipher.encrypt(plaintext))

def decrypt(key, ciphertext):
  cipher = XOR.new(key)
  return cipher.decrypt(base64.b64decode(ciphertext))


# Set up database and connect
ecr = "jim is awesome"
if os.path.exists('users.db') == False:
    with sqlite3.connect('users.db') as f:
        pass
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE users (uid text, uname text, email text, pw text, role text)''')
    q = '''INSERT INTO users VALUES ('{}','{}','{}','{}','admin')'''.format(os.environ["ADMIN_ID"],
                                                                    os.environ["ADMIN_USERNAME"],
                                                                    os.environ["ADMIN_EMAIL"],
                                                                    encrypt(ecr, os.environ["ADMIN_PW"]))
    c.execute(q)
    conn.commit()

if os.path.exists('labor.db') == False:
    with sqlite3.connect('labor.db') as f:
        pass
    conn = sqlite3.connect('labor.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE labor (siteid text, sitename text, po text, podate date, labortype text, workername text, units text, submitted boolean)''')
    q = '''INSERT INTO labor VALUES ('{}','{}','{}','{}','{}','{}','{}','{}')'''.format("admin",
                                                                    "Jims Site","111", "01/01/1999","forklift", "Jimm Sweeney", "8",False)
    c.execute(q)

    c.execute('''CREATE TABLE rate (labortype text, payrate REAL, billrate REAL, uom text)''')
    c.execute('''INSERT INTO rate VALUES ('General Labor Hourly','10.11','13.0000','Hour')''')

    conn.commit()

app = Flask(__name__)

# config
app.config.update(
    DEBUG = True,
    SECRET_KEY = 'secret_xxx'
)

# flask-login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"



class User(UserMixin):

    def __init__(self, id):
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        strqry = 'SELECT uname, role FROM users WHERE uid = \"{}\"'.format(id)
        q = c.execute(strqry)
        arr = [row for row in q]
        if len(arr) > 0:
            self.name = arr[0][0]
            self.role = arr[0][1]
        self.id = id
        conn.close()
        # self.name =
        # self.password = encrypt(ecr, self.name + "_secret")

    def __repr__(self):
        return "%s" % (self.id)

# some protected url
@app.route('/')
@login_required
def home():
    return render_template("home.html")


# somewhere to login
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        strqry = 'SELECT pw, uid FROM users WHERE uname = \"{}\"'.format(username)
        q = c.execute(strqry)

        pwarr = [row for row in q]
        # print(pwarr,file=sys.stderr)
        if len(pwarr) > 0:
            pw = pwarr[0][0]
            uid = pwarr[0][1]
        else:
            conn.close()
            return abort(401)

        if password == decrypt(ecr,pw):
            id = uid
            user = User(id)
            login_user(user)
            conn.close()
            return redirect(request.args.get("next"))
        else:
            conn.close()
            return abort(401)
    else:
        return render_template('login.html')

# somewhere to logout
@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect("/")


# handle login failed
@app.errorhandler(401)
def page_not_found(e):
    return render_template('page_403.html')

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

# callback to reload the user object
@login_manager.user_loader
def load_user(userid):
    return User(userid)

@app.route("/user-management")
@login_required
def user_management():
    u = User(flask_login.current_user)
    if u.role != "admin":
        return abort(401)
    else:
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        strqry = 'SELECT uid, uname, email, role FROM users'
        q = c.execute(strqry)
        user_data = [row for row in q]
        conn.close()
        return render_template('user_management.html', userdata=user_data)

@app.route("/pw-reset", methods=["POST"])
def user_pw_reset():
    if request.method == 'POST':
        data = json.loads(request.data)
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        uid = data["userid"]
        pw = encrypt(ecr,data["pw"])
        strqry = """UPDATE users SET pw = '{}' WHERE uid = '{}' """.format(pw,uid)
        q = c.execute(strqry)
        conn.commit()
        conn.close()
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

@app.route("/create-user", methods=["POST"])
def user_create():
    if request.method == 'POST':
        data = json.loads(request.data)
        uname = data["username"]
        email = data["email"]
        pw = encrypt(ecr,data["pw"])
        role = data["role"]
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        names = 'SELECT uname FROM users'
        n = c.execute(names)
        user_names = [row[0] for row in n]
        # print(user_names,file=sys.stderr)
        if uname not in user_names:
            lastid = 'SELECT uid FROM users ORDER BY uid DESC LIMIT 1'
            lastq = c.execute(lastid)
            next_id = str(int([row for row in lastq][0][0]) + 1)
            strqry = """INSERT INTO users VALUES ('{}','{}','{}','{}','{}')""".format(next_id, uname, email, pw, role)
            q = c.execute(strqry)
            conn.commit()
        conn.close()
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

@app.route("/update-user", methods=["POST"])
def user_edit():
    if request.method == 'POST':
        data = json.loads(request.data)
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        uid = data["userid"]
        uname = data["username"]
        email = data["email"]
        role = data["role"]
        strqry = """UPDATE users SET uname = '{}', email = '{}', role = '{}' WHERE uid = '{}' """.format(uname,email,role,uid)
        q = c.execute(strqry)
        conn.commit()
        conn.close()
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

@app.route("/delete-user", methods=["POST"])
def user_delete():
    if request.method == 'POST':
        data = json.loads(request.data)
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        uid = data["userid"]
        strqry = """DELETE from users WHERE uid = '{}' """.format(uid)
        q = c.execute(strqry)
        conn.commit()
        conn.close()
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

@app.route("/po-management", methods=["GET","POST"])
@login_required
def po_management():
    u = User(flask_login.current_user.role)
    conn = sqlite3.connect('labor.db')
    c = conn.cursor()
    if str(u) == "admin":
        print("1",file=sys.stderr)
        strqry = """SELECT siteid, sitename, po, podate, labortype, workername, units, submitted, rowid FROM labor WHERE submitted = 'False'"""
    else:
        print("2",file=sys.stderr)
        strqry = """SELECT siteid, sitename, po, podate, labortype, workername, units, submitted, rowid FROM labor WHERE siteid = '{}' AND submitted = 'False'""".format(u)
    q = c.execute(strqry)
    labor_data = [row for row in q]

    strqry = """SELECT labortype FROM rate"""
    q = c.execute(strqry)
    labor_selections = [row for row in q]
    conn.close()
    print(u,file=sys.stderr)
    return render_template('po_management.html', labor_data=labor_data, labor_selections=labor_selections)

@app.route("/create-po-entry", methods=["POST"])
def create_po_entry():
    u = User(flask_login.current_user.role)
    if request.method == 'POST':
        data = json.loads(request.data)
        ponum = data["ponum"]
        polabor = data["polabor"]
        podate = data["podate"]
        poworker = data["poworker"]
        pounit = data["pounit"]
        strqry = """INSERT INTO labor VALUES ('{}','{}','{}','{}','{}','{}','{}','{}')""".format(u,"test-site", ponum, podate, polabor, poworker, pounit,False)
        conn = sqlite3.connect('labor.db')
        c = conn.cursor()
        q = c.execute(strqry)
        conn.commit()
        conn.close()
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

@app.route("/update-po-entry", methods=["POST"])
def update_po_entry():
    u = User(flask_login.current_user.role)
    if request.method == 'POST':
        data = json.loads(request.data)
        porowid = data["porowid"]
        ponum = data["ponum"]
        polabor = data["polabor"]
        podate = data["podate"]
        pounit = data["pounit"]
        poworker = data["poworker"]
        strqry = """UPDATE labor SET po = '{}', podate = '{}', labortype = '{}', workername = '{}', units = '{}' WHERE rowid = '{}' """.format(ponum,podate,polabor,poworker,pounit,porowid)
        conn = sqlite3.connect('labor.db')
        c = conn.cursor()
        q = c.execute(strqry)
        conn.commit()
        conn.close()
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

@app.route("/delete-po-entry", methods=["POST"])
def delete_po_entry():
    u = User(flask_login.current_user.role)
    if request.method == 'POST':
        data = json.loads(request.data)
        porowid = data["porowid"]
        print(porowid,file=sys.stderr)
        strqry = """DELETE from labor WHERE rowid = '{}' """.format(porowid)
        conn = sqlite3.connect('labor.db')
        c = conn.cursor()
        q = c.execute(strqry)
        conn.commit()
        conn.close()
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

@app.route("/submit-site-pos", methods=["POST"])
def submit_site_pos():
    u = User(flask_login.current_user.role)
    if request.method == 'POST':
        data = json.loads(request.data)
        strqry = """UPDATE labor SET submitted = 'True' WHERE siteid = '{}'""".format(u)
        conn = sqlite3.connect('labor.db')
        c = conn.cursor()
        q = c.execute(strqry)
        conn.commit()
        conn.close()
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

@app.route("/labor-tables", methods=["GET","POST"])
@login_required
def labor_tables():
    u = User(flask_login.current_user.role)
    print(u,file=sys.stderr)
    if str(u) != "admin":
        return abort(401)
    else:
        strqry = """SELECT *, rowid FROM rate"""
        conn = sqlite3.connect('labor.db')
        c = conn.cursor()
        q = c.execute(strqry)
        rate_data = [row for row in q]
        conn.close()
        return render_template('labor_tables.html',rate_data=rate_data)

@app.route("/create-labor-entry", methods=["POST"])
def create_labor_entry():
    u = User(flask_login.current_user.role)
    if request.method == 'POST':
        data = json.loads(request.data)
        labortype = data["labortype"]
        payrate = data["laborpay"]
        billrate = data["laborbill"]
        uom = data["laboruom"]
        strqry = """INSERT INTO rate VALUES ('{}','{}','{}','{}')""".format(labortype, payrate, billrate, uom)
        conn = sqlite3.connect('labor.db')
        c = conn.cursor()
        q = c.execute(strqry)
        conn.commit()
        conn.close()
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

@app.route("/update-labor-entry", methods=["POST"])
def update_labor_entry():
    u = User(flask_login.current_user.role)
    if request.method == 'POST':
        data = json.loads(request.data)
        laborrowid = data["laborrowid"]
        labortype = data["labortype"]
        laboruom = data["laboruom"]
        laborpay = data["laborpay"]
        laborbill = data["laborbill"]
        strqry = """UPDATE rate SET labortype = '{}', uom = '{}', payrate = '{}', billrate = '{}' WHERE rowid = '{}' """.format(labortype,laboruom,laborpay,laborbill,laborrowid)
        conn = sqlite3.connect('labor.db')
        c = conn.cursor()
        q = c.execute(strqry)
        conn.commit()
        conn.close()
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

@app.route("/delete-labor-entry", methods=["POST"])
def delete_labor_entry():
    u = User(flask_login.current_user.role)
    if request.method == 'POST':
        data = json.loads(request.data)
        laborrowid = data["laborrowid"]
        strqry = """DELETE from rate WHERE rowid = '{}' """.format(laborrowid)
        conn = sqlite3.connect('labor.db')
        c = conn.cursor()
        q = c.execute(strqry)
        conn.commit()
        conn.close()
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, threaded=True, debug=True)
