import firebase_admin
from firebase_admin import credentials, firestore
import os
from datetime import datetime
from thefuzz import process
from src.utils.sp500_tickers import sp500_companies

def get_best_ticker_match(title: str) -> str | None:
    best_match, score = process.extractOne(title, sp500_companies.keys())
    if score > 80:
        return sp500_companies[best_match]
    return None


def save_signal_to_firestore(db, signal):
    collection = db.collection("signals")
    
    # Run fuzzy matching if ticker is not already provided
    if not signal.get("ticker") and "title" in signal:
        signal["ticker"] = get_best_ticker_match(signal["title"])

    signal["timestamp"] = datetime.utcnow().isoformat()
    doc_id = f"{signal['ticker'] or 'unknown'}_{signal['timestamp']}"
    collection.document(doc_id).set(signal)
    print(f"✅ Stored signal for {signal['ticker'] or 'unknown'}")

def init_firestore():
    cred_path = os.path.join(os.path.dirname(__file__), "../../firebase-adminsdk.json")
    
    if not firebase_admin._apps:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)

    return firestore.client()