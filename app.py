import time
from functools import wraps

import jwt
import bcrypt as bcrypt
from pymongo import MongoClient
from flask import Flask, request, render_template

from backend.config import SECRET_KEY, CONNECTION_STRING, SALT
from backend.user import User

app = Flask(__name__, template_folder="templates")

app.config.update(
    TESTING=True,
    DEBUG=False,
    SECRET_KEY=SECRET_KEY,
)

client = MongoClient(CONNECTION_STRING)
db = client["TFE_DB"]


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
            current_user = coll.find_one({'user_id': data['user_id']})
            if not current_user:
                return 'Unauthorized Access!', 401
        except:
            return 'Unauthorized Access!', 401
        return f(*args, **kwargs)

    return decorated


@app.route("/", methods=["GET"])
def index():
    return "Hello world"#render_template("templates/index.html")


def get_user_obj(user_name):
    coll = db["user"]
    user_cursor = coll.find_one({"user_name": user_name})
    if user_cursor:
        return User(user_cursor)


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
    user_name = request.form["user_name"]
    coll = db["user"]
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

    if "config" in data:
        config = data["config"]
        coll.update_one({
            'user_name': user["user_name"]},
            {"$set": {"config": config}}
        )
    if "contacts" in data:
        contacts = data["contacts"]
        coll.update_one({
            'user_name': user["user_name"]},
            {"$set": {"contacts": contacts}}
        )
    if user:
        return user, 200

    return {}, 200


if __name__ == '__main__':
    app.run()
