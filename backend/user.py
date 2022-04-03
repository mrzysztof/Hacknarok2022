from datetime import datetime, timedelta

import jwt

from backend.config import SECRET_KEY


class User:
    def __init__(self, user_data):
        self.user_name = user_data["user_name"]
        self.pass_hash = user_data["pass_hash"]
        self.id = user_data["id"]

    def encode_auth_token(self):
        try:
            payload = {
                'exp': datetime.utcnow() + timedelta(hours=24),
                'user_id': self.id
            }
            return jwt.encode(
                payload,
                SECRET_KEY,
                algorithm='HS256'
            )
        except Exception as e:
            return e

    @staticmethod
    def decode_auth_token(auth_token):
        try:
            payload = jwt.decode(auth_token, SECRET_KEY)
            return payload['sub']
        except jwt.ExpiredSignatureError:
            return 'Signature expired. Please log in again.'
        except jwt.InvalidTokenError:
            return 'Invalid token. Please log in again.'