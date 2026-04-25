import { OPENROUTER_API_KEY } from './config.js';

const BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';

async function callOpenRouter(model, messages) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, messages }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HTTP ${res.status}: ${err}`);
  }

  const data = await res.json();
  return { model, content: data.choices[0].message.content };
}

async function tryModels(label, modelList, messages) {
  console.log(`\n=== [${label}] ===`);
  for (const model of modelList) {
    process.stdout.write(`  시도: ${model} ... `);
    try {
      const result = await callOpenRouter(model, messages);
      console.log('성공');
      console.log(`  모델  : ${result.model}`);
      console.log(`  응답  : ${result.content.trim().slice(0, 300)}`);
      return result;
    } catch (e) {
      const code = e.message.match(/HTTP (\d+)/)?.[1] ?? '?';
      console.log(`실패 (${code})`);
    }
  }
  console.log('  → 모든 모델 실패');
  return null;
}

// ── 1. 텍스트 생성 ────────────────────────────────────────────
const TEXT_MODELS = [
  'qwen/qwen3-next-80b-a3b-instruct:free',
  'qwen/qwen3-coder:free',
  'openai/gpt-oss-20b:free',
  'openai/gpt-oss-120b:free',
  'nvidia/nemotron-3-super-120b-a12b:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'meta-llama/llama-3.2-3b-instruct:free',
];

// ── 2. 이미지 인식 ────────────────────────────────────────────
const IMAGE_MODELS = [
  'google/gemma-3-27b-it:free',   // 사용자 지정 모델
  'google/gemma-3-12b-it:free',
  'google/gemma-3-4b-it:free',
  'google/gemma-4-26b-a4b-it:free',
  'nvidia/nemotron-nano-12b-v2-vl:free',
];

const IMAGE_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/320px-Cat_November_2010-1a.jpg';

(async () => {
  await tryModels('텍스트 생성', TEXT_MODELS, [
    { role: 'user', content: '한 문장으로 자기소개 해줘. 한국어로.' },
  ]);

  await tryModels('이미지 인식', IMAGE_MODELS, [
    {
      role: 'user',
      content: [
        { type: 'image_url', image_url: { url: IMAGE_URL } },
        { type: 'text', text: '이 이미지에 무엇이 보이나요? 한국어로 설명해줘.' },
      ],
    },
  ]);

  console.log('\n완료');
})();
