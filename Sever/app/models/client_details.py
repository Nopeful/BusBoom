from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import reconstructor

from app.libs.support import base64_to_img
from app.models.base import Base, db


class ClientDetail(Base):
    """
    账户信息{
        用户 id,
        昵称 nickname(20),
        学校 school(30),
        性别 gender(6),   '小哥哥' or '小姐姐'
        头像 avatar(url)  url 存储图片地址
    }
    account 账号——邮箱 email
    """
    __tablename__ = 'client_detail'
    # user = relationship('user')
    id = Column(Integer, ForeignKey('user.id'), primary_key=True)
    nickname = Column(String(20), unique=False, nullable=False)
    school = Column(String(30), nullable=False)
    gender = Column(String(6), nullable=False)
    avatar = Column(String(50), nullable=False, default='app/static/img/avatar.png')
    total = Column(Integer, nullable=True, default=0)

    @reconstructor
    def __init__(self):
        self.fields = ['nickname', 'school', 'gender', 'avatar', 'total']

    @staticmethod
    def fill_detail(id, nickname, school, gender, avatar):
        with db.auto_commit():
            detail = ClientDetail()
            detail.id = id
            detail.nickname = nickname
            detail.school = school
            detail.gender = gender
            avatar_url = 'app/static/img/' + str(id) + '/' + 'avatar.png'
            base64_to_img(avatar, avatar_url)
            detail.avatar = avatar_url
            db.session.add(detail)

    @staticmethod
    def increase_total(id):
        with db.auto_commit():
            detail = ClientDetail.query.filter_by(id=id).first()
            detail.total = detail.total + 1

    @staticmethod
    def alter_detail(id, nickname, school, gender, avatar):
        with db.auto_commit():
            detail = ClientDetail.query.filter_by(id=id).first()
            detail.nickname = nickname
            detail.school = school
            detail.gender = gender
            avatar_url = 'app/static/img/' + str(id) + '/' + 'avatar.png'
            base64_to_img(avatar, avatar_url)
            detail.avatar = avatar_url

