import base64
import json
import requests
from src.config import OPENROUTER_API_KEY, IMAGE_MODEL, TEXT_MODEL

BASE_URL = "https://openrouter.ai/api/v1/chat/completions"
HEADERS = {
    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
    "Content-Type": "application/json",
}

FALLBACK_IMAGE_MODELS = [
    IMAGE_MODEL,
    "google/gemma-3-12b-it:free",
    "google/gemma-3-4b-it:free",
    "google/gemma-4-26b-a4b-it:free",
]

def _call(model: str, messages: list) -> str:
    res = requests.post(
        BASE_URL,
        headers=HEADERS,
        json={"model": model, "messages": messages},
        timeout=60,
    )
    res.raise_for_status()
    return res.json()["choices"][0]["message"]["content"]


def recognize_ingredients(image_bytes: bytes) -> list[dict]:
    """이미지에서 식재료를 인식하여 리스트로 반환."""
    b64 = base64.b64encode(image_bytes).decode()
    prompt = (
        "이 냉장고 사진에서 보이는 식재료를 모두 찾아서 JSON 형식으로만 반환해줘. "
        "다른 설명 없이 JSON만 출력해. "
        '형식: {"ingredients": [{"name": "재료명", "quantity": "수량", "condition": "상태(신선/보통/오래됨)"}]}'
    )
    messages = [
        {
            "role": "user",
            "content": [
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}"}},
                {"type": "text", "text": prompt},
            ],
        }
    ]

    last_error = None
    for model in FALLBACK_IMAGE_MODELS:
        try:
            raw = _call(model, messages)
            # JSON 블록 추출
            start = raw.find("{")
            end = raw.rfind("}") + 1
            data = json.loads(raw[start:end])
            return data.get("ingredients", [])
        except Exception as e:
            last_error = e
            continue

    raise RuntimeError(f"모든 이미지 인식 모델 실패: {last_error}")


FALLBACK_TEXT_MODELS = [
    TEXT_MODEL,
    "openai/gpt-oss-20b:free",
    "openai/gpt-oss-120b:free",
    "meta-llama/llama-3.3-70b-instruct:free",
]


def generate_recipes(ingredients: list[dict]) -> list[dict]:
    """재료 목록으로 레시피 3가지를 생성하여 반환."""
    from src.recipe_utils import parse_recipes

    names = ", ".join(i.get("name", "") for i in ingredients)
    prompt = f"""다음 재료들로 만들 수 있는 레시피 3가지를 추천해줘.
재료: {names}

반드시 아래 JSON 형식으로만 답해줘. 다른 설명 없이 JSON만 출력해:
{{
  "recipes": [
    {{
      "name": "요리명",
      "difficulty": "난이도(쉬움/보통/어려움)",
      "time": "조리시간(숫자만, 분 단위)",
      "calories": "칼로리(숫자만, kcal)",
      "ingredients": ["필요재료1", "필요재료2"],
      "steps": ["1. 첫번째 단계", "2. 두번째 단계", "3. 세번째 단계"]
    }}
  ]
}}"""

    messages = [{"role": "user", "content": prompt}]

    last_error = None
    for model in FALLBACK_TEXT_MODELS:
        try:
            raw = _call(model, messages)
            recipes = parse_recipes(raw)
            if recipes:
                return recipes
        except Exception as e:
            last_error = e
            continue

    raise RuntimeError(f"모든 텍스트 생성 모델 실패: {last_error}")
