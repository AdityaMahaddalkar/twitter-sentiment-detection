import json

from flask import Flask, request
from langdetect import detect
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

app = Flask(__name__)

INPUT_TEXT_KEY = 'tweet_text'
IS_ENGLISH_KEY = 'is_english'
SENTIMENT_SCORE_KEY = 'sentiment_score'
POSITIVE_KEY = 'positive'
NEGATIVE_KEY = 'negative'
NEUTRAL_KEY = 'neutral'
DETECTED_MOOD_KEY = 'detected_mood'

ENGLISH_LANGUAGE_SYMBOL = 'en'

analyzer = SentimentIntensityAnalyzer()


@app.route('/api/language-detection', methods=["POST"])
def detect_language():
    records = json.loads(request.data)

    response = []

    for record in list(records):
        try:
            language = detect(record[INPUT_TEXT_KEY])
            response.append({
                INPUT_TEXT_KEY: record[INPUT_TEXT_KEY],
                IS_ENGLISH_KEY: language == ENGLISH_LANGUAGE_SYMBOL,
            })
        except Exception as e:
            response.append({
                INPUT_TEXT_KEY: record[INPUT_TEXT_KEY],
                IS_ENGLISH_KEY: False,
            })
            
    return response


@app.route('/api/sentiment-score', methods=["POST"])
def get_sentiment_score():
    records = json.loads(request.data)
    response = []

    for record in list(records):
        analysis = analyzer.polarity_scores(record[INPUT_TEXT_KEY])

        if analysis['pos'] > analysis['neg'] and analysis['pos'] > analysis['neu']:
            mood = 'POSITIVE'
        elif analysis['neg'] > analysis['neu']:
            mood = 'NEGATIVE'
        else:
            mood = 'NEUTRAL'

        response.append({
            INPUT_TEXT_KEY: record[INPUT_TEXT_KEY],
            SENTIMENT_SCORE_KEY: {
                POSITIVE_KEY: analysis['pos'],
                NEUTRAL_KEY: analysis['neu'],
                NEGATIVE_KEY: analysis['neg'],
            },
            DETECTED_MOOD_KEY: mood
        })

    return response


if __name__ == '__main__':
    app.run(port=8080)
