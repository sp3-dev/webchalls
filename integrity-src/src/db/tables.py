from .db import create_connection, create_table, insertFlag, insertUsers, select_db
import random
import string

db_path = r'./sqlite.db'

def gen_random(length):

    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(length))
    return result_str

def create_tables():
    
    create_user_table = """

        CREATE TABLE IF NOT EXISTS user(
            id integer PRIMARY KEY,
            username text NOT NULL,
            password text NOT NULL
        );
    """

    create_flag_table = """

        CREATE TABLE IF NOT EXISTS flag(
            flag text NOT NULL
        );
    """

    conn = create_connection(db_path)

    if conn is not None:
        create_table(conn, create_user_table)
        create_table(conn, create_flag_table)
    else:
        return "Error: Something went wrong"

def insert_flag():
    conn = create_connection(db_path)

    with conn:
        content = "empty"
        insertFlag(conn, content)

        username = "admin"
        password = f"{gen_random(12)}"

        insertUsers(conn, username, password)

    return "Done"

def selectUsers(id):
    conn = create_connection(db_path)
    statement = ("SELECT username from user where id = ?")
    output = select_db(conn, statement, id)

    return output
