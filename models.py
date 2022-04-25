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

    def __init__(self, id, title, description, tutorialID, solution, instructionsAllowed, valuesAllowed, registersAllowed):
        self.id = id
        self.title = title
        self.description = description
        self.tutorialid = tutorialID
        self.solution = solution
        self.instructionsallowed = instructionsAllowed
        self.valuesallowed = valuesAllowed
        self.registersallowed = registersAllowed

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





def add_user(username, password):
    cursor = conn.cursor()
    try:
        query = 'INSERT INTO User(username, password) values (%s,%s)'
        cursor.execute(query, (username, password))
        conn.commit()
    except Exception as e:
        print(e)
        return False
    cursor.close()
    return True
    
    
def get_password(username):
    cursor = conn.cursor()
    try:
        query = 'SELECT password FROM User WHERE username = %s'
        cursor.execute(query, (username,))
    except Exception as e:
        print(e)
        return []
    password = cursor.fetchall()
    cursor.close()
    print(password)
    return password

def get_puzzles():
    cursor = conn.cursor()
    try:
        query = 'SELECT * FROM Puzzle'
        cursor.execute(query)
    except Exception as e:
        print(e)
        return []
    cursor.close()
    return cursor.fetchall()

def get_puzzle(id):
    cursor = conn.cursor()
    try:
        query = 'SELECT * FROM Puzzle WHERE id = %s'
        cursor.execute(query, (id,))
    except Exception as e:
        print(e)
        return []
    cursor.close()
    return cursor.fetchall()

def add_puzzle(id, title, description, tutorialID, solution, instructionsAllowed, valuesAllowed, registersAllowed):
    cursor = conn.cursor()
    try:
        query = 'INSERT INTO Puzzle(id, title, description, tutorialID, solution, instructionsAllowed, valuesAllowed, registersAllowed) values (%s,%s,%s,%s,%s,%s,%s,%s)'
        cursor.execute(query, (id, title, description, tutorialID, solution, instructionsAllowed, valuesAllowed, registersAllowed))
        conn.commit()
    except Exception as e:
        print(e)
        return False
    cursor.close()
    return True

def edit_puzzle(id, title, description, tutorialID, solution, instructionsAllowed, valuesAllowed, registersAllowed):
    cursor = conn.cursor()
    tutorialID = None if tutorialID == "" else tutorialID
    try:
        query = 'UPDATE Puzzle SET title = %s, description = %s, tutorialID = %s, solution = %s, instructionsAllowed = %s, valuesAllowed = %s, registersAllowed = %s WHERE id = %s'
        cursor.execute(query, (title, description, tutorialID, solution, instructionsAllowed, valuesAllowed, registersAllowed, id))
        conn.commit()
    except Exception as e:
        print(e)
        return False
    cursor.close()
    return True

def delete_puzzle(id):
    cursor = conn.cursor()
    try:
        query = 'DELETE FROM Puzzle WHERE id = %s'
        cursor.execute(query, (id,))
        conn.commit()
    except Exception as e:
        print(e)
        return False
    cursor.close()
    return True

def add_attempts(username):
    cursor = conn.cursor()
    puzzles = get_puzzles()
    for puzzle in puzzles:
        id = puzzle['id']
        query = 'INSERT INTO Attempt(username, puzzleID, attempts, timeTaken, solved, watchedTutorial) VALUES (%s, %s, 0, 0, 0, 0)'
        cursor.execute(query, (username, id))
    conn.commit()
    cursor.close()

def get_attempt(username, id):
    cursor = conn.cursor()
    query = 'SELECT * FROM Attempt WHERE username = %s AND puzzleID = %s'
    cursor.execute(query, (username, id))
    cursor.close()
    return cursor.fetchall()

def update_attempt(username, id, attempts, timeTaken):
    cursor = conn.cursor()
    query = 'UPDATE Attempt SET attempts = %s, timeTaken = %s WHERE username = %s AND puzzleID = %s'
    cursor.execute(query, (attempts, timeTaken, username, id))
    conn.commit()
    cursor.close()

def get_user_attempts(username):
    cursor = conn.cursor()
    query = 'SELECT * FROM Attempt WHERE username = %s'
    cursor.execute(query, (username,))
    cursor.close()
    return cursor.fetchall()

def succeed_attempt(username, id):
    cursor = conn.cursor()
    query = 'UPDATE Attempt SET solved = 1 WHERE username = %s AND puzzleID = %s'
    cursor.execute(query, (username, id))
    conn.commit()
    cursor.close()

def get_tutorial(id):
    cursor = conn.cursor()
    query = 'SELECT * FROM Tutorial WHERE id = %s'
    cursor.execute(query, (id,))
    cursor.close() 
    return cursor.fetchall()

def get_tutorials():
    cursor = conn.cursor()
    query = 'SELECT * FROM Tutorial'
    cursor.execute(query)
    cursor.close()
    return cursor.fetchall() 

def add_tutorial(id, title, content):
    cursor = conn.cursor()
    try:
        query = 'INSERT INTO Tutorial(id, title, content) values (%s,%s,%s)'
        cursor.execute(query, (id, title, content))
        conn.commit()
    except Exception as e:
        print(e)
        return False
    cursor.close()
    return True

def edit_tutorial(id, title, content):
    cursor = conn.cursor()
    try:
        query = 'UPDATE Tutorial SET title = %s, content = %s WHERE id = %s'
        cursor.execute(query, (title, content, id))
        conn.commit()
    except Exception as e:
        print(e)
        return False
    cursor.close()
    return True

def delete_tutorial(id):
    cursor = conn.cursor()
    try:
        query = 'DELETE FROM Tutorial WHERE id = %s'
        cursor.execute(query, (id,))
        conn.commit()
    except Exception as e:
        print(e)
        return False
    cursor.close()
    return True