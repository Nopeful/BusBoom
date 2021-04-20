from flask import jsonify
from sqlalchemy import or_

from app.libs.error_code import Success, Forbidden
from app.libs.redprint import Redprint
from app.libs.support import img_to_base64
from app.libs.token_auth import auth
from app.models.article import Article
from app.models.client_details import ClientDetail
from app.validators.forms import ArticleSearchForm, ArticlePublishForm

api = Redprint('article')
# http://127.0.0.1:5000/v1/article


@api.route('/publish', methods=['POST'])
@auth.login_required
def publish():
    form = ArticlePublishForm().validate_for_api()
    __publish_article(form)
    return Success()


def __publish_article(form):
    Article.publish_article(uid=form.id.data,
                            title=form.title.data,
                            content=form.content.data,
                            images=form.images.data)
    ClientDetail.increase_total(form.id.data)


@api.route('/search', methods=['GET'])
def search_article():
    # /search?school=school&keyword=
    form = ArticleSearchForm().validate_for_api()
    school = form.school.data.strip()
    keyword = '%' + form.keyword.data.strip() + '%'
    articles = Article.query.filter(
        or_(Article.title.like(keyword), Article.content.like(keyword))
    ).all()
    result = []
    for article in articles:
        result.append(__merge_detail_and_article(article))

    result = __filter_by_school(result, school)
    return jsonify(result)


def __filter_by_school(items, school):
    new_lst = []
    for item in items:
        if item['school'] != school:
            continue
        new_lst.append(item)
    return new_lst


def __merge_detail_and_article(article):
    detail = ClientDetail.query.filter_by(id=article.uid).first()
    avatar = {'avatar': img_to_base64(detail.avatar)}
    images = {'images': [img_to_base64(img) for img in eval(article.images)]}
    dict1 = dict(detail.hide('avatar'), **avatar)
    dict2 = dict(article.hide('images'), **images)
    return dict(dict1, **dict2)


@api.route('/<int:uid>', methods=['GET'])
@auth.login_required()
def get_self_articles(uid):
    articles = Article.query.filter_by(uid=uid).all()
    result = []
    for article in articles:
        result.append(__trans_img_urls(article))
    return jsonify(result)


def __trans_img_urls(article):
    images = {'images': [img_to_base64(img) for img in eval(article.images)]}
    return dict(article.hide('uid').append('id'), **images)


@api.route('/delete/<int:uid>/<int:id>', methods=['POST'])
@auth.login_required
def delete_article(uid, id):
    if Article.delete(uid, id):
        return Success()
    return Forbidden()


