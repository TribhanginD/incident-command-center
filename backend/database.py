from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Prioritize ENVIRONMENT secret, fallback to local only if explicitly in development
DATABASE_URL = os.getenv("DATABASE_URL")
ENVIRONMENT = os.getenv("ENVIRONMENT")

if DATABASE_URL:
    print(f"DEBUG: Found DATABASE_URL starting with: {DATABASE_URL[:15]}...")
else:
    print("DEBUG: DATABASE_URL not found in environment!")

if not DATABASE_URL:
    if ENVIRONMENT == "production":
        raise ValueError("CRITICAL: DATABASE_URL is not set in production!")
    print("DEBUG: Using local 'db' fallback (Development mode)")
    DATABASE_URL = "postgresql://postgres:postgres@db:5432/incident_db"

if "db:5432" in DATABASE_URL and ENVIRONMENT == "production":
    raise ValueError("CRITICAL: Local 'db' host detected while in production mode! Check your secrets.")

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
