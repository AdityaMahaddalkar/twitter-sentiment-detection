const BASE_URL = "https://vernal-house-373720.uc.r.appspot.com";
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

    let tweetId = tweet.getAttribute("aria-labelledby");

    if (tweetText && !TWEETS_COMPLETED.has(tweetId)) {
      tweetTextList.push({
        text: tweetText,
      });

      validTweets.push({
        id: tweetText,
        tweet: tweet,
      });

      TWEETS_COMPLETED.add(tweetId);
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

      console.log(response);

      for (let sentimentObj of response) {
        sentimentMap.set(
          sentimentObj["tweet_text"],
          sentimentObj["detected_mood"]
        );
      }

      for (let i = 0; i < validTweets.length; i++) {
        let emoji,
          tweetId = validTweets[i]["id"];
        if (sentimentMap.get(tweetId) == "POSITIVE") emoji = "😊";
        else if (sentimentMap.get(tweetId) == "NEGATIVE") emoji = "☹️";
        else emoji = "😐";

        let positionToReplace = validTweets[i]["tweet"].querySelector(
          'div[data-testid="User-Names"]'
        );

        console.log(positionToReplace);

        if (!positionToReplace.querySelector(".sentiment")) {
          let span = document.createElement("span");
          span.className =
            "sentiment css-901oao r-1bwzh9t r-1q142lx r-37j5jr r-1b43r93 r-16dba41 r-hjklzo r-bcqeeo r-s1qlax r-qvutc0";
          span.textContent = "·";

          positionToReplace.appendChild(span);

          let div = document.createElement("div");
          div.className =
            "sentiment css-901oao r-1bwzh9t r-1q142lx r-37j5jr r-1b43r93 r-16dba41 r-hjklzo r-bcqeeo r-s1qlax r-qvutc0";
          div.textContent = `Detected Mood: ${emoji}`;
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
  setTimeout(addSentimentToTweets, 5 * 1000);
  let body = document.body;
  body.onscroll = addSentimentToTweets;
}

window.onload = main;
