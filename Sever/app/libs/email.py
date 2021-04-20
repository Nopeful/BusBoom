from app import mail
from flask_mail import Message
from flask import current_app, render_template


def send_verify_code_by_email(to, subject='BusBoom验证码邮件', template='email/verification_code.html', **kwargs):
    sender = current_app.config['MAIL_USERNAME']
    msg = Message(subject=subject,
                  sender=sender,
                  recipients=[to])
    msg.html = render_template(template, **kwargs)
    mail.send(msg)
