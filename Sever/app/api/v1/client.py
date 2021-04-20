from flask import session, jsonify

from app.libs.email import send_verify_code_by_email
from app.libs.error_code import Success, ParameterException
from app.libs.redprint import Redprint
from app.libs.support import make_folder, generate_verify_code
from app.libs.token_auth import auth
from app.models.client_details import ClientDetail
from app.models.user import User
from app.validators.forms import ClientDetailForm, VerifyCodeForm, RegisterForm, RegisterCodeForm

api = Redprint('client')


# http://127.0.0.1:5000/v1/client


@api.route('/verify/<int:choose>', methods=['POST'])
def verify(choose):
    # 1 -> register
    # 2 -> reset password
    if choose == 1:
        form = RegisterCodeForm().validate_for_api()
    elif choose == 2:
        form = VerifyCodeForm().validate_for_api()
    else:
        return ParameterException()
    __verify(form)
    return Success()


def __verify(form):
    account = form.account.data
    verify_code = generate_verify_code()
    session[account] = verify_code
    send_verify_code_by_email(to=account, verify_code=verify_code)


@api.route('/register', methods=['POST'])
def create_client():
    form = RegisterForm().validate_for_api()
    uid = User.register_by_email(form.account.data,
                                 form.password.data)
    make_folder(str(uid))
    session.pop(form.account.data, None)
    return jsonify({'id': uid}), 201


@api.route('/reset', methods=['POST'])
def reset_password():
    form = RegisterForm().validate_for_api()
    uid = User.reset_password(form.account.data,
                              form.password.data)
    session.pop(form.account.data, None)
    return jsonify({'id': uid}), 201


@api.route('/detail', methods=['POST'])
@auth.login_required
def fill_detail():
    form = ClientDetailForm().validate_for_api()
    ClientDetail.fill_detail(id=form.id.data,
                             nickname=form.nickname.data,
                             gender=form.gender.data,
                             school=form.school.data,
                             avatar=form.avatar.data)
    return Success()


@api.route('/alter', methods=['POST'])
def alter_detail():
    form = ClientDetailForm().validate_for_api()
    ClientDetail.alter_detail(id=form.id.data,
                              nickname=form.nickname.data,
                              gender=form.gender.data,
                              school=form.school.data,
                              avatar=form.avatar.data)
    return Success()




