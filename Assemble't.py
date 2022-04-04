from flask import Flask, render_template, request, session, url_for, redirect
import pymysqp.cursors
from datetime import datetime
import re
app = Flask(__name__)
conn = pymysql.connect(host = '120.0.0.1',
                       port = 3306,
                       user = 'root',
                       password = 'root',
                       db = 'demo',
                       charset = 'utf8mb4',
                       cursorclass = pymysql.cursors.DictCursor)

def userInfo():
    cursor = conn.cursor()
    name = request.form['name']
    userID = request.form['userID']
    DOB = request.form['DOB']
    PlayLength = request.form['PlayLength']
    userInfo_query = 'INSERT INTO user information(name, userID, DOB, PlayLength) values (%s, %s,%s,%s)'
    cursor.execute(userInfo_query, name, userID, DOB, PlayLength)
    conn.commit()
    cursor.close()
    
    
