import json

from flask import Flask, request
from langdetect import detect

app = Flask(__name__)

INPUT_TEXT_KEY = 'tweet_text'
IS_ENGLISH_KEY = 'is_english'
ENGLISH_LANGUAGE_SYMBOL = 'en'


@app.route('/api/language-detection', methods=["POST"])
def detect_language():
    record = json.loads(request.data)
    response = list(map(lambda x:
                        {INPUT_TEXT_KEY: x[INPUT_TEXT_KEY],
                         IS_ENGLISH_KEY: detect(x[INPUT_TEXT_KEY]) == ENGLISH_LANGUAGE_SYMBOL},
                        list(record)))
    return response


if __name__ == '__main__':
    app.run(port=8080)
