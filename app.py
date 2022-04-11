from util import interpreter, db

from flask import Flask, render_template, request, redirect, url_for, flash, session
from passlib.hash import md5_crypt



app = Flask(__name__)

@app.route('/')
def landing():
    return render_template("landing.html")

@app.route('/puzzle/<id>')
def puzzle(id):
    puzzle = db.get_puzzle(id)
    data = {
        "id": id,
        "title": puzzle[0]["title"],
        "question": puzzle[0]["description"],
        "instructions_allowed": [x.strip() for x in puzzle[0]["instructionsAllowed"].split(",")],
        "values_allowed":  [x.strip() for x in puzzle[0]["valuesAllowed"].split(",")],
        "registers_allowed": [x.strip() for x in puzzle[0]["registersAllowed"].split(",")],
        "tutorial": puzzle[0]["tutorialID"],
    }
    
    return render_template("puzzle.html", data=data, user = session['user'])

@app.route('/statistics')
def statistics():
    #id, solved, time taken, attempts, tutorial watched
    temp = [[1, True, 176, 2, True], [2, True, 211, 4, False], [3, False, 900, 6, True], [4, True, 4, 1, False], [5, False, 0, 0, 0], [6, True, 312, 3, True]]
    stats = {}
    stats['puzzles'] = []
    total = 0
    solved = 0
    for a in temp:
        d = {}
        [d['id'], d['solved'],d['time_taken'],d['attempts'],d['watched']]  = a 
        total += 1
        solved += 1 if d['solved'] else 0
        stats['puzzles'].append(d)

    stats['total_puzzles'] = total 
    stats['solved_puzzles'] = solved
    return render_template("statistics.html", stats=stats, user = session['user'])

@app.route('/home')
def home():
    if 'user' not in session:
        flash("You need to log in.")
        return redirect(url_for("landing"))

    return render_template("home.html", user = session['user'])

@app.route('/admin'){
    if 'user' not in session:
        flash("You need to log in.")
        return redirect(url_for("landing"))

    return render_template("home.html", user = session['user'])
}

#===============================non page stuff=====================

@app.route('/adduser', methods=["POST"])
def adduser():
    print(request.form)
    #Retrieves username, password
    username = request.form["username"]
    password = md5_crypt.hash(request.form["password"])

    success = db.add_user(username, password)
    if not success:
        flash('Error: User already exists')
        return redirect(url_for("landing"))

    session['user'] = username
    return redirect(url_for('home', user = session['user']))

@app.route('/login', methods=["POST"])
def login():
    #Retrieves username, password
    username = request.form["username"]
    password = request.form["password"]

    hashed_pass = db.get_password(username)
    if hashed_pass != [] and md5_crypt.verify(password,hashed_pass[0]['password']):
        session['user'] = username
        return redirect(url_for("home", user = session['user']))
    else:
        flash("Username or Password is incorrect")
        return redirect(url_for("landing"))



@app.route('/logout')
def logout():
    del session['user']
    return redirect(url_for('landing'))

@app.route('/interpret', methods=["POST"])
def interpret():
    code = open("code.mrtl", "w")
    code.write(request.form["code"])
    code.close()

    inter = interpreter.Interpreter("code.mrtl")
    inter.execute()

    def format_result(s):
        res = [str(a[0]) + "," + ",".join([str(b) for b in a[1]]) + "," + ",".join([str(c) for c in a[2]]) for a in s]
        return "\n".join(res)
    return format_result(inter.output)

app.debug = 1
app.secret_key = "a"
app.run()