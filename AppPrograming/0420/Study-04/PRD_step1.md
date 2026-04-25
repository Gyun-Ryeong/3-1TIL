# PRD Step 1 — 냉장고 이미지에서 재료 인식하기

## 개요
냉장고 사진을 업로드하면 AI가 식재료를 자동으로 인식하여 목록으로 표시하는 웹 애플리케이션의 1단계입니다.

## 사용 기술
- **웹 프레임워크**: Streamlit
- **이미지 인식 모델**: `google/gemma-3-27b-it:free` (OpenRouter)
- **언어**: Python
- **환경 변수**: `.env` 파일의 `OPENROUTER_API_KEY`

## 기능 요구사항

### 1. 웹 UI
- Streamlit 기반 웹 인터페이스
- 앱 제목: **FridgeChef 🍳 — AI 냉장고 레시피 추천**
- 사이드바: 메뉴 네비게이션 (재료 인식 / 레시피 생성 / 나의 레시피)

### 2. 이미지 업로드
- `st.file_uploader`로 이미지 파일 업로드 (jpg, jpeg, png 지원)
- 업로드된 이미지를 화면에 미리보기로 표시
- **[재료 인식 시작]** 버튼

### 3. 재료 인식 (AI 호출)
- 업로드된 이미지를 base64로 인코딩
- OpenRouter API의 `google/gemma-3-27b-it:free` 모델에 전송
- 프롬프트: "이 냉장고 사진에서 보이는 식재료를 모두 찾아서 JSON 형식으로 반환해줘. 형식: {\"ingredients\": [{\"name\": \"재료명\", \"quantity\": \"수량\", \"condition\": \"상태\"}]}"
- 응답에서 JSON 파싱하여 재료 목록 추출

### 4. 결과 표시
- 인식된 재료를 카드 형태로 표시 (3열 그리드)
- 각 카드: 재료명 / 수량 / 상태(신선/보통/오래됨)
- 인식 재료 수 요약 표시

## 파일 구조
```
Study-04/
├── app.py              # Streamlit 메인 앱
├── src/
│   ├── config.py       # 환경 변수 로드 (OPENROUTER_API_KEY)
│   └── api_client.py   # OpenRouter API 호출 함수
├── .env
└── requirements.txt    # streamlit, requests, python-dotenv
```

## 실행 방법
```bash
pip install -r requirements.txt
streamlit run app.py
```

## 완료 기준
- [ ] 이미지 업로드 후 재료 인식 버튼 클릭 시 AI 응답 수신
- [ ] 재료 목록이 카드 형태로 화면에 표시됨
- [ ] 에러 발생 시 사용자에게 안내 메시지 표시
