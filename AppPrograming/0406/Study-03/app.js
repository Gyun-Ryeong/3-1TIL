// ===========================
// 게임 상태
// ===========================
const state = {
  questions: [],        // 현재 플레이할 문제 배열
  currentIndex: 0,      // 현재 문제 인덱스
  score: 0,             // 현재 점수
  categoryScores: {},   // 카테고리별 점수 { 카테고리명: { correct, total } }
  selectedCategory: '', // 선택된 카테고리
};

// ===========================
// 화면 전환
// ===========================
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

// ===========================
// 유틸 — 배열 셔플 (Fisher-Yates)
// ===========================
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ===========================
// 게임 시작 — 카테고리 선택
// ===========================
function startGame(category) {
  state.selectedCategory = category;
  state.score = 0;
  state.currentIndex = 0;
  state.categoryScores = {};

  if (category === '전체') {
    state.questions = shuffle(quizData);
  } else {
    state.questions = quizData.filter(q => q.category === category);
  }

  // 카테고리별 점수 초기화
  const cats = [...new Set(state.questions.map(q => q.category))];
  cats.forEach(c => { state.categoryScores[c] = { correct: 0, total: 0 }; });

  showQuestion();
}

// ===========================
// 문제 표시
// ===========================
function showQuestion() {
  const q = state.questions[state.currentIndex];
  const total = state.questions.length;

  // 헤더 업데이트
  document.getElementById('quiz-category').textContent = q.category;
  document.getElementById('quiz-progress').textContent =
    `${state.currentIndex + 1} / ${total}`;
  document.getElementById('quiz-score').textContent = `${state.score}점`;

  // 진행 바 업데이트
  const pct = ((state.currentIndex) / total) * 100;
  document.getElementById('progress-bar').style.width = `${pct}%`;

  // 문제 텍스트
  document.getElementById('quiz-question').textContent = q.question;

  // 보기 버튼 렌더링
  const optionBtns = document.querySelectorAll('#quiz-options .option-btn');
  const labels = ['①', '②', '③', '④'];
  optionBtns.forEach((btn, i) => {
    btn.textContent = `${labels[i]} ${q.options[i]}`;
    btn.className = 'option-btn';
    btn.disabled = false;
    btn.dataset.index = i;
  });

  showScreen('screen-quiz');
}

// ===========================
// 보기 선택 — 정답 처리
// ===========================
function selectOption(selectedIndex) {
  const q = state.questions[state.currentIndex];
  const isCorrect = selectedIndex === q.answer;

  // 카테고리별 통계 누적
  state.categoryScores[q.category].total += 1;
  if (isCorrect) {
    state.score += 10;
    state.categoryScores[q.category].correct += 1;
  }

  // 피드백 화면 구성
  const fbResult = document.getElementById('feedback-result');
  const fbMessage = document.getElementById('feedback-message');
  const fbOptions = document.getElementById('feedback-options');

  fbResult.textContent = isCorrect ? '정답입니다! 🎉' : '오답입니다 😢';
  fbResult.className = 'feedback-result ' + (isCorrect ? 'correct' : 'wrong');
  fbMessage.textContent = isCorrect
    ? `+10점 획득! 현재 점수: ${state.score}점`
    : `정답은 「${q.options[q.answer]}」입니다.`;

  // 피드백 보기 렌더링 (클릭 불가)
  const labels = ['①', '②', '③', '④'];
  fbOptions.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = `${labels[i]} ${opt}`;
    btn.disabled = true;
    if (i === q.answer) btn.classList.add('correct');
    else if (i === selectedIndex) btn.classList.add('wrong');
    fbOptions.appendChild(btn);
  });

  // [다음 문제] 버튼 포커스
  const btnNext = document.getElementById('btn-next');
  const isLast = state.currentIndex === state.questions.length - 1;
  btnNext.textContent = isLast ? '결과 보기' : '다음 문제';
  showScreen('screen-feedback');
  btnNext.focus();
}

// ===========================
// 다음 문제 or 결과 화면
// ===========================
function goNext() {
  state.currentIndex += 1;
  if (state.currentIndex >= state.questions.length) {
    showResult();
  } else {
    showQuestion();
  }
}

// ===========================
// 결과 화면
// ===========================
function showResult() {
  const total = state.questions.length;
  const maxScore = total * 10;
  const accuracy = Math.round((state.score / maxScore) * 100);
  const grade = calcGrade(accuracy);

  // 등급
  const gradeEl = document.getElementById('result-grade');
  gradeEl.textContent = `${grade}등급`;
  gradeEl.className = `result-grade grade-${grade}`;
  document.getElementById('result-grade-msg').textContent = gradeMessages[grade];

  // 총점 / 정답률
  document.getElementById('result-score').textContent = `${state.score} / ${maxScore}`;
  document.getElementById('result-accuracy').textContent = `${accuracy}%`;

  // 카테고리별 세부 점수
  const breakdown = document.getElementById('result-category-breakdown');
  breakdown.innerHTML = '';
  Object.entries(state.categoryScores).forEach(([cat, data]) => {
    const catScore = data.correct * 10;
    const catMax = data.total * 10;
    const div = document.createElement('div');
    div.className = 'breakdown-item';
    div.innerHTML = `
      <span>${cat}</span>
      <span class="breakdown-score">${catScore} / ${catMax}점 (${data.correct}/${data.total})</span>
    `;
    breakdown.appendChild(div);
  });

  // 진행 바 100% 완료 처리
  document.getElementById('progress-bar').style.width = '100%';

  // 닉네임 초기화
  document.getElementById('input-nickname').value = '';

  showScreen('screen-result');
}

