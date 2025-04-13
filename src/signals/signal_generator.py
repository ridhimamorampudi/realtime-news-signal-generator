# src/signals/signal_generator.py

def is_market_moving(detected_events, threshold=1):
    """
    Decide if an article/filing is market moving based on number of important events detected.
    
    Args:
    - detected_events (list): list of important keywords found
    - threshold (int): minimum number of events to be considered "market moving"
    
    Returns:
    - bool: True if important enough, False otherwise
    """
    return len(detected_events) >= threshold

# Quick test
if __name__ == "__main__":
    detected_events = ['merger', 'layoffs']
    if is_market_moving(detected_events):
        print("🚨 Market Moving Signal!")
    else:
        print("❌ Not Significant.")
