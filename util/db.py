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
    
    
