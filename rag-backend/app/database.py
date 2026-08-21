import os

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DATABASE = os.getenv(
    "MONGODB_DATABASE",
    "atharva_portfolio",
)
MONGODB_COLLECTION = os.getenv(
    "MONGODB_COLLECTION",
    "knowledge",
)

if not MONGODB_URI:
    raise ValueError("MONGODB_URI is not set in the .env file")

client = MongoClient(MONGODB_URI)

db = client[MONGODB_DATABASE]

knowledge_collection = db[MONGODB_COLLECTION]


def get_database():
    return db


def get_knowledge_collection():
    return knowledge_collection

def get_users_collection():
    db = get_database()
    return db["users"]