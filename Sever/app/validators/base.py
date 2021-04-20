from flask import request
from wtforms import Form as _Form

from app.libs.error_code import ParameterException
from app.libs.support import acc_psw_decode


class Form(_Form):
    def __init__(self, data, **kwargs):
        super(Form, self).__init__(data=data, **kwargs)

    def validate_for_api(self):
        valid = super(Form, self).validate()
        if not valid:
            # form errors
            raise ParameterException(msg=self.errors)
        return self


class BaseForm(Form):
    def __init__(self):
        data = request.get_json(silent=True)
        if data:
            data = data['data']
            if 'msg' and 'verify_code' in data:
                acc, psw = acc_psw_decode(data['msg'])
                data['account'] = acc
                data['password'] = psw
        args = request.args.to_dict()
        if args:
            args = eval(args['data'])
        super(BaseForm, self).__init__(data=data, **args)


class HeaderForm(Form):
    def __init__(self):
        authorization = request.headers.get('Authorization')
        authorization = authorization.split(' ')[-1]
        account, password = acc_psw_decode(authorization)
        data = {
            'account': account,
            'password': password
        }
        kwargs = request.args.to_dict()
        super(HeaderForm, self).__init__(data=data, **kwargs)




