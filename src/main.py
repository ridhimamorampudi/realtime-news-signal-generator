# src/main.py

import time
from src.fetchers.nyt_fetcher import fetch_nyt_finance_articles
from src.fetchers.yahoo_fetcher import fetch_yahoo_finance_articles
from src.fetchers.sec_fetcher import fetch_sec_8k_filings

from processing.nlp_processor import detect_events_in_text
from signals.signal_generator import is_market_moving

def process_articles(articles, source_name):
    """Process a list of articles or filings."""
    print(f"\nProcessing {len(articles)} items from {source_name}...\n")
    
    for article in articles:
        text = (article.get("title", "") or "") + " " + (article.get("abstract", "") or "") + " " + (article.get("summary", "") or "")
        
        detected_events = detect_events_in_text(text)
        
        if is_market_moving(detected_events):
            print(f"🚨 [SIGNAL] [{source_name.upper()}] {article.get('title')}")
            print(f"Detected events: {detected_events}")
            print(f"Link: {article.get('url') or article.get('link')}\n")

def run_full_cycle():
    """Run one full fetch-process-signal cycle."""
    nyt_articles = fetch_nyt_finance_articles()
    yahoo_articles = fetch_yahoo_finance_articles()
    sec_filings = fetch_sec_8k_filings()
    
    process_articles(nyt_articles, "nyt")
    process_articles(yahoo_articles, "yahoo")
    process_articles(sec_filings, "sec")

def main():
    """Run scanner continuously."""
    while True:
        print("\n=======================")
        print(f"🚀 Scanning news at {time.strftime('%Y-%m-%d %H:%M:%S')}...")
        print("=======================\n")
        
        run_full_cycle()
        
        print("\nSleeping for 60 seconds...\n")
        time.sleep(60)

if __name__ == "__main__":
    main()
