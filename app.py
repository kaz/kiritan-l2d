import os
import time
import json
import flask
import base64
import pickle
import tweepy
import threading

from flask import request
from selenium import webdriver

app = flask.Flask(__name__)

CONSUMER_KEY = ''
CONSUMER_SECRET = ''
ACCESS_TOKEN = ''
ACCESS_SECRET = ''

auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
auth.set_access_token(ACCESS_TOKEN, ACCESS_SECRET)
twitter = tweepy.API(auth)

browser_waiting = threading.Lock()
browser_waiting.acquire(blocking=False)

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
	return flask.render_template('index.html', host=request.host)

@app.route('/', methods=['PUT'])
def put():
	global browser_waiting

	browser = webdriver.Chrome()
	browser.get('http://%s/?internal' % request.host)

	browser_waiting.acquire()

	result = browser.execute_async_script('internalCapture(%s).then(arguments[arguments.length - 1])' % json.dumps(request.json))
	browser.close()

	return result


@app.route('/internal', methods=['POST'])
def internal_start():
	global params

	if request.headers.getlist("X-Forwarded-For"):
		ip = request.headers.getlist("X-Forwarded-For")[0]
	else:
		ip = request.remote_addr

	if ip != '127.0.0.1':
		return 'forbidden'

	with open('static/cache/icon.png', 'wb') as f:
		f.write(base64.b64decode(request.json['data'].split(',')[1]))

	twitter.update_profile_image('static/cache/icon.png')

	return 'ok'

@app.route('/internal', methods=['PATCH'])
def internal_proceed():
	global browser_waiting
	browser_waiting.release()
	time.sleep(0.25)
	browser_waiting.acquire(blocking=False)

	return 'ok'


@app.route('/params.json', methods=['GET'])
def param_get():
	global params
	return flask.jsonify(params)

@app.route('/params.json', methods=['PUT'])
def param_put():
	global params

	with open('static/cache/params.pickle', 'wb') as f:
		params = request.json
		pickle.dump(params, f)

	return 'ok'


if __name__ == '__main__':
	app.run(host='0.0.0.0', port=8000, threaded=True, debug=True)
