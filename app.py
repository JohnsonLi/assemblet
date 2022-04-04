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
    return render_template("statistics.html")



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