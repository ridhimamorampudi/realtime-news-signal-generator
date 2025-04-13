# src/fetchers/podcast_fetcher.py

import feedparser
import requests
import os
import json
from datetime import datetime

# Example Podcast RSS URLs
PODCAST_RSS_URLS = {
    "planet_money": "https://feeds.npr.org/510289/podcast.xml"
}

def fetch_podcast_episodes():
    """Fetch latest podcast episodes from given RSS feeds."""
    all_episodes = []
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }
    
    for source_name, url in PODCAST_RSS_URLS.items():
        print(f"Fetching from {source_name}...")
        
        response = requests.get(url, headers=headers)
        feed = feedparser.parse(response.content)
        
        print(f"Number of entries: {len(feed.entries)}")
        
        for entry in feed.entries:
            episode = {
                "podcast": source_name,
                "title": entry.get("title"),
                "description": entry.get("summary"),
                "published_date": entry.get("published"),
                "audio_link": entry.enclosures[0].href if entry.enclosures else None
            }
            all_episodes.append(episode)
    
    return all_episodes

def save_episodes_to_json(episodes, source_name="podcast"):
    """Save episodes to a timestamped JSON file."""
    now = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"data/raw/{source_name}_episodes_{now}.json"
    
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    
    with open(filename, "w") as f:
        json.dump(episodes, f, indent=4)
    
    print(f"Saved {len(episodes)} episodes to {filename}")

# Quick test
if __name__ == "__main__":
    episodes = fetch_podcast_episodes()
    print(f"Fetched {len(episodes)} podcast episodes!")
    for ep in episodes[:3]:  # preview first 3
        print(f"- {ep['title']} ({ep['published_date']})")
    
    save_episodes_to_json(episodes)
