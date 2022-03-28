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

    data = None
    return render_template("puzzle.html", data=data)

@app.route('/interpret', methods=["POST"])
def interpret():
    # JOHNSONNNN this is where you put ur call u can do this :D
    #im gonna call this w ajax so the page doesnt need to reload
    code = open("code.mrtl", "w")
    code.write(request.form["code"])
    code.close()

    inter = interpreter.Interpreter("code.mrtl")
    inter.execute()
    return inter.output

app.debug = 1
app.run()