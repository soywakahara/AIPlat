from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGODB_URL: str = "mongodb://mongodb:27017"
    API_PREFIX: str = "/api"
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]

settings = Settings() 