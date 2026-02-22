from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Prioritize ENVIRONMENT secret, fallback to local only if explicitly in development
DATABASE_URL = os.getenv("DATABASE_URL")
ENVIRONMENT = os.getenv("ENVIRONMENT")
IS_HF = os.getenv("SPACE_ID") is not None or os.getenv("HF_SPACE_ID") is not None

# Diagnostic: List all env keys (names only for security)
print(f"DEBUG: IS_HF={IS_HF}, ENVIRONMENT={ENVIRONMENT}")
print(f"DEBUG: Available Env Keys: {sorted(os.environ.keys())}")

if DATABASE_URL:
    print(f"DEBUG: Found DATABASE_URL starting with: {DATABASE_URL[:15]}...")
else:
    # If we are in Hugging Face or production, we MUST have a DATABASE_URL
    if ENVIRONMENT == "production" or IS_HF:
        print("ERROR: DATABASE_URL missing while in Cloud/Production mode!")
        raise ValueError("CRITICAL: DATABASE_URL is missing in cloud environment. Check your HF Secrets!")
    
    print("DEBUG: Using local 'db' fallback (Development mode)")
    DATABASE_URL = "postgresql://postgres:postgres@db:5432/incident_db"

if "db:5432" in DATABASE_URL and (ENVIRONMENT == "production" or IS_HF):
    raise ValueError("CRITICAL: Local 'db' host detected in cloud! Check your DATABASE_URL secret.")

SQLALCHEMY_DATABASE_URL = DATABASE_URL

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
