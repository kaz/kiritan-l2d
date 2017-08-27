import os
import flask
import base64
import pickle
import tweepy

from gevent.wsgi import WSGIServer

app = flask.Flask(__name__)

CONSUMER_KEY = ''
CONSUMER_SECRET = ''
ACCESS_TOKEN = ''
ACCESS_SECRET = ''

auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
auth.set_access_token(ACCESS_TOKEN, ACCESS_SECRET)
twitter = tweepy.API(auth)

try:
	os.mkdir('static/cache')
except:
	pass

try:
	with open('static/cache/params.pickle', 'rb') as f:
		params = pickle.load(f)
except:
	params = []

@app.route('/', methods=['GET'])
def get():
	return flask.render_template('index.html', host=flask.request.host)

@app.route('/', methods=['POST'])
def post():
	global params
	
	with open('static/cache/icon.png', 'wb') as f:
		f.write(base64.b64decode(flask.request.json['image'].split(',')[1]))
	
	with open('static/cache/params.pickle', 'wb') as f:
		params = flask.request.json['params']
		pickle.dump(params, f)
	
	twitter.update_profile_image('static/cache/icon.png')
	
	return 'ok'

@app.route('/params.json', methods=['GET'])
def data():
	global params
	return flask.jsonify(params)

if __name__ == '__main__':
	#app.run(host='0.0.0.0', port=8000, debug=True)
	WSGIServer(('0.0.0.0', 8000), app).serve_forever()
	