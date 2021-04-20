from collections import namedtuple

from flask import current_app, g
from flask_httpauth import HTTPTokenAuth
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired

from app.libs.error_code import AuthFailed

auth = HTTPTokenAuth(scheme='BusBoom')
User = namedtuple('user', ['uid'])


@auth.verify_token
def verify_token(token):
    s = Serializer(current_app.config['SECRET_KEY'])
    try:
        data = s.loads(token)
    except BadSignature:
        raise AuthFailed(msg='token is invalid',
                         error_code=1002)
    except SignatureExpired:
        raise AuthFailed(msg='token is expired',
                         error_code=1003)
    uid = data['uid']
    g.user = User(uid)
    return True





