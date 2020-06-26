import os
from threading import Thread

from flask import Flask, request, render_template, abort, Response
from flask_mail import Mail, Message


app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)

SENDER = 'moskvichovoleg@gmail.com'
SENDER_PASS = '$Manners7'
RECIPIENTS = ['moskvichovoleg@yahoo.com']

app.config.update(dict(
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=587,
    MAIL_USE_TLS=True,
    MAIL_USE_SSL=False,
    MAIL_DEBUG=False,
    MAIL_USERNAME='%s' % SENDER,
    MAIL_PASSWORD='%s' % SENDER_PASS,
    MAIL_DEFAULT_SENDER='%s' % SENDER,
    MAIL_MAX_EMAILS=None,
    MAIL_ASCII_ATTACHMENTS=False,
))

mail = Mail(app)


def send_email(msg):
    with app.app_context():
        mail.send(msg)


@app.route('/', methods=['GET'])
def index():
    if request.method == 'GET':
        return render_template('index.html')
    abort(405)


@app.route('/form/', methods=['POST'])
def form():
    if request.method == 'POST' and request.json:
        tel = request.json.get('tel')
        from_where = request.json.get('fromWhere')
        to_where = request.json.get('toWhere')
        name = request.json.get('name')
        age = request.json.get('age')
        diagnosis = request.json.get('diagnosis')
        treatment = request.json.get('treatment')
        escort = request.json.get('escort')
        comments = request.json.get('comments')

        msg = Message('Новая заявка с сайта!',
                      sender=SENDER,
                      recipients=RECIPIENTS)

        body = 'Новая заявка с сайта! <br>' \
               'Имя: %s<br>' \
               'Телефон: %s<br>' % (name, tel)

        msg.body = '%s' % body
        msg.html = "<b>%s</b>" % body

        Thread(target=send_email, args=(msg,)).start()

        return Response(status=200)
    else:
        abort(405)


if __name__ == '__main__':
    app.run(debug=False, port=7000)
