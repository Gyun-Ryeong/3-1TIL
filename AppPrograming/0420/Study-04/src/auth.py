import json
import hashlib
from pathlib import Path

USERS_FILE = Path("data/users.json")
RECIPES_FILE = Path("data/saved_recipes.json")


def _load(path: Path) -> dict:
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return {}


def _save(path: Path, data: dict):
    path.parent.mkdir(exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def _hash(pw: str) -> str:
    return hashlib.sha256(pw.encode()).hexdigest()


def signup(username: str, password: str, nickname: str) -> tuple[bool, str]:
    users = _load(USERS_FILE)
    if username in users:
        return False, "이미 존재하는 아이디입니다."
    users[username] = {"password": _hash(password), "nickname": nickname}
    _save(USERS_FILE, users)
    return True, "회원가입이 완료됐습니다!"


def login(username: str, password: str) -> tuple[bool, str]:
    users = _load(USERS_FILE)
    user = users.get(username)
    if not user:
        return False, "존재하지 않는 아이디입니다."
    if user["password"] != _hash(password):
        return False, "비밀번호가 틀렸습니다."
    return True, user["nickname"]


def save_recipe(username: str, recipe: dict) -> tuple[bool, str]:
    data = _load(RECIPES_FILE)
    user_recipes = data.get(username, [])
    if any(r.get("name") == recipe.get("name") for r in user_recipes):
        return False, "이미 저장된 레시피입니다."
    from datetime import datetime
    recipe["saved_at"] = datetime.now().strftime("%Y-%m-%d %H:%M")
    user_recipes.append(recipe)
    data[username] = user_recipes
    _save(RECIPES_FILE, data)
    return True, f"'{recipe.get('name')}' 저장 완료!"


def get_saved_recipes(username: str) -> list[dict]:
    data = _load(RECIPES_FILE)
    return data.get(username, [])


def delete_recipe(username: str, recipe_name: str):
    data = _load(RECIPES_FILE)
    data[username] = [r for r in data.get(username, []) if r.get("name") != recipe_name]
    _save(RECIPES_FILE, data)
