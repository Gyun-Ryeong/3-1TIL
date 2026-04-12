const quizData = [
  // =====================
  // 한국사 (10문제)
  // =====================
  {
    id: 1,
    category: "한국사",
    question: "고려를 건국한 인물은 누구인가?",
    options: ["왕건", "견훤", "궁예", "김부식"],
    answer: 0
  },
  {
    id: 2,
    category: "한국사",
    question: "조선을 건국한 인물은 누구인가?",
    options: ["정도전", "이성계", "이방원", "최영"],
    answer: 1
  },
  {
    id: 3,
    category: "한국사",
    question: "한글을 창제한 조선의 왕은 누구인가?",
    options: ["태종", "성종", "세종", "중종"],
    answer: 2
  },
  {
    id: 4,
    category: "한국사",
    question: "임진왜란이 일어난 해는?",
    options: ["1492년", "1592년", "1692년", "1392년"],
    answer: 1
  },
  {
    id: 5,
    category: "한국사",
    question: "3·1 운동이 일어난 연도는?",
    options: ["1910년", "1945년", "1919년", "1920년"],
    answer: 2
  },
  {
    id: 6,
    category: "한국사",
    question: "조선시대 최고 행정기관은?",
    options: ["사헌부", "의정부", "홍문관", "승정원"],
    answer: 1
  },
  {
    id: 7,
    category: "한국사",
    question: "신라의 삼국 통일을 이룬 왕은 누구인가?",
    options: ["진흥왕", "무열왕", "문무왕", "선덕여왕"],
    answer: 2
  },
  {
    id: 8,
    category: "한국사",
    question: "조선왕조실록을 보관하던 창고의 이름은?",
    options: ["사고", "규장각", "집현전", "승정원"],
    answer: 0
  },
  {
    id: 9,
    category: "한국사",
    question: "대한민국 임시정부가 수립된 도시는?",
    options: ["베이징", "도쿄", "상하이", "충칭"],
    answer: 2
  },
  {
    id: 10,
    category: "한국사",
    question: "거북선을 만든 조선시대 장군은 누구인가?",
    options: ["권율", "이순신", "신립", "곽재우"],
    answer: 1
  },

  // =====================
  // 과학 (10문제)
  // =====================
  {
    id: 11,
    category: "과학",
    question: "물의 화학식은?",
    options: ["CO2", "H2O2", "H2O", "NaCl"],
    answer: 2
  },
  {
    id: 12,
    category: "과학",
    question: "빛의 속도는 약 얼마인가?",
    options: ["약 30만 km/s", "약 3만 km/s", "약 300만 km/s", "약 3000 km/s"],
    answer: 0
  },
  {
    id: 13,
    category: "과학",
    question: "지구에서 가장 풍부한 원소는?",
    options: ["철", "탄소", "산소", "규소"],
    answer: 2
  },
  {
    id: 14,
    category: "과학",
    question: "DNA의 이중나선 구조를 밝힌 과학자는?",
    options: ["아인슈타인", "왓슨과 크릭", "멘델", "파스퇴르"],
    answer: 1
  },
  {
    id: 15,
    category: "과학",
    question: "사과가 떨어지는 것을 보고 만유인력을 발견한 과학자는?",
    options: ["갈릴레이", "케플러", "뉴턴", "라이프니츠"],
    answer: 2
  },
  {
    id: 16,
    category: "과학",
    question: "주기율표에서 금의 원소 기호는?",
    options: ["Ag", "Fe", "Au", "Cu"],
    answer: 2
  },
  {
    id: 17,
    category: "과학",
    question: "인체에서 혈액을 전신으로 펌프질하는 기관은?",
    options: ["폐", "간", "신장", "심장"],
    answer: 3
  },
  {
    id: 18,
    category: "과학",
    question: "태양계에서 가장 큰 행성은?",
    options: ["토성", "목성", "천왕성", "해왕성"],
    answer: 1
  },
  {
    id: 19,
    category: "과학",
    question: "소리가 전달될 수 없는 환경은?",
    options: ["물속", "진공", "공기 중", "금속 내부"],
    answer: 1
  },
  {
    id: 20,
    category: "과학",
    question: "광합성 시 식물이 흡수하는 기체는?",
    options: ["산소(O2)", "질소(N2)", "이산화탄소(CO2)", "수소(H2)"],
    answer: 2
  },

  // =====================
  // 지리 (10문제)
  // =====================
  {
    id: 21,
    category: "지리",
    question: "대한민국의 수도는?",
    options: ["부산", "인천", "서울", "대전"],
    answer: 2
  },
  {
    id: 22,
    category: "지리",
    question: "세계에서 가장 높은 산은?",
    options: ["K2", "에베레스트", "킬리만자로", "몽블랑"],
    answer: 1
  },
  {
    id: 23,
    category: "지리",
    question: "일본의 수도는?",
    options: ["오사카", "교토", "도쿄", "나고야"],
    answer: 2
  },
  {
    id: 24,
    category: "지리",
    question: "나일강이 흐르는 대륙은?",
    options: ["아시아", "남아메리카", "유럽", "아프리카"],
    answer: 3
  },
  {
    id: 25,
    category: "지리",
    question: "한국에서 가장 큰 섬은?",
    options: ["울릉도", "거제도", "제주도", "진도"],
    answer: 2
  },
  {
    id: 26,
    category: "지리",
    question: "세계에서 가장 넓은 나라는?",
    options: ["중국", "미국", "캐나다", "러시아"],
    answer: 3
  },
  {
    id: 27,
    category: "지리",
    question: "브라질의 수도는?",
    options: ["상파울루", "리우데자네이루", "브라질리아", "살바도르"],
    answer: 2
  },
  {
    id: 28,
    category: "지리",
    question: "태평양, 대서양, 인도양 중 가장 넓은 바다는?",
    options: ["대서양", "인도양", "태평양", "북극해"],
    answer: 2
  },
  {
    id: 29,
    category: "지리",
    question: "남한에서 가장 긴 강은?",
    options: ["한강", "낙동강", "금강", "영산강"],
    answer: 1
  },
  {
    id: 30,
    category: "지리",
    question: "아마존 강이 흐르는 나라는?",
    options: ["아르헨티나", "칠레", "브라질", "페루"],
    answer: 2
  },

  // =====================
  // 일반상식 (10문제)
  // =====================
  {
    id: 31,
    category: "일반상식",
    question: "올림픽이 열리는 주기는?",
    options: ["2년마다", "3년마다", "4년마다", "5년마다"],
    answer: 2
  },
  {
    id: 32,
    category: "일반상식",
    question: "월드컵 축구 대회를 주관하는 기관은?",
    options: ["IOC", "UEFA", "FIFA", "AFC"],
    answer: 2
  },
  {
    id: 33,
    category: "일반상식",
    question: "노벨상을 제정한 알프레드 노벨의 국적은?",
    options: ["독일", "스웨덴", "노르웨이", "덴마크"],
    answer: 1
  },
  {
    id: 34,
    category: "일반상식",
    question: "1년 중 가장 낮이 긴 날은?",
    options: ["춘분", "추분", "동지", "하지"],
    answer: 3
  },
  {
    id: 35,
    category: "일반상식",
    question: "유네스코(UNESCO)의 본부가 위치한 도시는?",
    options: ["뉴욕", "제네바", "파리", "런던"],
    answer: 2
  },
  {
    id: 36,
    category: "일반상식",
    question: "피아노 건반에서 흰 건반의 총 개수는?",
    options: ["52개", "48개", "56개", "60개"],
    answer: 0
  },
  {
    id: 37,
    category: "일반상식",
    question: "한국의 국기 이름은?",
    options: ["성조기", "태극기", "일장기", "오성홍기"],
    answer: 1
  },
  {
    id: 38,
    category: "일반상식",
    question: "셰익스피어의 4대 비극에 속하지 않는 작품은?",
    options: ["햄릿", "오셀로", "로미오와 줄리엣", "맥베스"],
    answer: 2
  },
  {
    id: 39,
    category: "일반상식",
    question: "인터넷 주소 URL에서 'www'의 뜻은?",
    options: ["World Wide Web", "Web World Wide", "Wide World Web", "World Web Wide"],
    answer: 0
  },
  {
    id: 40,
    category: "일반상식",
    question: "빛의 삼원색을 모두 합치면 무슨 색이 되는가?",
    options: ["검정", "회색", "흰색", "노랑"],
    answer: 2
  },
  {
    id: 41,
    category: "한국사",
    difficulty: "중",
    question: "고구려를 건국한 인물은 누구인가?",
    options: ["주몽", "온조", "박혁거세", "김수로"],
    answer: 0
  },
  {
    id: 42,
    category: "지리",
    difficulty: "상",
    question: "세계에서 가장 깊은 호수는?",
    options: ["카스피해", "슈피리어호", "바이칼호", "빅토리아호"],
    answer: 2
  },
];
