![Twitter Logo](https://upload.wikimedia.org/wikipedia/sco/thumb/9/9f/Twitter_bird_logo_2012.svg/172px-Twitter_bird_logo_2012.svg.png)

# Twitter Sentiment Analysis

This project is a chrome extension for analyzing sentiments in tweets posted on Twitter.com.

We assign a familiar emoji to the tweets which represent the sentiment of that tweet.

## How To Install

1. Enable Developer Mode in Chrome browser (⚠️Please refer Chrome documentation for possible issues in enabling Developer Mode⚠️)
2. Navigate to `chrome://extensions` in Chrome
3. Drag and drop `./extension` folder into `chrome://extensions` tab
4. Navigate to `twitter.com`

## Implementation Details

- Backend
  - Python flask application with ReST based interface
  - Vader Setiment detection library
- Frontend
  - Chrome extension which can be installed via drag-and-drop
  - Extension is written in vanilla JavaScript

## Future Improvements

- Replacing basic Vader Sentiment detection with new and better Huggingface pipelines
- Optimize memory for Chrome extension by pre-filtering analyzed tweets without storing them in dedicated memory
