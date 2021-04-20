import base64
import os
import random
import string
from datetime import datetime


def get_cur_time():
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S')


def calc_time_interval(cur, hist):
    cur = datetime.strptime(cur, '%Y-%m-%d %H:%M:%S')
    hist = datetime.strptime(hist, '%Y-%m-%d %H:%M:%S')
    seconds = (cur - hist).total_seconds()
    return seconds


def is_in_expiration(cur, std):
    if cur > std:
        return False
    return True


def acc_psw_decode(code):
    acc_psw = base64.b64decode(code).decode('utf-8').split(':')
    acc = acc_psw[0]
    psw = acc_psw[1]
    return acc, psw


def generate_verify_code():
    return ''.join(random.sample(string.ascii_letters + string.digits, 6))


def make_folder(path):
    path = 'app/static/img/' + path
    folder = os.path.exists(path)
    if not folder:
        os.mkdir(path)


def base64_to_img(data, path):
    img = base64.b64decode(data)
    with open(path, 'wb+') as f:
        f.write(img)


def img_to_base64(path):
    with open(path, 'rb') as f:
        _img = base64.b64encode(f.read())
        return str(_img, 'utf-8')


if __name__ == '__main__':
    print(calc_time_interval('2021-02-05 14:43:44', '2021-02-03 14:43:44'))
