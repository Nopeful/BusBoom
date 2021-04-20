from flask import current_app
from sqlalchemy import Column, Integer, ForeignKey, String
from sqlalchemy.orm import reconstructor

from app.libs.support import get_cur_time, calc_time_interval, is_in_expiration
from app.models.base import Base, db


class ChatHistory(Base):
    """
    聊天记录 {
        sender 发送方 id
        receiver 接收方 id
        send_time 时间
        content 内容
    }
    """
    __tablename__ = 'chat_history'
    id = Column(Integer, primary_key=True)
    sender = Column(Integer, ForeignKey('user.id'), nullable=False)
    receiver = Column(Integer, ForeignKey('user.id'), nullable=False)
    send_time = Column(String(20), nullable=False)
    content = Column(String(200), nullable=False)

    @reconstructor
    def __init__(self):
        self.fields = ['sender', 'receiver', 'send_time', 'content']

    @staticmethod
    def sava_history(sender, receiver, content):
        with db.auto_commit():
            history = ChatHistory()
            history.sender = sender
            history.receiver = receiver
            history.content = content
            history.send_time = get_cur_time()
            db.session.add(history)

    @staticmethod
    def delete(sender, receiver):
        histories = ChatHistory.query.filter_by(sender=sender, receiver=receiver).all()
        cur_time = get_cur_time()
        with db.auto_commit():
            for history in histories:
                interval = calc_time_interval(cur_time, history.send_time)
                if not is_in_expiration(interval, current_app.config['CHAT_HISTORY_EXPIRATION']):
                    db.session.delete(history)

