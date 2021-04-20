from flask import jsonify, g, request

from app.libs.error_code import DeleteSuccess, AuthFailed, Success
from app.libs.redprint import Redprint
from app.libs.token_auth import auth
from app.models.base import db
from app.models.user import User

api = Redprint('user')


# http://127.0.0.1:5000/v1/user


# @api.route('/<int:uid>', methods=['GET'])
# @auth.login_required
# def super_get_user(uid):
#     user = User.query.filter_by(id=uid).first_or_404()
#     return jsonify(user)


@api.route('', methods=['GET'])
@auth.login_required
def get_user():
    uid = g.user.uid
    user = User.query.filter_by(uid=uid).first_or_404()
    return jsonify(user)


#
#
# # 管理员
# @api.route('/<int:uid>', methods=['DELETE'])
# def super_delete_user(uid):
#     pass
#
#
# @api.route('', methods=['DELETE'])
# @auth.login_required
# def delete_user():
#     uid = g.user.uid
#     with db.auto_commit():
#         user = User.query.filter_by(id=uid).first_or_404()
#         user.delete()
#     return DeleteSuccess()
#
#
# @api.route('', methods=['PUT'])
# def update_user():
#     return 'update qiyue'

@api.route('/123', methods=['GET', 'POST'])
def test():
    print('/user/123')
    return Success()


