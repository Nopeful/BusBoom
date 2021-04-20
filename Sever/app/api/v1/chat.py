from flask import jsonify
from sqlalchemy import or_

from app.libs.redprint import Redprint
from app.libs.token_auth import auth
from app.models.chat_history import ChatHistory

api = Redprint('chat')


@api.route('/<int:uid>', methods=['GET'])
@auth.login_required
def get_chat_history(uid):
    history = ChatHistory.query.filter(
        or_(sender=uid, receiver=uid)
    ).order_by(ChatHistory.send_time.desc()).all()
    return jsonify(history)


def __merge_chat_history(history):
    obj = []

