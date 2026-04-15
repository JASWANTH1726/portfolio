from flask import Flask, request, redirect, render_template_string
from flask_sqlalchemy import SQLAlchemy
import string, random

# Create Flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///url.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Database Model
class URL(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    long_url = db.Column(db.String(500), nullable=False)
    short_code = db.Column(db.String(6), unique=True, nullable=False)

# Short code generator
def generate_short_code():
    chars = string.ascii_letters + string.digits
    while True:
        code = ''.join(random.choices(chars, k=6))
        if not URL.query.filter_by(short_code=code).first():
            return code

# HTML Template
HTML_TEMPLATE = '''
<!DOCTYPE html>
<html>
<head><title>URL Shortener</title></head>
<body>
    <h1>🔗 Simple URL Shortener</h1>
    <form method="POST">
        <input name="long_url" placeholder="Enter long URL" style="width:300px;" required>
        <button type="submit">Shorten</button>
    </form>
    {% if short_url %}
    <p><b>Short URL:</b> <a href="{{ short_url }}" target="_blank">{{ short_url }}</a></p>
    {% endif %}
</body>
</html>
'''

@app.route('/', methods=['GET', 'POST'])
def index():
    short_url = None
    if request.method == 'POST':
        long_url = request.form['long_url']
        existing = URL.query.filter_by(long_url=long_url).first()
        if existing:
            short_code = existing.short_code
        else:
            short_code = generate_short_code()
            new_url = URL(long_url=long_url, short_code=short_code)
            db.session.add(new_url)
            db.session.commit()
        short_url = request.host_url + short_code
    return render_template_string(HTML_TEMPLATE, short_url=short_url)

@app.route('/<short_code>')
def redirect_short_url(short_code):
    url_entry = URL.query.filter_by(short_code=short_code).first_or_404()
    return redirect(url_entry.long_url)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(port=5000)
