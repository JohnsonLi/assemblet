from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from passlib.hash import md5_crypt
 
import interpreter
from models import db


app = Flask(__name__)
app.secret_key = "a"
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:root@localhost/assemblet'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 
db.init_app(app)

from models import Users, Puzzle, Attempt, Tutorial, Admin

@app.route('/')
def landing():
    return render_template("landing.html")

@app.route('/puzzle/<id>')
def puzzle(id):
    id = int(id)
    if 'user' not in session:
        flash("You need to log in.")
        return redirect(url_for("landing"))
    puzzle = Puzzle.query.get(id)
    if puzzle is None:
        return redirect(url_for("home"))

    attempt = Attempt.query.get((session['user'], id))
    if (attempt == None):
        attempt = Attempt(session['user'], id, 0, 0, 0, 0)
        db.session.add(attempt)
        db.session.commit()

    data = {
        "id": id,
        "title": puzzle.title,
        "question": puzzle.description.replace('\r', "").replace('\n', "<br>"),
        "instructions_allowed": [x.strip() for x in puzzle.instructionsallowed.split(",")],
        "values_allowed":  [x.strip() for x in puzzle.valuesallowed.split(",")],
        "registers_allowed": [x.strip() for x in puzzle.registersallowed.split(",")],
        "tutorial": Tutorial.query.get(puzzle.tutorialid),
        "attempts": attempt.attempts,
        "time_taken": attempt.timetaken,
        "solved": attempt.solved
    }
    return render_template("puzzle.html", data=data, user = session['user'])
 
@app.route('/statistics')
def statistics():
    if 'user' not in session:
        flash("You need to log in.")
        return redirect(url_for("landing"))
    #id, solved, time taken, attempts, tutorial watched
    stats = {}
    stats['puzzles'] = Attempt.query.filter_by(username = session['user']).all()
    stats['extraInfo'] = {}
    solved = 0
    for a in stats['puzzles']:
        puzzle_info = Puzzle.query.get(a.puzzleid)
        extraInfo = {
            'title': puzzle_info.title,
            'instructions': puzzle_info.instructionsallowed
        }
        
        stats['extraInfo'][a.puzzleid] = extraInfo
        solved += 1 if a.solved else 0

    stats['total_puzzles'] = len(stats['puzzles'])
    stats['solved_puzzles'] = solved
    return render_template("statistics.html", stats=stats, user = session['user'])

@app.route('/home')
def home():
    if 'user' not in session:
        flash("You need to log in.")
        return redirect(url_for("landing"))
    puzzles = Puzzle.query.all()
    
    groups = {}
    for puzzle in puzzles:
        if puzzle.category not in groups:
            groups[puzzle.category] = []
        groups[puzzle.category].append(puzzle)

    if "" in groups:
        groups["Other"] = groups.pop("")

    sortedkeys = sorted(groups.keys())
    orderedgroups = []
    for key in sortedkeys:
        d = {
            "name": key,
            "puzzles": groups[key]
        }
        orderedgroups.append(d)
    return render_template("home.html", puzzles = orderedgroups, user = session['user'])

@app.route('/admin')
def admin():
    if 'user' not in session:
        flash("You need to log in.")
        return redirect(url_for("landing"))
    if Admin.query.get(session['user']) is None:
        return redirect(url_for("home"))

    puzzles = Puzzle.query.all()
    for puzzle in puzzles:
        puzzle.description = puzzle.description.replace('\r', "").replace('\n', "<br>")
    # TODO do this but for tutorials also
    # TODO make this admin only xd

    return render_template("admin.html", puzzles=puzzles, user = session['user'])

@app.route('/admintutorial')
def admintutorial():
    if 'user' not in session:
        flash("You need to log in.")
        return redirect(url_for("landing"))
    
    if Admin.query.get(session['user']) is None:
        return redirect(url_for("home"))

    tutorials = Tutorial.query.all()
    for tutorial in tutorials:
        tutorial.content = tutorial.content.replace('\r', "").replace('\n', "<br>")
    # TODO do this but for tutorials also
    # TODO make this admin only xd
    return render_template("admin_tutorial.html", tutorials=tutorials, user = session['user'])


#===============================non page stuff=====================

