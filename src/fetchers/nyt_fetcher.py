# src/fetchers/nyt_fetcher.py

import os
import requests
from dotenv import load_dotenv
import json
from datetime import datetime

# Load environment variables
load_dotenv()

NYT_API_KEY = os.getenv("NYT_API_KEY")

def fetch_nyt_finance_articles():
    """Fetch latest finance articles from NYT API."""
    url = "https://api.nytimes.com/svc/topstories/v2/business.json"
    params = {
        "api-key": NYT_API_KEY
    }
    
    response = requests.get(url, params=params)
    
    if response.status_code != 200:
        print(f"Error fetching NYT articles: {response.status_code}")
        return []
    
    data = response.json()
    
    articles = []
    for item in data.get("results", []):
        article = {
            "title": item.get("title"),
            "abstract": item.get("abstract"),
            "published_date": item.get("published_date"),
            "url": item.get("url"),
        }
        articles.append(article)
    
    return articles

def save_articles_to_json(articles, source_name="nyt"):
    """Save articles to a timestamped JSON file."""
    now = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"data/raw/{source_name}_articles_{now}.json"
    
    os.makedirs(os.path.dirname(filename), exist_ok=True)  # ensure folder exists
    
    with open(filename, "w") as f:
        json.dump(articles, f, indent=4)
    
    print(f"Saved {len(articles)} articles to {filename}")


# Quick test if you run this file directly
if __name__ == "__main__":
    articles = fetch_nyt_finance_articles()
    print(f"Fetched {len(articles)} articles!")
    for a in articles[:3]:  # show first 3 articles
        print(f"- {a['title']} ({a['published_date']})")
    
    save_articles_to_json(articles)

