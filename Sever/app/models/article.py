from app.libs.support import base64_to_img, get_cur_time
from app.models.base import Base, db
from sqlalchemy import Column, Integer, String, ForeignKey, desc
from sqlalchemy.orm import reconstructor

from app.models.client_details import ClientDetail


class Article(Base):
    """
    文章{
        用户 uid
        标题 title(40),
        内容 content(200),
        图片路径 images(url_list)
    }
    """
    __tablename__ = 'article'
    id = Column(Integer, primary_key=True, autoincrement=True)
    # user = relationship('user')
    uid = Column(Integer, ForeignKey('user.id'), nullable=False)
    title = Column(String(40), nullable=False)
    content = Column(String(200), nullable=False)
    images = Column(String(150), nullable=True)
    publish_time = Column(String(20), nullable=True)

    @reconstructor
    def __init__(self):
        self.fields = ['uid', 'title', 'content', 'images', 'publish_time']

    @staticmethod
    def publish_article(uid, title, content, images):
        with db.auto_commit():
            article = Article()
            article.uid = uid
            article.title = title
            article.content = content
            img_list = []
            tmp_article = Article.query.order_by(desc(Article.id))
            tmp_id = str(1)
            if tmp_article:
                tmp_id = str(tmp_article.first().id + 1)
            file_path = 'app/static/img/' + str(uid) + '/' + tmp_id + '_{}.png'
            idx = 0
            for img in images:
                path = file_path.format(idx)
                base64_to_img(img, path)
                img_list.append(path)
                idx += 1
            article.images = str(img_list)
            article.publish_time = get_cur_time()
            db.session.add(article)

    @staticmethod
    def delete(uid, id):
        article = Article.query.filter_by(id=id).first()
        detail = ClientDetail.query.filter_by(id=uid).first()
        if article.uid != uid or not detail:
            return False
        with db.auto_commit():
            detail.total = detail.total - 1
            db.session.delete(article)

        return True

