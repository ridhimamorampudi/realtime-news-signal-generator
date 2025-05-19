import spacy
import yfinance as yf
from functools import lru_cache

# Load the small English model
nlp = spacy.load("en_core_web_sm")

@lru_cache(maxsize=128)
def get_ticker(company_name: str):
    try:
        matches = yf.Ticker(company_name)
        info = matches.info
        return info.get("symbol")
    except Exception:
        return None

def extract_ticker_from_text(text):
    doc = nlp(text)
    for ent in doc.ents:
        if ent.label_ in ["ORG", "PRODUCT"]:
            ticker = get_ticker(ent.text)
            if ticker:
                return ticker.upper()
    return None
