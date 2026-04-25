import streamlit as st
from src.api_client import recognize_ingredients, generate_recipes
from src.recipe_utils import filter_recipes
from src.auth import signup, login, save_recipe, get_saved_recipes, delete_recipe

# ── 페이지 설정 ────────────────────────────────────────────────
st.set_page_config(page_title="FridgeChef", page_icon="🍳", layout="wide")

# ── 세션 초기화 ────────────────────────────────────────────────
for key, default in {
    "ingredients": [],
    "recipes": [],
    "user": None,
    "nickname": "",
    "recognize_count": 0,
}.items():
    if key not in st.session_state:
        st.session_state[key] = default

# ════════════════════════════════════════════════════════════════
# 사이드바
# ════════════════════════════════════════════════════════════════
with st.sidebar:
    st.title("🍳 FridgeChef")
    st.caption("AI 냉장고 레시피 추천")
    st.divider()

    # 로그인 상태
    if st.session_state["user"]:
        st.success(f"👤 {st.session_state['nickname']}님")
        if st.button("로그아웃", use_container_width=True):
            st.session_state["user"] = None
            st.session_state["nickname"] = ""
            st.rerun()
    else:
        with st.expander("🔐 로그인 / 회원가입"):
            tab_login, tab_signup = st.tabs(["로그인", "회원가입"])
            with tab_login:
                u = st.text_input("아이디", key="li_u")
                p = st.text_input("비밀번호", type="password", key="li_p")
                if st.button("로그인", use_container_width=True):
                    ok, msg = login(u, p)
                    if ok:
                        st.session_state["user"] = u
                        st.session_state["nickname"] = msg
                        st.rerun()
                    else:
                        st.error(msg)
            with tab_signup:
                su = st.text_input("아이디", key="su_u")
                sp = st.text_input("비밀번호", type="password", key="su_p")
                sn = st.text_input("닉네임", key="su_n")
                if st.button("회원가입", use_container_width=True):
                    ok, msg = signup(su, sp, sn)
                    st.success(msg) if ok else st.error(msg)

    st.divider()
    menu = st.radio(
        "메뉴",
        ["🔍 재료 인식", "📋 레시피 생성", "💾 나의 레시피", "📊 대시보드"],
        index=0,
    )
    if st.session_state["ingredients"]:
        st.caption(f"🥦 인식 재료: {len(st.session_state['ingredients'])}가지")

# ════════════════════════════════════════════════════════════════
# Step 1 — 재료 인식
# ════════════════════════════════════════════════════════════════
if menu == "🔍 재료 인식":
    st.title("🔍 냉장고 재료 인식")
    st.write("냉장고 사진을 업로드하면 AI가 식재료를 자동으로 분석합니다.")

    uploaded = st.file_uploader("냉장고 사진 업로드", type=["jpg", "jpeg", "png"])
    if uploaded:
        col1, col2 = st.columns([1, 1])
        with col1:
            st.image(uploaded, caption="업로드된 사진", use_container_width=True)
        with col2:
            if st.button("🤖 재료 인식 시작", type="primary", use_container_width=True):
                with st.spinner("AI가 재료를 분석 중입니다..."):
                    try:
                        ings = recognize_ingredients(uploaded.read())
                        st.session_state["ingredients"] = ings
                        st.session_state["recipes"] = []
                        st.session_state["recognize_count"] += 1
                        st.success(f"✅ {len(ings)}가지 재료를 인식했습니다!")
                    except Exception as e:
                        st.error(f"오류: {e}")

    if st.session_state["ingredients"]:
        st.divider()
        st.subheader(f"🥦 인식된 재료 ({len(st.session_state['ingredients'])}가지)")
        cols = st.columns(3)
        for i, item in enumerate(st.session_state["ingredients"]):
            cond = item.get("condition", "보통")
            icon = {"신선": "🟢", "보통": "🟡", "오래됨": "🔴"}.get(cond, "⚪")
            with cols[i % 3]:
                st.markdown(
                    f"""<div style="border:1px solid #ddd;border-radius:10px;padding:12px;
                    margin-bottom:10px;background:#f9f9f9;">
                    <b style="font-size:1.1em">{item.get('name','?')}</b><br>
                    📦 {item.get('quantity','-')} &nbsp; {icon} {cond}</div>""",
                    unsafe_allow_html=True,
                )
        st.info("👉 사이드바에서 [📋 레시피 생성]을 클릭하세요!")

