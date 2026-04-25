// OpenRouter API 사용 예제
// 이미지 인식: google/gemma-3-27b-it:free
// 텍스트 생성: qwen/qwen3.6-plus:free (rate-limit 시 폴백 모델 사용)

import { OPENROUTER_API_KEY } from './src/config.js';

const BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';

async function chat(model, messages) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, messages }),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

// ── 텍스트 생성 예제 ─────────────────────────────────────────
async function textExample() {
  const model = 'qwen/qwen3.6-plus:free';
  console.log(`[텍스트 생성] 모델: ${model}`);

  const reply = await chat(model, [
    { role: 'user', content: '냉장고에 달걀, 당근, 양파가 있어. 간단한 요리를 추천해줘.' },
  ]);
  console.log('응답:', reply);
}

// ── 이미지 인식 예제 ──────────────────────────────────────────
async function imageExample() {
  const model = 'google/gemma-3-27b-it:free';
  console.log(`\n[이미지 인식] 모델: ${model}`);

  const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/320px-Cat_November_2010-1a.jpg';

  const reply = await chat(model, [
    {
      role: 'user',
      content: [
        { type: 'image_url', image_url: { url: imageUrl } },
        { type: 'text', text: '이 이미지에 무엇이 보이나요? 한국어로 설명해줘.' },
      ],
    },
  ]);
  console.log('응답:', reply);
}

(async () => {
  try {
    await textExample();
    await imageExample();
  } catch (e) {
    console.error('오류:', e.message);
  }
})();
