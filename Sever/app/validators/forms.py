from flask import session
from wtforms import StringField, IntegerField, FieldList
from wtforms.validators import DataRequired, length, Regexp
from wtforms import ValidationError

from app.models.user import User
from app.validators.base import BaseForm as Form, HeaderForm


class GetTokenForm(HeaderForm):
    account = StringField(validators=[
        DataRequired()
    ])
    # password can only include letters , numbers and "_"
    password = StringField(validators=[
        DataRequired(),
        length(min=6, max=16),
        Regexp(r'^[A-Za-z0-9_*&$#@]{6,16}$')
    ])

    def validate_account(self, value):
        if User.query.filter_by(account=value.data).first():
            return True
        raise ValidationError()


class VerifyCodeForm(Form):
    account = StringField(validators=[DataRequired()])

    def validate_account(self, value):
        if User.query.filter_by(account=value.data).first():
            return True
        raise ValidationError(message='邮箱不存在')


class RegisterCodeForm(VerifyCodeForm):
    def validate_account(self, value):
        if User.query.filter_by(account=value.data).first():
            raise ValidationError(message='该邮箱已经注册过')


class RegisterForm(Form):
    account = StringField(validators=[
        DataRequired()
    ])
    password = StringField(validators=[
        DataRequired(),
        # password can only include letters , numbers and "_"
        length(min=6, max=16),
        Regexp(r'^[A-Za-z0-9_*&$#@]{6,16}$')
    ])
    verify_code = StringField(validators=[
        DataRequired(),
        length(min=6, max=6)
    ])

    def validate_account(self, value):
        if value.data in session:
            if session.get(value.data) == self.data['verify_code']:
                return True
            raise ValidationError(message='验证码错误')
        raise ValidationError(message='账号不合法')


class TokenForm(Form):
    token = StringField(validators=[DataRequired()])


class ArticlePublishForm(Form):
    id = IntegerField(validators=[DataRequired()])
    title = StringField(validators=[
        DataRequired(),
        length(min=1, max=40)
    ])
    content = StringField(validators=[
        DataRequired(),
        length(min=1, max=200)
    ])
    images = FieldList(StringField(validators=[
        DataRequired(message="images' number between 1 and 3"),
        length(min=1, max=1024*1024, message='每张图不得超过1MB')
    ]), min_entries=1, max_entries=3)


class ArticleSearchForm(Form):
    school = StringField()
    keyword = StringField(validators=[
        length(min=0, max=40)
    ])


class ClientDetailForm(Form):
    id = IntegerField(validators=[DataRequired()])
    nickname = StringField(validators=[
        DataRequired(),
        length(min=1, max=20)
    ])
    school = StringField(validators=[DataRequired()])
    gender = StringField(validators=[DataRequired()])
    avatar = StringField(validators=[
        DataRequired('avatar needed!'),
        length(min=1, max=1024*1024, message='图片的大小需要在1MB以内!')
    ])

    def validate_nickname(self, value):
        details = ClientDetail.query.filter_by(nickname=value.data).all()
        if not details:
            return True
        if len(details) == 1 and details[0].id == self.id.data:
            return True
        raise ValidationError('昵称已被占用')




