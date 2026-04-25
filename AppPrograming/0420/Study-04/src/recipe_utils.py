import json
import re


def parse_recipes(raw: str) -> list[dict]:
    """LLM 응답에서 레시피 JSON을 추출."""
    # ```json ... ``` 블록 제거
    raw = re.sub(r"```(?:json)?", "", raw).strip()
    start = raw.find("{")
    end = raw.rfind("}") + 1
    if start == -1:
        return []
    data = json.loads(raw[start:end])
    return data.get("recipes", [])


def filter_recipes(recipes: list[dict], difficulty: str, max_time: int) -> list[dict]:
    result = []
    for r in recipes:
        if difficulty != "전체" and r.get("difficulty") != difficulty:
            continue
        try:
            t = int(str(r.get("time", 9999)).replace("분", "").strip())
        except ValueError:
            t = 9999
        if max_time and t > max_time:
            continue
        result.append(r)
    return result
