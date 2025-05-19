import yfinance as yf
from datetime import datetime

def get_current_price(ticker):
    try:
        data = yf.download(ticker, period="1d", interval="1m")
        if data.empty:
            return None
        return round(data['Close'].iloc[-1], 2)
    except Exception as e:
        print(f"Error fetching price for {ticker}: {e}")
        return None
