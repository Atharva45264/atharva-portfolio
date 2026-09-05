from sentence_transformers import SentenceTransformer


MODEL_NAME = "all-MiniLM-L6-v2"

_model = None


def get_model() -> SentenceTransformer:
    """
    Load the embedding model only when it is first needed.

    This prevents Render from blocking FastAPI startup
    while downloading/loading the model.
    """
    global _model

    if _model is None:
        print(
            f"Loading embedding model: {MODEL_NAME}"
        )

        _model = SentenceTransformer(
            MODEL_NAME
        )

        print(
            "Embedding model loaded successfully."
        )

    return _model


def generate_embedding(
    text: str,
) -> list[float]:
    """
    Generate a single embedding vector
    for the provided text.
    """
    model = get_model()

    embedding = model.encode(
        text,
        normalize_embeddings=True,
    )

    return embedding.tolist()


def generate_embeddings(
    texts: list[str],
) -> list[list[float]]:
    """
    Generate embeddings for multiple text chunks.
    """
    model = get_model()

    embeddings = model.encode(
        texts,
        normalize_embeddings=True,
    )

    return embeddings.tolist()