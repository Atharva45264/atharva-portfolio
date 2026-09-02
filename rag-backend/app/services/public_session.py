import hashlib
import hmac
import secrets


def generate_conversation_token() -> str:
    """
    Generate a cryptographically secure token
    for a public chatbot conversation.
    """

    return secrets.token_urlsafe(32)


def hash_conversation_token(token: str) -> str:
    """
    Hash the conversation token before storing it
    in MongoDB.
    """

    return hashlib.sha256(
        token.encode("utf-8")
    ).hexdigest()


def verify_conversation_token(
    token: str,
    stored_hash: str,
) -> bool:
    """
    Verify a provided conversation token
    against the stored hash.
    """

    token_hash = hash_conversation_token(token)

    return hmac.compare_digest(
        token_hash,
        stored_hash,
    )