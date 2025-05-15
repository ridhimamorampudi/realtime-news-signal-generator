import re
import spacy

# Load spaCy NER model once
nlp = spacy.load("en_core_web_sm")

# Event → Synonyms mapping
EVENT_KEYWORDS = {
    "bankruptcy": ["bankruptcy", "files for bankruptcy"],
    "merger": ["merger", "merging"],
    "acquisition": ["acquisition", "acquires", "acquired"],
    "resignation": ["resignation", "resigns", "resigned", "steps down", "quits"],
    "lawsuit": ["lawsuit", "sued", "legal action"],
    "investigation": ["investigation", "probe", "under investigation"],
    "earnings miss": ["earnings miss", "missed estimates", "underperformed"],
    "earnings beat": ["earnings beat", "beat estimates", "outperformed"],
    "guidance cut": ["guidance cut", "lowered guidance", "cuts forecast"],
    "guidance raise": ["guidance raise", "increased forecast", "raises guidance"],
    "layoffs": ["layoffs", "job cuts", "downsizing"],
    "leadership change": ["leadership change", "executive shuffle", "CEO transition"],
    "fraud": ["fraud", "fraudulent"],
    "settlement": ["settlement", "settles with"],
    "fine": ["fine", "fined", "penalty"],
    "divestiture": ["divestiture", "divests", "spins off"],
    "spin-off": ["spin-off", "spins off", "new entity"],
    "IPO": ["IPO", "goes public", "initial public offering"],
    "delisting": ["delisting", "gets delisted"],
    "deal": ["deal", "agreement", "partnership"],
    "partnership": ["partnership", "strategic alliance"],
}

def detect_events_in_text(text):
    """Detect important event keywords using synonyms."""
    found_events = []
    text_lower = text.lower()

    for event, phrases in EVENT_KEYWORDS.items():
        if any(phrase in text_lower for phrase in phrases):
            found_events.append(event)

    return list(set(found_events))  # remove duplicates

def detect_entities(text, labels=("ORG",)):
    """Extract named entities using spaCy, filtered by type."""
    doc = nlp(text)
    return list(set((ent.text.strip(), ent.label_) for ent in doc.ents if ent.label_ in labels))

def analyze_text(text):
    """Detect events and entities together."""
    events = detect_events_in_text(text)
    orgs = [ent for ent, label in detect_entities(text) if label == "ORG"]
    return {
        "events": events,
        "organizations": list(set(orgs))
    }

# Optional test block
if __name__ == "__main__":
    sample_text = """
    Tesla has announced a major acquisition deal with a Chinese battery firm.
    Meanwhile, the CFO has resigned citing personal reasons.
    """
    result = analyze_text(sample_text)
    print(f"Detected events: {result['events']}")
    print(f"Organizations: {result['organizations']}")
