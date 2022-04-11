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

def delete_puzzle(id):
    cursor = conn.cursor()
    try:
        query = 'DELETE FROM Puzzle WHERE id = %s'
        cursor.execute(query, (id,))
    except Exception as e:
        print(e)
        return False
    cursor.close()
    return True