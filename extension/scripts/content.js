const BASE_URL = "http://127.0.0.1:8080";
const ENGLISH_CHECK_API = "/api/language-detection";
const SENTIMENT_SCORE_API = "/api/sentiment-score";

let TWEETS_COMPLETED = new Set();

function addSentimentToTweets() {
  let tweets = document.querySelectorAll('article[data-testid="tweet"]');
  let tweetTextList = [];
  let validTweets = [];

  for (let tweet of tweets) {
    let tweetText = tweet.querySelector('div[data-testid="tweetText"]')
      ?.firstElementChild?.textContent;

    if (tweetText && !TWEETS_COMPLETED.has(tweetText)) {
      let tweetId = tweet.getAttribute("aria-labelledby");

      tweetTextList.push({
        text: tweetText,
      });

      validTweets.push({
        id: tweetText,
        tweet: tweet,
      });

      TWEETS_COMPLETED.add(tweetText);
    }
  }

  if (tweetTextList.length == 0) return;

  checkWhetherTweetsAreEnglish(tweetTextList).then((response) => {
    let validEnglishTweets = new Set(
      response.map((isEnglishObj) => isEnglishObj["tweet_text"])
    );

    tweetTextList = tweetTextList.filter((tweetText) =>
      validEnglishTweets.has(tweetText["text"])
    );

    validTweets = validTweets.filter((validTweet) =>
      validEnglishTweets.has(validTweet["id"])
    );

    getSentiment(tweetTextList).then((response) => {
      let sentimentMap = new Map();

      for (let sentimentObj of response) {
        sentimentMap.set(
          sentimentObj["tweet_text"],
          sentimentObj["detected_mood"]
        );
      }

      console.log(sentimentMap);

      for (let i = 0; i < validTweets.length; i++) {
        let emoji,
          tweetId = validTweets[i]["id"];

        console.log(`${tweetId} : ${sentimentMap.get(tweetId)}`);
        if (sentimentMap.get(tweetId) == "POSITIVE") emoji = "😊";
        else if (sentimentMap.get(tweetId) == "NEGATIVE") emoji = "☹️";
        else emoji = "😐";

        let positionToReplace = validTweets[i]["tweet"].querySelector(
          'div[data-testid="User-Names"]'
        );

        console.log(positionToReplace);

        if (!positionToReplace.querySelector(".sentiment")) {
          let div = document.createElement("div");
          div.className = "sentiment";
          div.style.color = "#657786";
          div.innerHTML = `Detected Mood: ${emoji}`;
          positionToReplace.appendChild(div);
        }
      }
    });
  });
}

function checkWhetherTweetsAreEnglish(tweets) {
  const request = tweets.map((tweetText) => ({
    tweet_text: tweetText["text"],
  }));

  console.log(request);

  return fetch(BASE_URL + ENGLISH_CHECK_API, {
    method: "POST",
    body: JSON.stringify(request),
  })
    .then((response) => response.json())
    .catch((err) => console.error(err));
}

function getSentiment(tweets) {
  const request = tweets.map((tweetText) => ({
    tweet_text: tweetText["text"],
  }));

  return fetch(BASE_URL + SENTIMENT_SCORE_API, {
    method: "POST",
    body: JSON.stringify(request),
  })
    .then((response) => response.json())
    .catch((err) => console.error(err));
}

function main() {
  addSentimentToTweets();

  let body = document.body;
  body.onscroll = addSentimentToTweets;
}

window.onload = main;
