import os
from flask import Flask, render_template

template_dir = os.path.abspath('./src')
static_dir = os.path.abspath('./src/static')
app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)
PORT = 3000

pages = [
    '/',
]

content = {
    'chocolate_images': [
        {
            'name': 'Mint Chocolate',
            'src': '/static/images/img1.jpg',
            'alt_text': 'Chocolate 1'
        },
        {
            'name': 'Almond Chocolate',
            'src': '/static/images/img2.jpg',
            'alt_text': 'Chocolate 2'
        },
        {
            'name': 'Raspberry Chocolate',
            'src': '/static/images/img3.jpg',
            'alt_text': 'Chocolate 3'
        },
        {
            'name': 'Coconut Chocolate',
            'src': '/static/images/img1.jpg',
            'alt_text': 'Chocolate 1'
        },
        {
            'name': 'Raisin Chocolate',
            'src': '/static/images/img2.jpg',
            'alt_text': 'Chocolate 2'
        },
        {
            'name': 'Milk Chocolate',
            'src': '/static/images/img3.jpg',
            'alt_text': 'Chocolate 3'
        },
        {
            'name': 'Dark Chocolate',
            'src': '/static/images/img1.jpg',
            'alt_text': 'Chocolate 1'
        },
        {
            'name': 'White Chocolate',
            'src': '/static/images/img2.jpg',
            'alt_text': 'Chocolate 2'
        },
        {
            'name': 'Mint Coffee Chocolate',
            'src': '/static/images/img3.jpg',
            'alt_text': 'Chocolate 3'
        },
    ]
}

@app.route('/')
def homepage():
    return render_template('templates/pages/homepage.jinja',
                           content=content)


if __name__ == '__main__':
    app.run(port=PORT, debug=True)