// ===========================
// 등급 계산
// ===========================
function calcGrade(accuracy) {
  if (accuracy >= 90) return 'S';
  if (accuracy >= 80) return 'A';
  if (accuracy >= 70) return 'B';
  if (accuracy >= 60) return 'C';
  return 'D';
}

const gradeMessages = {
  S: '완벽해요! 상식왕이시네요! 👑',
  A: '훌륭해요! 아주 잘 아시는군요! 🌟',
  B: '좋아요! 조금만 더 공부하면 완벽해요! 👍',
  C: '괜찮아요! 다시 도전해 보세요! 💪',
  D: '아쉬워요! 포기하지 말고 다시 도전! 🔥',
};

// ===========================
// 토스트 알림
// ===========================
function showToast(msg, duration = 2500) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ===========================
// 랭킹 화면 렌더링
// ===========================
function renderRanking() {
  const rankings = JSON.parse(localStorage.getItem('quizRankings') || '[]');
  const tbody = document.getElementById('ranking-tbody');
  const empty = document.getElementById('ranking-empty');
  const table = document.querySelector('.ranking-table');

  tbody.innerHTML = '';

  if (rankings.length === 0) {
    table.style.display = 'none';
    empty.style.display = 'block';
    return;
  }

  table.style.display = '';
  empty.style.display = 'none';

  rankings.forEach((r, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i + 1}위</td>
      <td>${r.nickname}</td>
      <td>${r.score}점</td>
      <td>${r.accuracy}%</td>
      <td>${r.date}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ===========================
// 랭킹 저장
// ===========================
function saveRanking() {
  const nickname = document.getElementById('input-nickname').value.trim();
  if (!nickname) {
    alert('닉네임을 입력해 주세요.');
    document.getElementById('input-nickname').focus();
    return;
  }

  const total = state.questions.length;
  const maxScore = total * 10;
  const accuracy = Math.round((state.score / maxScore) * 100);

  const now = new Date();
  const date = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

  const entry = { nickname, score: state.score, accuracy, date };
  const rankings = JSON.parse(localStorage.getItem('quizRankings') || '[]');
  rankings.push(entry);
  rankings.sort((a, b) => b.score - a.score);
  const top10 = rankings.slice(0, 10);
  localStorage.setItem('quizRankings', JSON.stringify(top10));

  showToast(`${nickname}님의 점수가 저장되었습니다! 🎉`);
  document.getElementById('btn-save-ranking').disabled = true;
  document.getElementById('input-nickname').disabled = true;
}

// ===========================
// 키보드 접근성 (숫자키 1~4)
// ===========================
document.addEventListener('keydown', (e) => {
  const activeScreen = document.querySelector('.screen.active');
  if (!activeScreen) return;

  if (activeScreen.id === 'screen-quiz') {
    const keyMap = { '1': 0, '2': 1, '3': 2, '4': 3 };
    if (keyMap[e.key] !== undefined) {
      const btn = document.querySelector(`#quiz-options .option-btn[data-index="${keyMap[e.key]}"]`);
      if (btn && !btn.disabled) btn.click();
    }
  }

  if (activeScreen.id === 'screen-feedback') {
    if (e.key === 'Enter') document.getElementById('btn-next').click();
  }
});

// ===========================
// 이벤트 연결
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  // 메인 화면
  document.getElementById('btn-start').addEventListener('click', () => showScreen('screen-category'));
  document.getElementById('btn-ranking').addEventListener('click', () => {
    renderRanking();
    showScreen('screen-ranking');
  });

  // 카테고리 선택
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => startGame(card.dataset.category));
  });
  document.getElementById('btn-category-back').addEventListener('click', () => showScreen('screen-main'));

  // 퀴즈 진행 — 보기 선택
  document.querySelectorAll('#quiz-options .option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // 중복 클릭 방지
      document.querySelectorAll('#quiz-options .option-btn').forEach(b => b.disabled = true);
      selectOption(parseInt(btn.dataset.index));
    });
  });

  // 피드백 — 다음 문제
  document.getElementById('btn-next').addEventListener('click', goNext);

  // 결과 화면
  document.getElementById('btn-save-ranking').addEventListener('click', saveRanking);
  document.getElementById('btn-retry').addEventListener('click', () => {
    document.getElementById('btn-save-ranking').disabled = false;
    document.getElementById('input-nickname').disabled = false;
    showScreen('screen-category');
  });
  document.getElementById('btn-result-home').addEventListener('click', () => {
    document.getElementById('btn-save-ranking').disabled = false;
    document.getElementById('input-nickname').disabled = false;
    showScreen('screen-main');
  });

  // 랭킹 화면
  document.getElementById('btn-ranking-home').addEventListener('click', () => showScreen('screen-main'));

  // 데이터 확인
  console.log(`문제 데이터 로드 완료: 총 ${quizData.length}문제`);
  const cats = [...new Set(quizData.map(q => q.category))];
  cats.forEach(c => {
    console.log(`  - ${c}: ${quizData.filter(q => q.category === c).length}문제`);
  });
});
