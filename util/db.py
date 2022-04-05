import pymysqp.cursors
from datetime import datetime
import re

conn = pymysql.connect(host = '120.0.0.1',
                       port = 3306,
                       user = 'root',
                       password = 'root',
                       db = 'demo',
                       charset = 'utf8mb4',
                       cursorclass = pymysql.cursors.DictCursor)

def add_user(id, username, password):
    cursor = conn.cursor()
    query = 'INSERT INTO User(id, username, password) values (%s,%s,%s)'
    cursor.execute(query, id, username, password)
    conn.commit()
    cursor.close()
    
    
