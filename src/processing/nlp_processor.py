# src/processing/nlp_processor.py

import re

# Example important event keywords
IMPORTANT_KEYWORDS = [
    "bankruptcy",
    "merger",
    "acquisition",
    "resignation",
    "lawsuit",
    "investigation",
    "earnings miss",
    "earnings beat",
    "guidance cut",
    "guidance raise",
    "layoffs",
    "leadership change",
    "fraud",
    "settlement",
    "fine",
    "divestiture",
    "spin-off",
    "IPO",
    "delisting",
    "lawsuit",
    "probe",
    "investigation",
    "deal",
    "partnership",
    "earnings",
    "IPO"
]

def detect_events_in_text(text):
    """Detect if important event keywords appear in the given text."""
    found_events = []
    
    text_lower = text.lower()
    
    for keyword in IMPORTANT_KEYWORDS:
        if re.search(r'\b' + re.escape(keyword) + r'\b', text_lower):
            found_events.append(keyword)
    
    return found_events

# Quick test
if __name__ == "__main__":
    sample_text = """
    The company announced a major merger with a competitor today, expected to close by Q3.
    CEO also hinted at potential layoffs due to restructuring.
    """
    
    detected = detect_events_in_text(sample_text)
    print(f"Detected events: {detected}")
