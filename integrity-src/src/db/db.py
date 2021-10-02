import sqlite3
from sqlite3 import Error

def create_connection(db_file):

    conn = None
    try:
        conn = sqlite3.connect(db_file)
        return conn
    except Error as e:
        print(e)

    return conn

def create_table(conn, create_table_sql):
    try:
        c = conn.cursor()
        c.execute(create_table_sql)
    except Error as e:
        print(e)

def insertFlag(conn, content):
    
    sql = ("INSERT INTO flag(flag) VALUES (?)")
    curs = conn.cursor()
    curs.execute(sql, (content,))
    conn.commit()

    return curs.lastrowid

def insertUsers(conn, username, password):
    sql = ("INSERT INTO user(username, password) VALUES (?,?)")
    curs = conn.cursor()
    curs.execute(sql, (username, password,))
    conn.commit()

    return curs.lastrowid

def select_db(conn, statement, content):
    curs = conn.cursor()
    curs.execute(statement, (content,))
    rows = curs.fetchall()

    for row in rows:
        print(row)

    return row
