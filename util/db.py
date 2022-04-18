import pymysql.cursors
from datetime import datetime
import re

conn = pymysql.connect(host = '127.0.0.1',
                       port = 3306,
                       user = 'root',
                       password = '',
                       db = 'assemblet',
                       charset = 'utf8mb4',
                       cursorclass = pymysql.cursors.DictCursor)

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