"""
Text Preprocessing Pipeline for Bi-LSTM Fake News Detection Model.
Reuses the exact text-cleaning and tokenization procedure employed
during pre-trained Bi-LSTM model training.
"""

import re
import string
from typing import List, Tuple
import numpy as np

MAX_SEQUENCE_LENGTH = 128
PAD_TYPE = 'post'
TRUNC_TYPE = 'post'


def clean_news_text(text: str) -> str:
    """
    Applies the exact text-cleaning procedure used during model training:
    1. Strip URLs and hyperlinks
    2. Remove HTML tags
    3. Remove non-alphanumeric punctuation (retaining hyphens)
    4. Lowercase conversion and whitespace normalization
    """
    if not text:
        return ""
    
    # Lowercase
    cleaned = text.lower()
    # Remove web URLs
    cleaned = re.sub(r'https?://\S+|www\.\S+', ' ', cleaned)
    # Remove HTML markup
    cleaned = re.sub(r'<.*?>', ' ', cleaned)
    # Normalize punctuation while retaining intra-word hyphens
    cleaned = re.sub(r'[^\w\s-]', ' ', cleaned)
    # Collapse consecutive whitespace characters
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned


def tokenize_and_pad(
    text: str,
    vocab_to_index: dict,
    max_len: int = MAX_SEQUENCE_LENGTH,
    pad_type: str = PAD_TYPE,
    trunc_type: str = TRUNC_TYPE,
    oov_token_id: int = 1
) -> Tuple[np.ndarray, List[str]]:
    """
    Converts cleaned text to padded numerical integer sequence.
    Returns:
        padded_sequence: np.ndarray of shape (1, max_len)
        tokens: list of cleaned string tokens
    """
    cleaned = clean_news_text(text)
    tokens = [t for t in cleaned.split() if t]
    
    # Map words to numerical vocabulary indices
    sequence = [vocab_to_index.get(token, oov_token_id) for token in tokens]
    
    # Apply truncation
    if len(sequence) > max_len:
        if trunc_type == 'post':
            sequence = sequence[:max_len]
        else:
            sequence = sequence[-max_len:]
            
    # Apply padding
    padded = np.zeros(max_len, dtype=np.int32)
    if len(sequence) > 0:
        if pad_type == 'post':
            padded[:len(sequence)] = sequence
        else:
            padded[-len(sequence):] = sequence
            
    return np.expand_dims(padded, axis=0), tokens
