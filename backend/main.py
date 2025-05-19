# backend/main.py
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src")))



from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fetchers.nyt_fetcher import fetch_nyt_finance_articles
from fetchers.yahoo_fetcher import fetch_yahoo_finance_articles
from fetchers.sec_fetcher import fetch_sec_8k_filings

from processing.nlp_processor import detect_events_in_text
from signals.signal_generator import is_market_moving


from utils.firestore_client import init_firestore, save_signal_to_firestore
from utils.price_fetcher import get_current_price
from utils.ticker_mapper import extract_ticker_from_text


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Real-Time News Signal Generator API"}

@app.get("/fetch-signals")
async def fetch_signals():
    signals = []
    db = init_firestore()

    nyt_articles = fetch_nyt_finance_articles()
    yahoo_articles = fetch_yahoo_finance_articles()
    sec_filings = fetch_sec_8k_filings()
    
    for articles, source in [(nyt_articles, "nyt"), (yahoo_articles, "yahoo"), (sec_filings, "sec")]:
        for article in articles:
            text = (article.get("title", "") or "") + " " + (article.get("abstract", "") or "") + " " + (article.get("summary", "") or "")
            detected_events = detect_events_in_text(text)
            
            if is_market_moving(detected_events):
                ticker = extract_ticker_from_text(text)
                suggestion = suggest_action(detected_events)
                
                signal = {
                    "source": source,
                    "title": article.get("title"),
                    "detected_events": detected_events,
                    "ticker": ticker,
                    "suggestion": suggestion,
                    "link": article.get("url") or article.get("link"),
                    
                }
                price = get_current_price(ticker)
                if price is not None:
                    signal["price_at_signal"] = price
                signals.append(signal)
                save_signal_to_firestore(db, signal)

    return {"signals": signals}

# 🛠 Helper functions:

def extract_ticker_from_title(title):
    """
    Very simple placeholder: 
    - Look for $AAPL $TSLA style mentions
    - or later connect with proper entity recognition.
    """
    if not title:
        return None
    if "Tesla" in title:
        return "TSLA"
    if "Apple" in title:
        return "AAPL"
    if "Amazon" in title:
        return "AMZN"
    if "Microsoft" in title:
        return "MSFT"
    if "Meta" in title or "Facebook" in title:
        return "META"
    return None

def suggest_action(detected_events):
    """
    Suggest BUY/SELL based on detected event keywords.
    """
    positive_events = ["acquisition", "earnings beat", "guidance raise", "ipo", "spin-off"]
    negative_events = ["bankruptcy", "resignation", "fraud", "delisting", "earnings miss", "guidance cut", "lawsuit", "investigation"]

    for event in detected_events:
        if event in positive_events:
            return "BUY (expected +2-5%)"
        if event in negative_events:
            return "SELL (expected -2-5%)"
    return "WAIT / CAUTION"
