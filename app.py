import time
from functools import wraps
from flask_cors import CORS
import jwt
import bcrypt as bcrypt
from pymongo import MongoClient
from flask import Flask, request, render_template

from backend.config import SECRET_KEY, CONNECTION_STRING, SALT
from backend.user import User

app = Flask(__name__, template_folder="front/web-form/templates", static_url_path="/front/web-form",
            static_folder="/front/web-form")
CORS(app)
app.config.update(
    TESTING=True,
    DEBUG=False,
    SECRET_KEY=SECRET_KEY,
)

client = MongoClient(CONNECTION_STRING)
db = client["TFE_DB"]

print(app.static_url_path)
print(app.static_folder)


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        if not token:
            return 'Unauthorized Access!', 401

        try:
            coll = db["user"]
            data = jwt.decode(token, app.config["SECRET_KEY"], algorithms="HS256")
            current_user = coll.find_one({'user_name': data['user_name']})
            if not current_user:
                return 'Unauthorized Access!', 401
        except Exception as e:
            return 'Unauthorized Access!', 401
        return f(*args, **kwargs)

    return decorated


@app.route("/", methods=["GET"])
def index():
    return render_template("login.html")


@token_required
@app.route("/menu", methods=["GET"])
def menu():
    return render_template("menu.html")


def get_user_obj(user_name):
    coll = db["user"]
    user_cursor = coll.find_one({"user_name": user_name})
    if user_cursor:
        return User(user_cursor)


@app.route("/register", methods=["GET"])
def register_user_render():
    return render_template("register.html")


@app.route("/login", methods=["GET"])
def login_user_render():
    return render_template("login.html")


@app.route("/register", methods=["POST"])
def register_user():
    response = {
        "success": False,
        "message": "Error",
    }

    user_name = request.form["user_name"]

    if get_user_obj(user_name) is not None:
        response["message"] = "User already exists"
        return response, 400

    user_data = request.form
    coll = db["user"]

    user_data = dict(user_data)  # needed workaround, from immutabledict
    hashed_password = bcrypt.hashpw(user_data["password"].encode(), SALT)
    user_data["pass_hash"] = hashed_password
    user_data["id"] = int(time.time())
    mongo_user_id = coll.insert_one(user_data).inserted_id

    response["message"] = "User registered"
    response["success"] = True
    return response, 200


@app.route("/login", methods=["POST"])
def login():
    user_data = request.form
    response = {
        "success": False,
        "message": "Invalid parameters",
        "token": ""
    }

    user = get_user_obj(user_data["user_name"])

    if user is None:
        return response, 404

    hashed_password = bcrypt.hashpw(user_data["password"].encode(), SALT)
    if hashed_password != user.pass_hash:
        return response, 404
    token = user.encode_auth_token()

    response["token"] = token
    response["success"] = True
    response["message"] = "Success"

    return response, 200


@app.route("/user_data", methods=["GET", "POST"])
@token_required
def get_user():
    coll = db["user"]
    print(request.headers)
    user_name = User.decode_auth_token(request.headers["X-Access-Token"])
    user = coll.find_one({"user_name": user_name})
    del user['_id']
    del user['pass_hash']

    if user:
        return user, 200

    return None, 404


@token_required
@app.route("/update_user", methods=["GET", "POST"])
def update_user():
    coll = db["user"]
    data = request.get_json()

    user_name = User.decode_auth_token(request.headers["X-Access-Token"])
    user = coll.find_one({"user_name": user_name})
    del user['_id']
    del user['pass_hash']

    if "options" in data:
        options = data["options"]
        print(options)
        for option in options.keys():
            coll.update_one({
                'user_name': user["user_name"]},
                {"$set": {f"options.{option}": options[option]}}
            )
    if "contacts" in data:
        contacts = data["contacts"]
        for contact in contacts.keys():
            coll.update_one({
                'user_name': user["user_name"]},
                {"$set": {f"contacts.{contact}": contacts[contact]}}
            )
    if user:
        return user, 200

    return {}, 200


if __name__ == '__main__':
    app.run()
