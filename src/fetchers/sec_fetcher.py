# src/fetchers/sec_fetcher.py

import feedparser
import requests
import os
import json
from datetime import datetime

SEC_8K_FEED_URL = "https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=8-K&count=100&output=atom"

def fetch_sec_8k_filings():
    """Fetch latest 8-K SEC filings from EDGAR RSS."""
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; MyAppName/1.0; +http://yourdomain.com)"
    }
    
    response = requests.get(SEC_8K_FEED_URL, headers=headers)
    
    feed = feedparser.parse(response.content)
    
    print(f"Number of SEC 8-K filings: {len(feed.entries)}")
    
    filings = []
    for entry in feed.entries:
        filing = {
            "title": entry.get("title"),
            "summary": entry.get("summary"),
            "published_date": entry.get("published"),
            "link": entry.get("link")
        }
        filings.append(filing)
    
    return filings

def save_filings_to_json(filings, source_name="sec"):
    """Save filings to a timestamped JSON file."""
    now = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"data/raw/{source_name}_filings_{now}.json"
    
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    
    with open(filename, "w") as f:
        json.dump(filings, f, indent=4)
    
    print(f"Saved {len(filings)} SEC 8-K filings to {filename}")

# Quick test
if __name__ == "__main__":
    filings = fetch_sec_8k_filings()
    print(f"Fetched {len(filings)} SEC 8-K filings!")
    for f in filings[:3]:  # preview first 3
        print(f"- {f['title']} ({f['published_date']})")
    
    save_filings_to_json(filings)
