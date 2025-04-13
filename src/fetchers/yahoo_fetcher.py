# src/fetchers/yahoo_fetcher.py

import feedparser
import requests
import os
import json
from datetime import datetime

# Working RSS feed
#YAHOO_RSS_URL = "https://www.investing.com/rss/news_25.rss"
YAHOO_RSS_URL = "https://feeds.finance.yahoo.com/rss/2.0/headline?s=^DJI&region=US&lang=en-US"


def fetch_yahoo_finance_articles():
    """Fetch latest finance articles from Yahoo/Investing RSS feed."""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }
    
    response = requests.get(YAHOO_RSS_URL, headers=headers)
    
    feed = feedparser.parse(response.content)
    
    print(f"Number of entries: {len(feed.entries)}")
    
    articles = []
    for entry in feed.entries:
        article = {
            "title": entry.get("title"),
            "summary": entry.get("summary"),
            "published_date": entry.get("published"),
            "link": entry.get("link"),
        }
        articles.append(article)
    
    return articles

def save_articles_to_json(articles, source_name="yahoo"):
    """Save articles to a timestamped JSON file."""
    now = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"data/raw/{source_name}_articles_{now}.json"
    
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    
    with open(filename, "w") as f:
        json.dump(articles, f, indent=4)
    
    print(f"Saved {len(articles)} articles to {filename}")

# Quick test
if __name__ == "__main__":
    articles = fetch_yahoo_finance_articles()
    print(f"Fetched {len(articles)} Yahoo/Investing articles!")
    for a in articles[:3]:  # preview first 3
        print(f"- {a['title']} ({a['published_date']})")
    
    save_articles_to_json(articles)
