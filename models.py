from datetime import datetime
import re

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Users(db.Model):
    username = db.Column(db.String(), primary_key=True)
    password = db.Column(db.String(), nullable=False)

    def __init__(self, username, password):
        self.username = username
        self.password = password
    
class Tutorial(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(), nullable=False)
    content = db.Column(db.String(), nullable=False)

    def __init__(self, id, title, content):
        self.id = id
        self.title = title
        self.content = content

class Puzzle(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String(), nullable=False)
    description = db.Column(db.String(), nullable=False)
    tutorialid = db.Column(db.Integer)
    solution = db.Column(db.String(), nullable=False)
    instructionsallowed = db.Column(db.String(), nullable=False)
    valuesallowed = db.Column(db.String(), nullable=False)
    registersallowed = db.Column(db.String(), nullable=False)
    category = db.Column(db.String())

    def __init__(self, id, title, description, tutorialID, solution, instructionsAllowed, valuesAllowed, registersAllowed, category):
        self.id = id
        self.title = title
        self.description = description
        self.tutorialid = tutorialID
        self.solution = solution
        self.instructionsallowed = instructionsAllowed
        self.valuesallowed = valuesAllowed
        self.registersallowed = registersAllowed
        self.category = category

class Attempt(db.Model):
    username = db.Column(db.String(), primary_key=True)
    puzzleid = db.Column(db.Integer, primary_key=True)
    attempts = db.Column(db.Integer, nullable=False)
    timetaken = db.Column(db.Integer, nullable=False)
    solved = db.Column(db.Integer, nullable=False)
    watchedtutorial = db.Column(db.Integer, nullable=False)

    def __init__(self, username, puzzleID, attempts, timeTaken, solved, watchedTutorial):
        self.username = username
        self.puzzleid = puzzleID
        self.attempts = attempts
        self.timetaken = timeTaken
        self.solved = solved
        self.watchedtutorial = watchedTutorial

class Admin(db.Model):
    username = db.Column(db.String(), primary_key=True)

    def __init__(self, username):
        self.username = username 