# ════════════════════════════════════════════════════════════════
# Step 2 — 레시피 생성
# ════════════════════════════════════════════════════════════════
elif menu == "📋 레시피 생성":
    st.title("📋 레시피 생성")

    if not st.session_state["ingredients"]:
        st.warning("먼저 [🔍 재료 인식]에서 냉장고 사진을 업로드해 주세요.")
        st.stop()

    st.subheader("🥦 재료 편집")
    to_delete = []
    cols = st.columns(4)
    for i, item in enumerate(st.session_state["ingredients"]):
        with cols[i % 4]:
            if st.checkbox(f"✕ {item.get('name','?')}", key=f"del_{i}"):
                to_delete.append(i)
    if to_delete and st.button("선택 삭제"):
        st.session_state["ingredients"] = [
            v for j, v in enumerate(st.session_state["ingredients"]) if j not in to_delete
        ]
        st.rerun()

    with st.expander("➕ 재료 추가"):
        c1, c2, c3 = st.columns([2, 1, 1])
        new_name = c1.text_input("재료명")
        new_qty  = c2.text_input("수량", value="적당량")
        if c3.button("추가", use_container_width=True) and new_name:
            st.session_state["ingredients"].append({"name": new_name, "quantity": new_qty, "condition": "신선"})
            st.rerun()

    st.divider()
    if st.button("🍳 레시피 생성", type="primary", use_container_width=True):
        with st.spinner("AI가 레시피를 만드는 중..."):
            try:
                recipes = generate_recipes(st.session_state["ingredients"])
                st.session_state["recipes"] = recipes
                st.success(f"✅ {len(recipes)}가지 레시피 생성 완료!")
            except Exception as e:
                st.error(f"오류: {e}")

    if st.session_state["recipes"]:
        st.divider()
        fc1, fc2, fc3 = st.columns(3)
        diff_f  = fc1.selectbox("난이도", ["전체", "쉬움", "보통", "어려움"])
        time_o  = fc2.selectbox("조리시간", ["전체", "30분 이하", "1시간 이하"])
        search  = fc3.text_input("레시피 검색")
        max_t   = {"전체": 0, "30분 이하": 30, "1시간 이하": 60}[time_o]

        recipes = filter_recipes(st.session_state["recipes"], diff_f, max_t)
        if search:
            recipes = [r for r in recipes if search.lower() in r.get("name","").lower()]

        st.divider()
        if not recipes:
            st.info("조건에 맞는 레시피가 없습니다.")
        for recipe in recipes:
            d_icon = {"쉬움": "🟢", "보통": "🟡", "어려움": "🔴"}.get(recipe.get("difficulty",""), "⚪")
            with st.expander(
                f"🍽️ {recipe.get('name','?')}  {d_icon} {recipe.get('difficulty','-')}  "
                f"⏱️ {recipe.get('time','-')}분  🔥 {recipe.get('calories','-')} kcal"
            ):
                c1, c2 = st.columns(2)
                with c1:
                    st.markdown("**필요 재료**")
                    for ing in recipe.get("ingredients", []):
                        st.write(f"• {ing}")
                with c2:
                    st.markdown("**조리 순서**")
                    for step in recipe.get("steps", []):
                        st.write(step)

                if st.session_state["user"]:
                    if st.button("💾 저장", key=f"save_{recipe.get('name')}"):
                        ok, msg = save_recipe(st.session_state["user"], recipe.copy())
                        st.success(msg) if ok else st.warning(msg)
                else:
                    st.caption("💾 저장하려면 로그인하세요.")

# ════════════════════════════════════════════════════════════════
# Step 3 — 나의 레시피
# ════════════════════════════════════════════════════════════════
elif menu == "💾 나의 레시피":
    st.title("💾 나의 레시피")

    if not st.session_state["user"]:
        st.warning("로그인 후 이용할 수 있습니다. 사이드바에서 로그인해 주세요.")
        st.stop()

    saved = get_saved_recipes(st.session_state["user"])
    st.subheader(f"저장된 레시피 {len(saved)}개")

    if not saved:
        st.info("아직 저장된 레시피가 없습니다. [📋 레시피 생성]에서 마음에 드는 레시피를 저장해보세요!")
    else:
        for recipe in saved:
            d_icon = {"쉬움": "🟢", "보통": "🟡", "어려움": "🔴"}.get(recipe.get("difficulty",""), "⚪")
            with st.expander(
                f"🍽️ {recipe.get('name','?')}  {d_icon} {recipe.get('difficulty','-')}  "
                f"⏱️ {recipe.get('time','-')}분  📅 {recipe.get('saved_at','')}"
            ):
                c1, c2 = st.columns(2)
                with c1:
                    st.markdown("**필요 재료**")
                    for ing in recipe.get("ingredients", []):
                        st.write(f"• {ing}")
                with c2:
                    st.markdown("**조리 순서**")
                    for step in recipe.get("steps", []):
                        st.write(step)
                if st.button("🗑️ 삭제", key=f"del_saved_{recipe.get('name')}"):
                    delete_recipe(st.session_state["user"], recipe.get("name"))
                    st.rerun()

# ════════════════════════════════════════════════════════════════
# Step 3 — 대시보드
# ════════════════════════════════════════════════════════════════
elif menu == "📊 대시보드":
    st.title("📊 대시보드")

    if not st.session_state["user"]:
        st.warning("로그인 후 이용할 수 있습니다.")
        st.stop()

    saved = get_saved_recipes(st.session_state["user"])

    # 통계 카드
    col1, col2, col3 = st.columns(3)
    col1.metric("💾 저장 레시피", f"{len(saved)}개")
    col2.metric("🔍 재료 인식 횟수", f"{st.session_state['recognize_count']}회")
    total_ings = sum(len(r.get("ingredients", [])) for r in saved)
    col3.metric("🥦 저장된 재료 총합", f"{total_ings}가지")

    if saved:
        st.divider()

        # 난이도 분포
        st.subheader("📈 난이도 분포")
        from collections import Counter
        diff_counts = Counter(r.get("difficulty", "기타") for r in saved)
        st.bar_chart(diff_counts)

        # 자주 등장한 재료 Top 5
        st.subheader("🥇 자주 사용된 재료 Top 5")
        from collections import Counter
        all_ings = [ing for r in saved for ing in r.get("ingredients", [])]
        top5 = Counter(all_ings).most_common(5)
        for rank, (name, cnt) in enumerate(top5, 1):
            st.write(f"{rank}위. {name} ({cnt}회)")
    else:
        st.info("레시피를 저장하면 통계가 표시됩니다.")
