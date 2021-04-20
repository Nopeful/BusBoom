from flask import Blueprint
from app.api.v1 import user, token, client, article, chat


def create_blueprint_v1():
    bp_v1 = Blueprint('v1', __name__)

    user.api.register(bp_v1)
    token.api.register(bp_v1)
    client.api.register(bp_v1)
    article.api.register(bp_v1)
    chat.api.register(bp_v1)
    return bp_v1