@app.route('/adduser', methods=["POST"])
def adduser():
    #Retrieves username, password
    username = request.form["username"]
    password = md5_crypt.hash(request.form["password"])

    try: 
        user = Users(username, password)
        db.session.add(user)
        db.session.commit()
    except Exception as e:
        print(e)
        return 'Error: User already exists'

    for puzzle in Puzzle.query.all():
        newAttempt = Attempt(username, puzzle.id, 0, 0, 0, 0)
        db.session.add(newAttempt)
    db.session.commit()

    session['user'] = username
    return "success"

@app.route('/login', methods=["POST"])
def login():
    #Retrieves username, password
    username = request.form["username"]
    password = request.form["password"]
    print(username)
    print(password)
    user = Users.query.get(username)
    if user != None and md5_crypt.verify(password,user.password):
        session['user'] = username
        return "success"
    else:
        return "Username or Password is incorrect"

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

    puzzle = Puzzle.query.get(id)
    db.session.delete(puzzle)
    db.session.commit()

    return redirect(url_for('admin'))

@app.route('/addpuzzle', methods=["POST"])
def add_puzzle():
    id = request.form["id"]
    title = request.form["title"]
    description = request.form["description"]
    tutorialid = int(request.form["tutorial-id"]) if request.form["tutorial-id"] != '' else None
    solution = request.form["solution"]
    instructionsallowed = request.form["instructions-allowed"]
    valuesallowed = request.form["values-allowed"]
    registersallowed = request.form["registers-allowed"]
    category = request.form["category"]

    puzzle = Puzzle(id, title, description, tutorialid, solution, instructionsallowed, valuesallowed, registersallowed, category)
    db.session.add(puzzle)
    db.session.commit()

    return redirect(url_for('admin'))

@app.route('/editpuzzle', methods=["POST"])
def edit_puzzle():
    id = request.form["id"]
    title = request.form["title"]
    description = request.form["description"]
    tutorialid = request.form["tutorial-id"]
    solution = request.form["solution"]
    instructionsallowed = request.form["instructions-allowed"]
    valuesallowed = request.form["values-allowed"]
    registersallowed = request.form["registers-allowed"]
    category = request.form["category"]

    puzzle = Puzzle.query.get(id)
    puzzle.title = title 
    puzzle.description = description
    puzzle.tutorialid = int(tutorialid) if tutorialid != '' else None
    puzzle.solution = solution
    puzzle.instructionsallowed = instructionsallowed
    puzzle.valuesallowed = valuesallowed
    puzzle.registersallowed = registersallowed
    puzzle.category = category

    db.session.commit()
    return redirect(url_for('admin'))

@app.route('/deletetutorial', methods=["POST"])
def delete_tutorial():
    id = list(request.form.keys())[0]

    tutorial = Tutorial.query.get(id)
    db.session.delete(tutorial)
    db.session.commit()

    return redirect(url_for('admintutorial'))

@app.route('/addtutorial', methods=["POST"])
def add_tutorial():
    id = request.form["id"]
    title = request.form["title"]
    content = request.form["content"]

    tutorial = Tutorial(id, title, content)
    db.session.add(tutorial)
    db.session.commit()

    return redirect(url_for('admintutorial'))

@app.route('/edittutorial', methods=["POST"])
def edit_tutorial():
    id = request.form["id"]
    title = request.form["title"]
    content = request.form["content"]

    tutorial = Tutorial.query.get(id)
    tutorial.title = title
    tutorial.content = content 
    
    db.session.commit()
    
    return redirect(url_for('admintutorial'))

@app.route('/checksolution', methods=["POST"])
def checksolution():
    id = request.form["id"]
    sol = request.form["solution"]
    ans = Puzzle.query.get(id)
    print(ans.solution)
    print(sol)
    print([str(a).strip() for a in sol.split(',')])
    print([b.strip() for b in ans.solution.split(',')])
    if [str(a).strip() for a in sol.split(',')] == [b.strip() for b in ans.solution.split(',')]:
        #HANDLE WINNING
        return "good"
    return "bad"
    

@app.route('/updateattempt', methods=["POST"])
def updateattempt():
    username = request.form["user"]
    id = request.form["id"]
    time_taken = request.form["timeTaken"]
    attempts = request.form["attempts"]

    attempt = Attempt.query.get((username, id))
    attempt.timetaken = time_taken
    attempt.attempts = attempts 
    
    db.session.commit()

    return "success"

@app.route('/succeedattempt', methods=["POST"])
def succeedattempt():
    username = request.form["user"]
    id = request.form["id"]

    attempt = Attempt.query.get((username, id))
    attempt.solved = 1

    db.session.commit()
    return "success"

if __name__ == '__main__':
    app.debug = 1
    app.run()
