# backend/main.py
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src")))


from fastapi import FastAPI
from fetchers.nyt_fetcher import fetch_nyt_finance_articles
from fetchers.yahoo_fetcher import fetch_yahoo_finance_articles
from fetchers.sec_fetcher import fetch_sec_8k_filings

from processing.nlp_processor import detect_events_in_text
from signals.signal_generator import is_market_moving

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Real-Time News Signal Generator API"}

@app.get("/fetch-signals")
async def fetch_signals():
    signals = []

    # Fetch articles
    nyt_articles = fetch_nyt_finance_articles()
    yahoo_articles = fetch_yahoo_finance_articles()
    sec_filings = fetch_sec_8k_filings()
    
    # Process all
    for articles, source in [(nyt_articles, "nyt"), (yahoo_articles, "yahoo"), (sec_filings, "sec")]:
        for article in articles:
            text = (article.get("title", "") or "") + " " + (article.get("abstract", "") or "") + " " + (article.get("summary", "") or "")
            detected_events = detect_events_in_text(text)
            
            if is_market_moving(detected_events):
                signal = {
                    "source": source,
                    "title": article.get("title"),
                    "detected_events": detected_events,
                    "link": article.get("url") or article.get("link"),
                }
                signals.append(signal)
    
    return {"signals": signals}
