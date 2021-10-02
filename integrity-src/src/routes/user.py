from flask import Blueprint, request, jsonify, session, redirect, url_for
from ..db.db import create_connection
from ..db.tables import selectUsers
import hashlib

user = Blueprint('user', __name__)

def integrity(value):
    md5hash = hashlib.md5(b'saltintegrity' + value.encode()).hexdigest()
    return md5hash

@user.route('/')
def home():
    session['auth'] = True
    session['username'] = selectUsers("1")
    session['userinfo'] = 'users'
    session['integrity'] = integrity(session['userinfo'])

    return jsonify(auth="Success")


@user.route('/user_data')
def user_data():

    if "auth" not in session:
        redirect(url_for('user.home'))

    try:
        if integrity(session['userinfo']) != session['integrity']:
            return jsonify(error="Tampring detected")

    except KeyError:
        return jsonify(error="Something went wrong")

    try:
        f = open(session['userinfo'], "r").read()
        
    except IOError:
        f = "File not found"

    args = request.args.get("user_id") or "1"
    output = selectUsers(args)
    
    return jsonify(user=output, info=f)
