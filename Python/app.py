from flask import Flask
from prices_wrapped import *

app = Flask(__name__)

@app.route('/')
def hello():
	return run_file()

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=8000)
