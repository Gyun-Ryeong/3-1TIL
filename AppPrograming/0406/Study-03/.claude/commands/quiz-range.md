data.js 파일을 읽고, $ARGUMENTS에서 첫 번째 값을 시작 id, 두 번째 값을 끝 id로 사용해서 해당 범위(시작 id ~ 끝 id)에 해당하는 문제를 검토해 줘.

검토 항목:
- id, category, question, options, answer(정답 보기 텍스트)를 표 형태로 출력
- answer 인덱스가 options 배열 범위를 벗어나는 문제는 "오류" 표시
- 해당 범위에 문제가 없으면 "해당 범위에 문제 없음" 출력
- 마지막에 검토한 문제 총 개수 요약

검색 대상 파일: data.js
