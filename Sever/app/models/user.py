from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import reconstructor
from werkzeug.security import generate_password_hash, check_password_hash

from app.libs.error_code import AuthFailed
from app.models.base import Base, db


class User(Base):
    """
        账户{
            邮箱 account(30),
            密码 password(6-16) 加密后 94 位
        }
    """
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True, autoincrement=True)
    account = Column(String(30), unique=True, nullable=False)
    _password = Column('password', String(100))

    @reconstructor
    def __init__(self):
        self.fields = ['id', 'account']

    @property
    def password(self):
        return self._password

    @password.setter
    def password(self, raw):
        self._password = generate_password_hash(raw)

    @staticmethod
    def register_by_email(account, secret):
        with db.auto_commit():
            user = User()
            user.account = account
            user.password = secret
            db.session.add(user)
        return User.query.filter_by(account=account).first().id

    def check_password(self, raw):
        if not self._password:
            return False
        return check_password_hash(self._password, raw)

    @staticmethod
    def verify(account, password):
        user = User.query.filter_by(account=account).first_or_404()
        if not user.check_password(password):
            raise AuthFailed()
        # scope = 'AdminScope' if user.auth == 2 else 'UserScope'
        # return {'uid': user.id, 'scope': scope}
        return user.id

    @staticmethod
    def reset_password(acc, psw):
        with db.auto_commit():
            user = User.query.filter_by(account=acc).first()
            user.password = psw
        return user.id

    # def _set_fields(self):
    #     # self._exclude = ['_password']
    #     self._fields = ['_password', 'nickname']
