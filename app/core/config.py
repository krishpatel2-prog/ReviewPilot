from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

settings = Settings()
