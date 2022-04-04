from util import interpreter

from flask import Flask,render_template, request
app = Flask(__name__)

@app.route('/')
def landing():
    return render_template("landing.html")

@app.route('/puzzle/<id>')
def puzzle(id):
    #TODO: load puzzle from db given ID
    #data = puzzleinfo(id)
    data = {
        "question": "Get 3 into register 4",
        "instructions_allowed": ["move", "add", "sub"],
        "values_allowed":  [3,4,7,2],
        "registers_allowed": ["a", "b", "c", "d","e"],
    }
    
    return render_template("puzzle.html", data=data)

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
    return render_template("statistics.html", stats=stats)



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
app.run()