from operator import methodcaller
import re
from traceback import print_tb
from util import interpreter, db

from flask import Flask, render_template, request, redirect, url_for, flash, session
from passlib.hash import md5_crypt



app = Flask(__name__)

@app.route('/')
def landing():
    return render_template("landing.html")

@app.route('/puzzle/<id>')
def puzzle(id):
    if 'user' not in session:
        flash("You need to log in.")
        return redirect(url_for("landing"))
    puzzle = db.get_puzzle(id)
    if len(puzzle) == 0:
        return redirect(url_for("home"))
    user_data = db.get_attempt(session['user'], int(id))
    if (user_data == ()):
        user_data = {
            'username': session['user'],
            'puzzleID': id,
            'attempts': 0,
            'timeTaken': 0,
            'solved': 0,
            'watchedTutorial': 0
        }
    else:
        user_data = user_data[0]
    if 'tutorialID' in puzzle:
        tutorial = db.get_tutorial(puzzle['tutorialID'])
        if tutorial == ():
            tutorial = None
    else:
        tutorial = None
    data = {
        "id": id,
        "title": puzzle[0]["title"],
        "question": puzzle[0]["description"].replace('\r', "").replace('\n', "<br>"),
        "instructions_allowed": [x.strip() for x in puzzle[0]["instructionsAllowed"].split(",")],
        "values_allowed":  [x.strip() for x in puzzle[0]["valuesAllowed"].split(",")],
        "registers_allowed": [x.strip() for x in puzzle[0]["registersAllowed"].split(",")],
        "tutorial": tutorial,
        "attempts": user_data["attempts"],
        "time_taken": user_data["timeTaken"],
        "solved": user_data["solved"]
    }
    return render_template("puzzle.html", data=data, user = session['user'])
 
@app.route('/statistics')
def statistics():
    if 'user' not in session:
        flash("You need to log in.")
        return redirect(url_for("landing"))
    #id, solved, time taken, attempts, tutorial watched
    stats = {}
    stats['puzzles'] = db.get_user_attempts(session['user'])
    solved = 0
    for a in stats['puzzles']:
        solved += 1 if a['solved'] else 0

    stats['total_puzzles'] = len(stats['puzzles'])
    stats['solved_puzzles'] = solved
    return render_template("statistics.html", stats=stats, user = session['user'])

@app.route('/home')
def home():
    if 'user' not in session:
        flash("You need to log in.")
        return redirect(url_for("landing"))

    return render_template("home.html", user = session['user'])

@app.route('/admin')
def admin():
    if 'user' not in session:
        flash("You need to log in.")
        return redirect(url_for("landing"))

    puzzles = db.get_puzzles()
    for puzzle in puzzles:
        puzzle["description"] = puzzle["description"].replace('\r', "").replace('\n', "<br>")
    # TODO do this but for tutorials also
    # TODO make this admin only xd

    return render_template("admin.html", puzzles=puzzles, user = session['user'])

@app.route('/admintutorial')
def admintutorial():
    if 'user' not in session:
        flash("You need to log in.")
        return redirect(url_for("landing"))

    tutorials = db.get_tutorials()
    for tutorial in tutorials:
        tutorial["content"] = tutorial["content"].replace('\r', "").replace('\n', "<br>")
    # TODO do this but for tutorials also
    # TODO make this admin only xd
    print(tutorials)  
    return render_template("admin_tutorial.html", tutorials=tutorials, user = session['user'])


#===============================non page stuff=====================

@app.route('/adduser', methods=["POST"])
def adduser():
    #Retrieves username, password
    username = request.form["username"]
    password = md5_crypt.hash(request.form["password"])

    success = db.add_user(username, password)
    if not success:
        flash('Error: User already exists')
        return redirect(url_for("landing"))

    db.add_attempts(username)
    session['user'] = username
    return redirect(url_for('home'))

@app.route('/login', methods=["POST"])
def login():
    #Retrieves username, password
    username = request.form["username"]
    password = request.form["password"]

    hashed_pass = db.get_password(username)
    print(hashed_pass)
    if hashed_pass != () and md5_crypt.verify(password,hashed_pass[0]['password']):
        session['user'] = username
        return redirect(url_for("home"))
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

@app.route('/deletepuzzle', methods=["POST"])
def delete_puzzle():
    id = list(request.form.keys())[0]

    db.delete_puzzle(id)
    return redirect(url_for('admin'))

@app.route('/addpuzzle', methods=["POST"])
def add_puzzle():
    id = request.form["id"]
    title = request.form["title"]
    description = request.form["description"]
    tutorialID = request.form["tutorial-id"]
    solution = request.form["solution"]
    instructionsAllowed = request.form["instructions-allowed"]
    valuesAllowed = request.form["values-allowed"]
    registersAllowed = request.form["registers-allowed"]

    db.add_puzzle(id, title, description, tutorialID, solution, instructionsAllowed, valuesAllowed, registersAllowed)
    return redirect(url_for('admin'))

@app.route('/editpuzzle', methods=["POST"])
def edit_puzzle():
    id = request.form["id"]
    title = request.form["title"]
    description = request.form["description"]
    tutorialID = request.form["tutorial-id"]
    solution = request.form["solution"]
    instructionsAllowed = request.form["instructions-allowed"]
    valuesAllowed = request.form["values-allowed"]
    registersAllowed = request.form["registers-allowed"]

    db.edit_puzzle(id, title, description, tutorialID, solution, instructionsAllowed, valuesAllowed, registersAllowed)
    return redirect(url_for('admin'))

@app.route('/checksolution', methods=["POST"])
def checksolution():
    id = request.form["id"]
    sol = request.form["solution"]
    ans = db.get_puzzle(id)

    if ",".join([str(a) for a in sol]) == ans[0]["solution"]:
        #HANDLE WINNING
        return "good"
    return "bad"
    

@app.route('/updateattempt', methods=["POST"])
def updateattempt():
    username = request.form["user"]
    id = request.form["id"]
    time_taken = request.form["timeTaken"]
    attempts = request.form["attempts"]
    db.update_attempt(username,id,attempts, time_taken)
    return "success"

@app.route('/succeedattempt', methods=["POST"])
def succeedattempt():
    username = request.form["user"]
    id = request.form["id"]
    db.succeed_attempt(username,id)
    return "success"

app.debug = 1
app.secret_key = "a"
app.run()
