import os
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

if not OPENROUTER_API_KEY:
    raise ValueError("OPENROUTER_API_KEY가 .env 파일에 설정되어 있지 않습니다.")

IMAGE_MODEL = "google/gemma-3-27b-it:free"
TEXT_MODEL  = "qwen/qwen3.6-plus:free"
