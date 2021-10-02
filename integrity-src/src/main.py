from flask import Flask
from src.routes.user import user

app = Flask(__name__)

app.register_blueprint(user, url_prefix='/api')
app.secret_key = 'veryveryverysecuresecretkeykeykeykey'

@app.errorhandler(404)
def not_found(error):
    return {'error': 'Not Found'}, 404

@app.errorhandler(500)
def internal_error(error):
    return {'error': 'Internal Server Error'}, 500