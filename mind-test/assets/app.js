/* 시험 중 나는..? — 시험장 놈놈놈 테스트
   8유형 · 10문항 · 9:16 결과 카드 · 기기 내 누적 랭킹 · 1:1 케미 · 사운드 */
(function () {
  'use strict';

  var SITE = 'https://handobin9782-lang.github.io/mind-test/';
  var STORE_KEY = 'mindtest.v1';
  var SOUND_KEY = 'mindtest.sound';

  /* ── 8가지 유형 ───────────────────────────── */
  var TYPES = {
    ai: {
      emoji: '🕶️', label: 'AI 안경',
      name: 'AI 안경 몰래 끼고 답 베끼는 놈',
      tagline: '요령 · 최신 기술 풀세팅러',
      quirk: '안경 각도만 계속 만진다',
      accent: '#6b4bf6', tint: '#efeaff', img: 'assets/type-ai.webp?v=2',
      desc: [
        '공부는 안 했는데 세팅은 끝냈다. 렌즈 닦고, 배터리 100% 확인하고, 카메라 각도까지 리허설해 왔다.',
        '시험지가 펼쳐지면 손보다 목이 먼저 움직인다. 사방 정찰 3초, 그다음 렌즈가 답을 띄운다. 문제를 읽는 시간보다 안경 각도를 만지는 시간이 길다.',
        '현실에서도 이 사람은 "준비는 완벽, 실행은 도구에 위임" 타입이다. 앱은 다 깔려 있고 계획표는 예쁜데, 정작 시작은 안 했다.',
        '머리가 나빠서가 아니다. 가장 짧은 길을 찾는 감각이 비정상적으로 좋다. 다만 그 길이 늘 남의 힘을 빌린 길이라는 게 문제다.',
        '도구가 꺼지는 순간 제일 먼저 어리둥절해지는 사람도 이 사람이다. 안경 배터리는 늘 100%, 실력 배터리는 늘 3%.'
      ],
      card: ['공부는 안 했는데 세팅은 완벽.', '도구가 꺼지면 제일 먼저 어리둥절.'],
      facts: [
        '공부했냐고 물으면 "준비했어"라고 답한다. 그 둘의 차이를 제일 잘 아는 사람이 이 사람이다.',
        '잘되면 내 실력, 망하면 도구 탓. 근데 그 도구도 당신이 돈 주고 산 거다.',
        '시험이 끝나면 머리에 남은 건 없다. 안경엔 다 있는데 배터리가 3%라서 아무것도 못 꺼낸다.'
      ],
      aiLine: '렌즈에 "정답입니다"가 뜨는 순간, 렌즈 옆 카메라의 초록불이 켜진다. 그 불빛을 감독관이 먼저 봤고, 배터리 3% 경고음까지 겹쳐 울린다. 시험은 끝나고, 안경은 압수되고, 집에 전화가 간다.',
      fantasy: 'guess', nemesis: 'honest'
    },
    sleep: {
      emoji: '😴', label: '꿀잠',
      name: '시험 10분 만에 꿀잠 자는 놈',
      tagline: '멘탈 초연 · 낭만 직진러',
      quirk: '10분 만에 엎드려 잔다',
      accent: '#0d9488', tint: '#e3f7f2', img: 'assets/type-sleep.webp',
      desc: [
        '시험지가 인생 전부는 아니라는 걸 몸으로 증명한다. 이름 쓰고 10분, 그다음은 국가대표급 엎드리기다.',
        '감독관이 깨우면 "다 풀었어요"라고 말한다. 백지인데. 종이 울리면 시험장에서 제일 개운한 얼굴로 일어난다.',
        '현실에서도 이 사람은 "안 해도 되는 이유를 열 개 준비해 오는" 타입이다. 긴장이라는 단어는 사전에서만 봤고, 마감은 늘 남의 일처럼 느껴진다.',
        '그런데 이 사람이 진짜로 안 무너지는 건 사실이다. 남들이 밤새 흔들릴 때 얘는 잘 자고, 다음 날 제일 멀쩡하다.',
        '인생은 길고 시험은 짧다. 이 사람은 그걸 아주 일찍 깨달았고, 그래서 남들보다 편하게 산다.'
      ],
      card: ['시험 10분 만에 꿀잠.', '깨어나면 이미 종이 울려 있다.'],
      facts: [
        '잠결에 들은 3번 문제 답은 기억한다. 그것도 틀렸다.',
        '"이번엔 진짜 못 봤어"를 세 번 말하면, 세 번째부터는 자기도 믿는다.',
        '시험장에서 제일 건강한 사람. 스트레스가 없어서가 아니라, 안 받기로 결정해서다.'
      ],
      aiLine: 'AI 안경을 써도 3분이면 잠든다. 렌즈에 정답이 떠 있는 걸 아무도 못 본다. 다만 코고는 소리가 4번 문제까지 들린다.',
      fantasy: 'watch', nemesis: 'deepfocus'
    },
    honest: {
      emoji: '✍️', label: '땀뻘뻘',
      name: '정직하게 땀 뻘뻘 열심히 푸는 놈',
      tagline: '노력파 · 뚝심의 정석',
      quirk: '땀 흘리며 뭐라도 쓴다',
      accent: '#e8590c', tint: '#ffece0', img: 'assets/type-honest.webp',
      desc: [
        '모르는 문제도 일단 뭐라도 쓴다. 빈칸이 세상에서 제일 무섭고, 부분점수에 인생을 건다.',
        '손에 땀이 차서 연필이 미끄러지고, 그래서 2B를 네 자루 챙겨 온다. 화장실 갈 시간이 아까워서 물도 안 마신다.',
        '현실에서도 이 사람은 "제일 열심히 하는데 제일 억울한" 타입이다. 새벽 2시까지 봤는데 10시에 잔 친구가 더 잘 본다. 세상은 원래 불공평하고, 이 사람은 그걸 제일 잘 안다.',
        '대신 이 사람은 배신을 안 한다. 맡은 일은 끝까지 하고, 남의 노력도 알아본다. 결정적인 순간에 손을 잡아 주는 사람은 늘 이 사람이다.',
        'AI 안경 얘기가 나오면 진심으로 화낸다. "그거 부정행위야"라는 말에 인생이 담겨 있다.'
      ],
      card: ['모르는 문제도 일단 뭐라도 쓴다.', '빈칸이 세상에서 제일 무섭다.'],
      facts: [
        '옆에서 종이 넘어가는 소리만 들어도 심장이 빨라진다. 이기는 법은 "한 장 더 쓰는 것"뿐이라고 믿는다.',
        '문제를 세 번 읽는다. 시간이 없어서 세 번째는 못 읽지만.',
        '제일 많이 공부하고 제일 많이 틀린다. 억울하지만 다음 시험에도 또 이렇게 한다.'
      ],
      aiLine: 'AI 안경을 끼고도 스스로 풀려고 한다. 결국 안경을 벗고 손으로 풀고, 안경 배터리만 떨어진다. 이게 정직의 낭비다.',
      fantasy: 'deepfocus', nemesis: 'ai'
    },
    guess: {
      emoji: '🧠', label: '찍기',
      name: '아는 거 없는데 끝까지 머리 굴려 찍는 놈',
      tagline: '촉 · 임기응변 만렙러',
      quirk: '끝까지 찍어 본다',
      accent: '#d6336c', tint: '#ffe9f1', img: 'assets/type-guess.webp',
      desc: [
        '답은 모르지만 C가 연속 두 번 안 나온 건 안다. 선택지가 네 개면 "가운데가 답"이라는 신념도 확고하다.',
        '1번부터 10번까지 다 풀었다. 전부 찍었는데 필기구 색만 진짜다. 찍을 때만큼은 진심이라, 답안지에 옮겨 적으며 한 번 더 확인한다.',
        '현실에서도 이 사람은 "정보가 없어도 일단 고르고 보는" 타입이다. 메뉴판 앞에서 오래 고민하지 않고, 대신 고른 뒤에 후회를 잘 안 한다.',
        '정확도는 반반인데 추진력은 상위 1%다. 남들이 검색하는 동안 이 사람은 이미 출발해 있다.',
        '문제는 가끔 그 촉이 아주 잘 맞는다는 것. 그래서 다음에도 또 찍는다.'
      ],
      card: ['답은 모르지만 C가 연속 두 번', '안 나온 건 안다.'],
      facts: [
        '답을 맞춰 보면 두 개는 맞았다. 아는 문제보다 잘 찍었다.',
        '문제에 나온 단어와 제일 비슷하게 생긴 선택지를 고른다. 그게 은근히 맞는다.',
        '"왜 그렇게 골랐어?"라고 물으면 "느낌"이라고 답한다. 그 느낌을 설명 못 하는 게 더 무섭다.'
      ],
      aiLine: 'AI 안경이 정답을 다 알려줘도 못 믿어서 다섯 개를 지우고 다시 찍는다. 촉은 안경도 못 이긴다.',
      fantasy: 'ai', nemesis: 'escape'
    },
    escape: {
      emoji: '🏃', label: '탈주',
      name: '다 풀었든 말든 제일 먼저 나가버리는 놈',
      tagline: '스피드 · 탈주러',
      quirk: '40분 만에 나가 버린다',
      accent: '#f59f00', tint: '#fff3d6', img: 'assets/type-escape.webp',
      desc: [
        '시험은 100분, 이 사람의 인내심은 40분. 시작 30분 만에 손을 들고, 감독관이 "벌써요?"라고 묻는다.',
        '책가방은 이미 어깨에 걸려 있다. 다 푼 게 아니라 "더 앉아 있어 봤자"를 계산한 결과다. 문을 나서는 그 개운함이 이 시험의 유일한 보상이다.',
        '현실에서도 이 사람은 "끝을 빨리 보고 싶어서 중간을 건너뛰는" 타입이다. 회의는 10분 만에 결론을 내고, 드라마는 마지막 회를 먼저 본다.',
        '결정이 빠른 대신 확인을 안 한다. 집에 와서 답을 맞춰 보면 아직 안 푼 문제가 있다는 걸 알게 된다.',
        '그래도 이 사람은 후회를 오래 하지 않는다. 나온 문은 다시 안 본다. 그게 장점이자 전부다.'
      ],
      card: ['시험은 100분,', '내 인내심은 40분.'],
      facts: [
        '화장실을 두 번 갔다 오는 사이 나머지 절반을 포기했다.',
        '아직 앉아 있는 사람들이 신기하다. 왜 저러지?',
        '빨리 나온 걸 후회한 적은 없는데, 결과를 본 뒤에 조용해지는 일은 자주 있다.'
      ],
      aiLine: 'AI 안경을 쓰면 10분 만에 다 풀고 나간다. 그리고 로비에서 안경으로 정답을 확인하고, 지하철에서 인생을 반성한다.',
      fantasy: 'omr', nemesis: 'guess'
    },
    deepfocus: {
      emoji: '🔍', label: '과몰입',
      name: '지우개 가루 산 쌓고 한 문제에 목숨 거는 놈',
      tagline: '과몰입러 · 집요함의 화신',
      quirk: '한 문제에 목숨을 건다',
      accent: '#2f9e44', tint: '#e7f7e4', img: 'assets/type-deepfocus.webp',
      desc: [
        '10점짜리 한 문제에 40분을 쓴다. 지우개를 갈고 또 갈아서 책상엔 가루로 작은 눈산이 쌓인다.',
        '"이거 분명히 수업 시간에 했는데"를 30분 동안 되새긴다. 풀리면 인생이 열릴 것 같고, 안 풀리면 인생이 닫힌 것 같다.',
        '현실에서도 이 사람은 "완벽주의가 앞부분에서 시간을 다 태우는" 타입이다. 첫 문단을 세 번 고치고, 나머지 반은 손도 못 댄다.',
        '집요함은 무기다. 대신 우선순위가 없다. 중요한 것과 재미있는 것을 구분하지 못하는 게 이 사람의 유일한 약점이다.',
        '결국 그 한 문제는 틀리고 나머지는 아예 못 본다. 그리고 다음 시험에도 또 그 한 문제부터 붙잡는다.'
      ],
      card: ['10점짜리 한 문제에 40분.', '지우개 가루로 눈이 내린다.'],
      facts: [
        '한 문제에서 시계를 마흔 번 넘게 본다. 그 시간이 아깝다는 걸 알면서도 못 넘어간다.',
        '끝까지 앉아 있는데도 시간이 부족하다. 이상하지? 이해가 안 돼서 그렇다.',
        '"다음 문제로 넘어가세요"라는 감독관의 말이 제일 무섭다. 그 말이 맞는 걸 본인도 안다.'
      ],
      aiLine: 'AI 안경을 쓰면 그 문제를 3초에 푼다. 그리고 그 3초 동안 "이래도 되나" 하는 인생 최고의 회의를 한다.',
      fantasy: 'honest', nemesis: 'sleep'
    },
    watch: {
      emoji: '👀', label: '옆자리',
      name: '옆자리 책장 넘기는 소리에 멘탈 나가는 놈',
      tagline: '주변 의식 · 예민러',
      quirk: '옆자리 책장 소리에 심장이 내려앉는다',
      accent: '#2563eb', tint: '#e6efff', img: 'assets/type-watch.webp',
      desc: [
        '문제보다 옆자리 책장 넘기는 소리가 더 크게 들린다. 내 1장과 옆의 3장, 이게 인생 차이처럼 느껴진다.',
        '문제는 네 개밖에 못 풀었는데 옆자리가 몇 장 넘겼는지는 정확히 기억한다. 옆자리가 펜을 놓는 순간 심장이 내려앉는다.',
        '현실에서도 이 사람은 "남의 속도로 내 하루를 채점하는" 타입이다. 친구가 올린 사진 한 장에 내 주말이 초라해지고, 남이 잘되면 축하와 함께 조용한 상처가 온다.',
        '나쁜 사람이 아니다. 그만큼 눈치가 빠르고 남의 기분을 먼저 읽는다. 회의실 분위기를 제일 먼저 알아채는 사람도 이 사람이다.',
        '다만 그 안테나가 자기한테만 너무 예민하다. 남의 3장을 세는 동안 내 1장은 안 늘어난다.'
      ],
      card: ['문제보다 옆자리 책장 소리가', '더 크게 들린다.'],
      facts: [
        '필기구 소리만 들어도 "나는 늦었다"는 결론이 3초 만에 나온다.',
        '귀마개를 챙겨 오겠다고 다짐하고, 다음 시험에도 안 챙긴다. 그런데 옆자리 소리는 여전히 다 들린다.',
        '시험이 끝나고 옆자리 점수를 물어본다. 묻고 나서 더 속상해진다.'
      ],
      aiLine: 'AI 안경을 쓰면 소리는 안 들릴지 몰라도, 옆자리가 안경을 안 썼다는 사실이 더 신경 쓰인다. 결국 세 문제 남기고 비교를 시작한다.',
      fantasy: 'sleep', nemesis: 'omr'
    },
    omr: {
      emoji: '🫠', label: 'OMR',
      name: '종료 3분 전 OMR 밀려 써서 식은땀 흘리는 놈',
      tagline: '막판 대참사러',
      quirk: '마지막 3분에 OMR을 밀려 쓴다',
      accent: '#e0362f', tint: '#ffe8e6', img: 'assets/type-omr.webp',
      desc: [
        '답은 다 알았는데 마킹을 안 했다. 문제 옆에 동그라미는 쳐 놨는데 OMR은 백지다. 이건 재능이다.',
        '종료 3분 전부터 손이 떨려서 5번 답을 6번 칸에 쓴다. 고친 자국이 다섯 군데, 지우개는 공중에 떠 있다.',
        '현실에서도 이 사람은 "마무리를 마지막 순간에 몰아서 하는" 타입이다. 준비물은 다 있는데 제출 버튼을 제일 마지막에 누른다.',
        '실력이 없어서가 아니다. 아는 문제를 아는 순간에 안 적어서 잃는 사람이다. 이건 머리 문제가 아니라 순서 문제다.',
        '제일 억울한 유형 1위. 다 아는 시험인데 결과는 늘 이상하게 낮다.'
      ],
      card: ['답은 다 알았는데 마킹을 안 했다.', '종료 3분 전, 손이 두 개였으면.'],
      facts: [
        '문제를 풀 때 OMR에 옮기는 습관이 없다. "나중에 한꺼번에"가 인생 모토다.',
        '3분 남았는데 남은 칸이 열두 개. 손이 두 개였으면 좋겠다.',
        '결과가 이상하게 낮다. 다 아는 문제였는데. 이유는 본인이 제일 잘 안다.'
      ],
      aiLine: 'AI 안경이 정답을 다 띄워 줘도 마킹은 직접 해야 한다. 안경이 "3분 남았습니다"를 세 번이나 알려 줬는데.',
      fantasy: 'escape', nemesis: 'watch'
    }
  };
  var ORDER = ['ai', 'sleep', 'honest', 'guess', 'escape', 'deepfocus', 'watch', 'omr'];

  /* ── 제휴 상품 (쿠팡 파트너스) ───────────────
     url 에 파트너스 링크를 넣으면 그 즉시 구매 카드로 활성화됩니다.
     빈 문자열이면 '준비 중' 상태로 안전하게 표시됩니다. */
  var AFFILIATE_ITEMS = {
    ai:        { name: '블루라이트 차단 안경 (베델루스 뿔테)', desc: '렌즈 반사광은 줄이고 눈은 지키는 기본템', url: 'https://link.coupang.com/a/iL2Wt3Soay' },
    sleep:     { name: '3D 암막 수면안대 (빅트리 프리미엄)', desc: '10분 꿀잠의 완성은 빛 차단', url: 'https://link.coupang.com/a/iL1KHZ3jC8' },
    honest:    { name: '고탄력 통기성 손목보호대 2P', desc: '손목이 저려도 연필은 놓지 못하니까', url: 'https://link.coupang.com/a/iL2YTn6Uoe' },
    guess:     { name: '컬러 아크릴 미니 주사위 50개입', desc: '촉은 실력이 아니라 기분에서 온다', url: 'https://link.coupang.com/a/iL22LXSDG8' },
    escape:    { name: '거실 구름 실내화 슬리퍼', desc: '40분 만에 나갈 몸에 운동화 끈은 번거롭다', url: 'https://link.coupang.com/a/iL25RPizEO' },
    deepfocus: { name: '펜텔 아인 점보 지우개 특대형 2개', desc: '가루 산을 만들 만큼 넉넉하게', url: 'https://link.coupang.com/a/iL29DZgAmq' },
    watch:     { name: '굿나잇 이어플러그 프리미엄 15쌍', desc: '옆자리 책장 소리를 물리치는 유일한 방법', url: 'https://link.coupang.com/a/iL3bUS7ttY' },
    omr:       { name: '컴퓨터용 사인펜 + 수정테이프 세트', desc: '마지막 3분을 살리는 최소 장비', url: 'https://link.coupang.com/a/iL3efXwP6q' }
  };

  /* 짧은 표기 (케미 카드 등 좁은 자리) */
  var SHORT = {
    ai: 'AI 안경 끼고 베끼는 놈',
    sleep: '10분 만에 꿀잠 자는 놈',
    honest: '땀 뻘뻘 정직한 놈',
    guess: '머리 굴려 찍는 놈',
    escape: '제일 먼저 나가는 놈',
    deepfocus: '한 문제에 목숨 거는 놈',
    watch: '옆자리 소리에 예민한 놈',
    omr: 'OMR 밀려 쓰는 놈'
  };

  /* ── 10문항 (교시 · 영역) ─────────────────── */
  var QUESTIONS = [
    {
      tag: '시험 전날 밤', area: '준비 영역', img: 'assets/type-sleep.webp', accent: '#6b4bf6', label: 'D-1 · 23:00',
      q: '시험 전날 밤, 나는?',
      opts: [
        { k: 'ai', t: 'AI 안경 충전부터 한다. 렌즈 닦고 배터리 100% 확인.' },
        { k: 'honest', t: '기출 3년치를 훑다가 새벽 2시. 그리고 다 못 봤다.' },
        { k: 'sleep', t: '"내일은 내일의 내가 잘할 거야" 하고 11시 취침.' },
        { k: 'watch', t: '옆자리 걔는 뭐 하고 있나 카톡 프로필부터 확인한다. 나만 안 한 것 같아서.' }
      ]
    },
    {
      tag: '시험지 받는 순간', area: '초조 영역', img: 'assets/type-honest.webp', accent: '#e8590c', label: '09:00 · 1교시',
      q: '감독관이 "시험지 펼치세요"라고 말했다. 그때 나는?',
      opts: [
        { k: 'deepfocus', t: '제일 어려워 보이는 문제부터 찾아 표시해 둔다.' },
        { k: 'guess', t: '1번부터 10번까지 훑고 "몇 개나 찍을지" 계산한다.' },
        { k: 'watch', t: '옆자리 시험지 펼치는 속도부터 확인한다.' },
        { k: 'sleep', t: '이름 쓰고 10분 뒤엔 이미 엎드려 자고 있다. 시험은 이제 시작됐다.' }
      ]
    },
    {
      tag: '모르는 문제', area: '위기 영역', img: 'assets/type-guess.webp', accent: '#d6336c', label: 'CASE 03 · 막힘',
      q: '모르는 문제를 만났다. 그 순간 나는?',
      opts: [
        { k: 'honest', t: '일단 뭐라도 쓴다. 빈칸은 죄악이다.' },
        { k: 'guess', t: '선택지를 세 번 읽고, 제일 낯익은 걸 고른다.' },
        { k: 'ai', t: '안경을 살짝 만지고 시선을 아래로 내린다.' },
        { k: 'omr', t: '일단 표시만 해두고 나중에 OMR에 옮긴다.' }
      ]
    },
    {
      tag: '감독관과 눈 마주침', area: '심장 영역', img: 'assets/cover.webp?v=3', accent: '#2563eb', label: 'CASE 04 · 접촉',
      q: '감독관과 눈이 마주쳤다. 나는?',
      opts: [
        { k: 'watch', t: '심장이 내려앉아서 30초 동안 문제에 집중하는 척한다.' },
        { k: 'honest', t: '오히려 정면으로 마주본다. 잘못한 게 없으니까.' },
        { k: 'ai', t: '아무 일 없던 것처럼 미소 짓고 고개를 끄덕인다.' },
        { k: 'escape', t: '눈 마주친 김에 "화장실 가도 돼요?"라고 묻는다.' }
      ]
    },
    {
      tag: 'AI 안경의 유혹 · 배터리 100%', area: '양심 영역', img: 'assets/type-ai.webp?v=2', accent: '#16a34a', label: 'CASE 05 · 유혹',
      q: '책상 위에 AI 안경이 딱 놓여 있다. 집어 들면 렌즈 옆 카메라에 초록불이 켜지고, 쓰는 순간 정답이 스르륵 떠오를 게 뻔하다. 배터리 100%.',
      opts: [
        { k: 'ai', t: '이건 하늘의 계시다. 렌즈에 답 뜨는 순간까지만 쓰자.' },
        { k: 'honest', t: '부정행위다. 절대 안 쓴다. 손으로 푼다.' },
        { k: 'sleep', t: '안경은 무슨. 일단 10분만 눈 붙이자.' },
        { k: 'deepfocus', t: '안경은 됐고 이 문제 하나만 더 붙잡자.' }
      ]
    },
    {
      tag: '시간 절반', area: '시간 영역', img: 'assets/type-omr.webp', accent: '#e0362f', label: 'CASE 06 · 50분',
      q: '시험 시간 절반이 지났는데 문제도 절반 남았다.',
      opts: [
        { k: 'honest', t: '속도 올린다. 아는 문제부터 정확하게, 모르는 건 일단 뭐라도 채우고 넘어간다.' },
        { k: 'guess', t: '남은 문제는 다 찍는다. 대신 각오를 담아서.' },
        { k: 'escape', t: '"이쯤이면 그냥 나가는 게 낫지 않나"를 열 번째 계산한다.' },
        { k: 'omr', t: '"아, OMR 아직 안 썼다"를 이때 깨닫는다.' }
      ]
    },
    {
      tag: '옆자리의 답안지', area: '우정 영역', img: 'assets/type-watch.webp', accent: '#0d9488', label: 'CASE 07 · 밀당',
      q: '옆자리 친구가 답안지를 살짝 밀어줬다.',
      opts: [
        { k: 'honest', t: '고맙지만 안 본다. 이건 내 시험이니까.' },
        { k: 'ai', t: '0.5초만 본다. 그러다 결국 남은 문제도 다 본다.' },
        { k: 'watch', t: '보기도 전에 "쟤는 다 풀었구나"로 상처받는다.' },
        { k: 'deepfocus', t: '지금 이 문제에 집중하느라 못 봤다.' }
      ]
    },
    {
      tag: '시험 끝', area: '자기합리화 영역', img: 'assets/type-escape.webp', pos: 'center 8%', accent: '#f59f00', label: 'CASE 08 · 종료',
      q: '시험 끝. 복도로 나서는데 친구가 "몇 개 찍었어?"라고 묻는다.',
      opts: [
        { k: 'guess', t: '다 찍었어. 그래도 두 개는 맞은 것 같아.' },
        { k: 'escape', t: '몰라, 나 40분 만에 나왔어. 그때 이미 내 시험은 끝났지.' },
        { k: 'watch', t: '"몇 개 찍긴. 너는 몇 개 맞았어?" 하고 먼저 되묻는다.' },
        { k: 'omr', t: '"나 8번 OMR 칸 비웠을지도 몰라..." 이미 낸 답안지가 자꾸 떠오른다.' }
      ]
    },
    {
      tag: '시험 3일 전', area: '환경 영역', img: 'assets/type-deepfocus.webp', accent: '#2f9e44', label: 'D-3 · 책상',
      q: '시험 3일 전, 내 방 책상은?',
      opts: [
        { k: 'honest', t: '기출 프린트, 형광펜 6색, 스탬플러까지 완벽 정리.' },
        { k: 'ai', t: '충전기 꽂힌 AI 안경. 케이블 정리까지 끝났다.' },
        { k: 'sleep', t: '이불. 그 위에 노트북. 노트북엔 유튜브.' },
        { k: 'omr', t: 'OMR 연습지는 한 장도 없다. 답 옮기는 연습은 한 번도 안 해봤다.' }
      ]
    },
    {
      tag: '한 문장', area: '총평 영역', img: 'assets/cover.webp?v=3', accent: '#6b4bf6', label: 'FIN · 정리',
      q: '이번 시험, 한 문장으로 정리하면?',
      opts: [
        { k: 'guess', t: '"촉이 좋았던 날이었다."' },
        { k: 'deepfocus', t: '"한 문제만 더 붙잡았으면."' },
        { k: 'escape', t: '"빨리 나온 건 후회 없다."' },
        { k: 'sleep', t: '"잘 잤다."' }
      ]
    }
  ];

  /* ── 기기 내 누적 랭킹 시드 ───────────────── */
  var SEED = { ai: 1521, sleep: 1033, honest: 1402, guess: 1188, escape: 744, deepfocus: 691, watch: 862, omr: 577 };

  /* ── 케미 ────────────────────────────────────
     8가지 짝(환상 4 · 상극 4)을 한 곳에서 정의해
     결과 카드의 짝꿍/상극 설명과 1:1 케미 문구가 같은 논리로 말해지게 한다. */
  var PAIRS = {
    'ai|guess': {
      s: 96, t: '환상의 조합 · 안경과 촉',
      why: [
        '한 명은 안경으로 정답을 띄우고, 한 명은 그 정답이 못 믿어서 다시 찍는다. 그런데 둘 다 맞힌다.',
        '정보를 믿는 놈과 자기 촉을 믿는 놈이 서로를 검증해 주니 틀릴 구멍이 없다. 문제는 시험이 끝나면 둘 다 아무것도 기억하지 못한다는 것.'
      ]
    },
    'deepfocus|honest': {
      s: 86, t: '뚝심 콤비',
      why: [
        '한 명은 한 문제를 40분 붙잡고, 한 명은 열 문제를 다 붙잡는다. 방식은 정반대인데 "끝까지 앉아 있다"는 결론만 같다.',
        '둘 다 시간이 부족해서 결과는 아쉽지만, 서로의 뚝심을 유일하게 알아봐 주는 사이. 끝나고 둘 다 말없이 지우개를 턴다.'
      ]
    },
    'escape|omr': {
      s: 78, t: '먼저 나간 자와 남은 자',
      why: [
        '먼저 나가는 놈이 40분에 교실을 뜨면, 마킹을 미루던 놈은 그 빈자리를 보며 "나도 저러고 싶다"를 참는다. 그 참음이 마킹을 더 미루게 만든다.',
        '그래서 한 명은 로비에서 기다리고, 한 명은 종료 3분 전에 OMR을 밀려 쓴다. 만나면 아무것도 안 묻고 아이스크림을 사 준다.'
      ]
    },
    'sleep|watch': {
      s: 92, t: '조용한 위로',
      why: [
        '옆자리가 조용히 자고 있으면 소리에 예민한 놈은 오히려 마음이 놓인다. 책장 소리도, 펜 소리도, 한숨도 안 나기 때문이다.',
        '자는 쪽은 아무것도 안 해도 남의 멘탈을 지켜 주고, 예민한 쪽은 그 덕에 겨우 문제를 푼다. 서로에게 최고의 이웃.'
      ]
    },
    'ai|honest': {
      s: 21, t: '최악의 상극 · 안경과 팔',
      why: [
        '안경 쓴 놈은 옆의 답이 보여야 하고, 정직한 놈은 팔로 답안지를 가린다. 한 명의 생존 조건이 다른 한 명의 방해물이다.',
        '게다가 정직한 놈은 "그거 부정행위야"를 진심으로 말한다. 앞뒤 자리에 앉으면 안경은 잡히고 팔은 뻐근하고, 둘 다 망한다.'
      ],
      fail: '안경은 압수되고, 팔은 저리고, 정직한 놈은 그날 제일 분노한 채로 시험을 끝낸다.'
    },
    'deepfocus|sleep': {
      s: 18, t: '최악의 상극 · 지우개와 코고는 소리',
      why: [
        '한 명은 한 문제에 목숨을 걸고 지우개를 갈고, 한 명은 그 옆에서 10분 만에 잠든다.',
        '지우개 가는 소리는 잠을 깨우고, 코고는 소리는 집중을 부순다. 깨운 쪽은 왜 화내는지 모르고, 깨운 쪽은 억울하다.'
      ],
      fail: '한 명은 그 문제를 영원히 못 풀고, 한 명은 4번 문제를 꿈에서 본다. 둘 다 그날 시험을 잃는다.'
    },
    'escape|guess': {
      s: 26, t: '최악의 상극 · 촉과 탈주',
      why: [
        '찍는 놈은 답을 고르는 데 10초가 걸리고, 나가는 놈은 그 10초를 못 기다린다. 가방 메고 일어나는 소리만 들어도 촉이 흔들린다.',
        '결국 찍던 놈도 "나도 나가"를 외치고 같이 나간다. 둘 다 답을 모른 채 복도에 서 있다.'
      ],
      fail: '남은 답은 안 찍히고 시험은 두 사람을 이긴다. 복도에서 "너 몇 개 찍었어?"도 못 묻는다.'
    },
    'omr|watch': {
      s: 24, t: '최악의 상극 · 소리와 식은땀',
      why: [
        '마킹을 미룬 놈은 종료 3분 전에 펜을 부러질 듯 갈기고, 예민한 놈은 그 소리에 심장이 내려앉아 손이 멈춘다.',
        '옆자리는 소리에 다섯 번 놀라고, 마킹하는 놈은 옆자리가 멈춘 걸 눈치채지 못한다. 둘 다 마지막 3분을 서로에게 빼앗긴다.'
      ],
      fail: '한 명은 8번 칸을 비우고, 한 명은 3번 문제에서 손이 굳는다. 둘 다 종이 울릴 때 같은 얼굴이다.'
    }
  };

  /* ── 같은 유형끼리 (1:1 케미) ───────────────── */
  var CHEMI_SAME = {
    ai: [84, '같은 안경 두 개', [
      '같은 안경 두 개를 쓰면 렌즈에 같은 정답이 뜬다. 문제는 둘이 그걸 확인하느라 서로의 렌즈를 보다가 자기 문제를 안 푼다.',
      '결국 둘 다 감독관에게 잡히고, 집에 가는 길에 "다음엔 다른 안경 쓰자"고 진지하게 상의한다.'
    ]],
    sleep: [88, '쌍둥이 꿀잠', [
      '둘이 동시에 엎드리면 시험장에 코고는 소리가 두 겹으로 깔린다. 감독관이 깨우면 둘 다 "다 풀었어요"라고 말한다.',
      '둘 다 백지인 걸 서로가 확인해 주는데, 그게 왜인지 위로가 된다.'
    ]],
    honest: [80, '정직한 동지', [
      '둘 다 손에 땀이 차서 연필이 계속 미끄러지고, 둘 다 부분점수를 노린다. 서로의 답안지를 보면 "나만 이렇게 쓴 게 아니구나" 싶다.',
      '시험이 끝나고 답을 맞춰 보면 둘 다 조용해진다. 서로에게 먼저 미안하다고 말한다.'
    ]],
    guess: [86, '찍기의 성지', [
      '둘 다 C를 찍고, 둘 다 답이 다르게 나와서 동시에 조용해진다. 누가 맞았는지 확인하는 순간이 제일 무섭다.',
      '그런데 둘 다 두 개씩은 맞았다. 촉이 통한 게 아니라 문제가 이상했던 거다.'
    ]],
    escape: [90, '탈주 콤비', [
      '둘 다 40분에 나가서 로비에서 마주친다. "너도?" "어." 그 한 마디로 우정이 완성된다.',
      '편의점 아이스크림을 들고 인생을 논한다. 둘 다 망했지만 그날의 하이라이트는 그 복도였다.'
    ]],
    deepfocus: [74, '과몰입 부부', [
      '둘 다 같은 문제에 목숨을 걸고, 서로 지우개를 빌려 갈아 쓴다. 지우개 가루가 책상에 눈처럼 쌓인다.',
      '시험이 끝나도 둘 다 안 일어난다. 그 문제가 아직 안 풀렸기 때문이다. 결국 둘 다 그 문제만 틀린다.'
    ]],
    watch: [70, '예민 듀오', [
      '둘이 서로의 책장 소리에 예민해진다. 한 명이 넘기면 다른 한 명이 힐끗 보고, 그게 신경 쓰여 또 넘긴다.',
      '결국 서로가 서로의 소음원이 되어 둘 다 세 문제만 풀고 나온다. 집에 가서 서로에게 미안하다고 문자한다.'
    ]],
    omr: [66, 'OMR 참사', [
      '둘 다 마킹을 미루는 게 인생 모토라, 종료 3분 전에 동시에 펜을 잡는다. 그리고 동시에 5번 답을 6번 칸에 쓴다.',
      '감독관이 오면 둘 다 "이거 원래 이래요"라고 말한다. 아무도 안 믿는다.'
    ]]
  };

  function pairKey(a, b) { return a < b ? a + '|' + b : b + '|' + a; }
  function pairInfo(a, b) { return PAIRS[pairKey(a, b)] || null; }

  var NEUTRAL = [
    [72, '무난한 케미', '서로의 속도가 달라서 오히려 안 부딪힌다. 생각보다 괜찮은 자리.'],
    [58, '묘한 케미', '서로가 서로에게 딱 절반의 방해다. 둘 다 중간에서 끝난다.'],
    [44, '아슬한 케미', '한 명이 겨우 정신 차려야 둘 다 산다. 지금은 둘 다 위험하다.']
  ];

  function chemi(a, b) {
    if (a === b && CHEMI_SAME[a]) return CHEMI_SAME[a];
    var p = pairInfo(a, b);
    if (p) return [p.s, p.t, p.why];
    var bucket = (ORDER.indexOf(a) * 7 + ORDER.indexOf(b) * 13) % 3;
    var n = NEUTRAL[bucket];
    return [n[0], n[1], [
      '한 명은 ' + TYPES[a].quirk + '. 다른 한 명은 ' + TYPES[b].quirk + '.',
      n[2]
    ]];
  }
  /* ── 상태 ─────────────────────────────────── */
  var state = {
    i: 0,
    answers: [],
    result: null,
    view: null,
    preview: false,
    from: null,
    busy: false
  };

  var $ = function (id) { return document.getElementById(id); };
  var root = document.documentElement;

  /* ── 저장소 ───────────────────────────────── */
  function loadStore() {
    var base = { inc: {}, done: 0 };
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return base;
      var p = JSON.parse(raw);
      if (p && p.inc && typeof p.inc === 'object') {
        ORDER.forEach(function (k) { base.inc[k] = Number(p.inc[k]) || 0; });
      }
      base.done = Number(p && p.done) || 0;
    } catch (e) {}
    return base;
  }
  function saveStore(s) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) {}
  }
  function counts(s) {
    var c = {};
    ORDER.forEach(function (k) { c[k] = SEED[k] + (s.inc[k] || 0); });
    return c;
  }
  function totalOf(c) {
    return ORDER.reduce(function (a, k) { return a + c[k]; }, 0);
  }
  function rankMap(c) {
    var sorted = ORDER.slice().sort(function (a, b) { return c[b] - c[a]; });
    var m = {};
    sorted.forEach(function (k, i) { m[k] = i + 1; });
    return m;
  }
  var store = loadStore();

  /* ── 사운드 (Web Audio, 외부 파일 없음) ─────
     초침 소리 없이, 낮은 볼륨의 따뜻한 일렉트릭 피아노 아르페지오와
     잔잔한 앰비언트 패드만 느리게 흐르게 한다. */
  var Sound = (function () {
    var ctx = null, master = null, arpBus = null;
    var arpTimer = null, padTimer = null, padOscs = [], chordIdx = 0, step = 0;
    var enabled = true, started = false;

    /* 느린 4코드 순환 — Cmaj7 · Am7 · Fmaj7 · G6 */
    var CHORDS = [
      [130.81, 164.81, 196.00, 246.94],
      [110.00, 130.81, 164.81, 196.00],
      [87.31, 110.00, 130.81, 174.61],
      [98.00, 123.47, 146.83, 196.00]
    ];
    /* 코드별 아르페지오 음 — 높지 않게, 부드러운 범위 */
    var ARP = [
      [523.25, 659.25, 783.99, 987.77, 783.99, 659.25],
      [440.00, 523.25, 659.25, 783.99, 659.25, 523.25],
      [349.23, 440.00, 523.25, 698.46, 523.25, 440.00],
      [392.00, 493.88, 587.33, 783.99, 587.33, 493.88]
    ];

    try { if (localStorage.getItem(SOUND_KEY) === '0') enabled = false; } catch (e) {}

    function supported() { return !!(window.AudioContext || window.webkitAudioContext); }
    function ensure() {
      if (!supported()) return null;
      if (!ctx) {
        try {
          var AC = window.AudioContext || window.webkitAudioContext;
          ctx = new AC();
          master = ctx.createGain();
          master.gain.value = 0.0001;
          master.connect(ctx.destination);
        } catch (e) { ctx = null; return null; }
      }
      if (ctx.state === 'suspended' && ctx.resume) { try { ctx.resume(); } catch (e) {} }
      return ctx;
    }

    /* 부드러운 사인 톤 (클릭음 등) */
    function tone(freq, dur, type, vol, delay, slideTo) {
      if (!ctx || !master) return;
      try {
        var t0 = ctx.currentTime + (delay || 0);
        var o = ctx.createOscillator(), g = ctx.createGain();
        var lp = ctx.createBiquadFilter();
        lp.type = 'lowpass'; lp.frequency.value = 1800;
        o.type = type || 'sine';
        o.frequency.setValueAtTime(freq, t0);
        if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(vol, t0 + Math.min(0.06, dur * 0.35));
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        o.connect(g); g.connect(lp); lp.connect(master);
        o.start(t0); o.stop(t0 + dur + 0.05);
      } catch (e) {}
    }

    /* 따뜻한 일렉트릭 피아노 한 음 (사인 캐리어 + 감쇠하는 FM 변조) */
    function epNote(freq, vol, dur, delay) {
      if (!ctx || !master) return;
      try {
        var t0 = ctx.currentTime + (delay || 0);
        var car = ctx.createOscillator(), mod = ctx.createOscillator();
        var modGain = ctx.createGain(), g = ctx.createGain();
        var lp = ctx.createBiquadFilter();
        lp.type = 'lowpass'; lp.frequency.value = 2200; lp.Q.value = 0.4;
        car.type = 'sine';
        car.frequency.setValueAtTime(freq, t0);
        mod.type = 'sine';
        mod.frequency.setValueAtTime(freq * 2, t0);
        modGain.gain.setValueAtTime(freq * 0.55, t0);
        modGain.gain.exponentialRampToValueAtTime(freq * 0.04, t0 + dur * 0.6);
        mod.connect(modGain); modGain.connect(car.frequency);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(vol, t0 + 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        car.connect(g); g.connect(lp); lp.connect(arpBus || master);
        car.start(t0); mod.start(t0);
        car.stop(t0 + dur + 0.08); mod.stop(t0 + dur + 0.08);
      } catch (e) {}
    }

    function arpStep() {
      if (!ctx) return;
      var notes = ARP[chordIdx % ARP.length];
      epNote(notes[step % notes.length], 0.026, 2.6, 0);
      step++;
    }

    function startPad() {
      if (!ctx) return;
      try {
        /* 패드 버스 — 낮게 걸러 따뜻하게 */
        var padGain = ctx.createGain();
        padGain.gain.value = 0.022;
        var padLp = ctx.createBiquadFilter();
        padLp.type = 'lowpass'; padLp.frequency.value = 620; padLp.Q.value = 0.5;
        var bus = ctx.createGain(); bus.gain.value = 1;
        padLp.connect(padGain); padGain.connect(master);

        /* 아르페지오 버스 — 살짝만 열어 두어 튀지 않게 */
        arpBus = ctx.createBiquadFilter();
        arpBus.type = 'lowpass'; arpBus.frequency.value = 2000; arpBus.Q.value = 0.5;
        arpBus.connect(bus); bus.connect(master);

        CHORDS[0].forEach(function (f, i) {
          var o = ctx.createOscillator(), g = ctx.createGain();
          o.type = i === 0 ? 'sine' : 'triangle';
          o.frequency.value = f;
          g.gain.value = i === 0 ? 1 : 0.5;
          o.connect(g); g.connect(padLp);
          o.start();
          padOscs.push(o);
        });

        /* 코드는 10초에 한 번, 2.5초에 걸쳐 미끄러지듯 이동 */
        padTimer = setInterval(function () {
          if (!ctx) return;
          chordIdx = (chordIdx + 1) % CHORDS.length;
          var ch = CHORDS[chordIdx];
          padOscs.forEach(function (o, i) {
            try { o.frequency.setTargetAtTime(ch[i], ctx.currentTime, 1.4); } catch (e) {}
          });
        }, 10000);

        /* 아르페지오는 1.25초 간격 — 느린 잔잔한 흐름 */
        arpTimer = setInterval(arpStep, 1250);
        arpStep();
      } catch (e) {}
    }

    function start() {
      if (!ensure()) return;
      if (started) {
        try { master.gain.setTargetAtTime(0.5, ctx.currentTime, 0.4); } catch (e) {}
        return;
      }
      started = true;
      try { master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setTargetAtTime(0.5, ctx.currentTime, 1.1); } catch (e) {}
      startPad();
    }

    function stop() {
      if (arpTimer) { clearInterval(arpTimer); arpTimer = null; }
      if (padTimer) { clearInterval(padTimer); padTimer = null; }
      padOscs.forEach(function (o) { try { o.stop(); } catch (e) {} });
      padOscs = [];
      if (ctx && master) { try { master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.5); } catch (e) {} }
      started = false;
    }

    return {
      isOn: function () { return enabled; },
      setEnabled: function (v) {
        enabled = !!v;
        try { localStorage.setItem(SOUND_KEY, enabled ? '1' : '0'); } catch (e) {}
        if (enabled) start(); else stop();
        return enabled;
      },
      unlock: function () { if (enabled) start(); },
      click: function () {
        if (!enabled || !ctx) return;
        tone(540, 0.18, 'sine', 0.028, 0, 660);
        tone(270, 0.2, 'sine', 0.014, 0.01);
      },
      reveal: function () {
        if (!enabled || !ctx) return;
        [523.25, 659.25, 783.99, 987.77].forEach(function (f, i) {
          epNote(f, 0.045, 1.9, i * 0.16);
        });
        epNote(261.63, 0.03, 3.2, 0.2);
        if (master) {
          try {
            master.gain.setTargetAtTime(0.62, ctx.currentTime, 0.6);
            master.gain.setTargetAtTime(0.5, ctx.currentTime + 2.2, 1.6);
          } catch (e) {}
        }
      }
    };
  })();
  function paintSoundBtn() {
    var on = Sound.isOn();
    $('soundIcon').textContent = on ? '🔊' : '🔇';
    $('btnSound').setAttribute('aria-pressed', on ? 'true' : 'false');
    var txt = $('btnSound').querySelector('.sound-txt');
    if (txt) txt.textContent = on ? '사운드' : '꺼짐';
  }

  /* ── 유틸 ─────────────────────────────────── */
  var toastTimer;
  function toast(msg) {
    var t = $('toast');
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('is-on'); }, 2400);
  }
  function fmt(n) { return Number(n).toLocaleString('ko-KR'); }
  function show(id) {
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) screens[i].classList.remove('is-on');
    var el = $(id);
    if (el) el.classList.add('is-on');
    document.body.classList.toggle('is-quiz', id === 'screen-quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function hexToRgb(h) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
    return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [107, 75, 246];
  }
  function setAccent(hex) {
    root.style.setProperty('--q-accent', hex);
    root.style.setProperty('--q-accent-rgb', hexToRgb(hex).join(','));
  }
  function param(name) {
    var m = new RegExp('[?&]' + name + '=([^&#]*)').exec(location.search);
    return m ? decodeURIComponent(m[1]) : null;
  }

  /* ── 인트로 ───────────────────────────────── */
  function renderTeaser() {
    var ai = TYPES.ai;
    var featured = '<div class="tcard is-feature">' +
      '<img class="tcard-art" src="' + ai.img + '" alt="" width="720" height="720" loading="lazy">' +
      '<span class="tcard-body">' +
        '<span class="tcard-feat-b">대표 유형</span>' +
        '<span class="tcard-txt"><span aria-hidden="true">🕶️</span> ' + ai.name + '</span>' +
        '<span class="tcard-sub">카메라 2개 · 렌즈에 답 뜨는 순간 · 배터리 3% 경고</span>' +
      '</span></div>';
    var rest = ORDER.filter(function (k) { return k !== 'ai'; }).map(function (k) {
      var t = TYPES[k];
      return '<div class="tcard" style="border-color:' + t.accent + '33">' +
        '<span class="tcard-emoji" aria-hidden="true">' + t.emoji + '</span>' +
        '<span class="tcard-txt">' + t.name + '</span></div>';
    }).join('');
    $('teaser').innerHTML = featured + rest;
  }
  function renderPeople() {
    $('peopleTotal').textContent = fmt(totalOf(counts(store)));
  }
  function renderInvite() {
    if (!state.from) return;
    var t = TYPES[state.from];
    if (!t) return;
    $('inviteName').textContent = t.emoji + ' ' + t.name;
    $('invite').hidden = false;
  }

  /* ── 랭킹 ─────────────────────────────────── */
  function renderRanking() {
    var c = counts(store);
    var total = totalOf(c);
    var sorted = ORDER.slice().sort(function (a, b) { return c[b] - c[a] || ORDER.indexOf(a) - ORDER.indexOf(b); });
    var top = sorted[0], topT = TYPES[top];

    ['', '2'].forEach(function (sfx) {
      var img = $('rankImg' + sfx);
      if (!img) return;
      if (img.getAttribute('data-key') !== top) {
        img.classList.add('is-fading');
        setTimeout(function () {
          img.src = topT.img;
          img.alt = topT.name;
          img.setAttribute('data-key', top);
          img.classList.remove('is-fading');
        }, 160);
      }
      $('rankName' + sfx).textContent = topT.emoji + ' ' + topT.name;
      $('rankCount' + sfx).innerHTML = '<b>' + fmt(c[top]) + '표</b> · ' + (c[top] / total * 100).toFixed(1) + '%';
      $('rankTotal' + sfx).textContent = fmt(total);

      var barsBox = $('rankBars' + sfx);
      var max = c[sorted[0]];
      barsBox.innerHTML = sorted.map(function (k, i) {
        var t = TYPES[k];
        var mine = state.result && state.result.key === k;
        var w = Math.max(2, Math.round(c[k] / max * 100));
        return '<div class="rbar' + (i === 0 ? ' is-top' : '') + (mine ? ' is-mine' : '') + '">' +
          '<span class="rbar-rk">' + (i + 1) + '</span>' +
          '<span class="rbar-nm">' + t.emoji + ' ' + t.label + (mine ? ' · 나' : '') + '</span>' +
          '<span class="rbar-tr"><i data-w="' + w + '"></i></span>' +
          '<span class="rbar-vl">' + fmt(c[k]) + '명 · ' + (c[k] / total * 100).toFixed(1) + '%</span>' +
          '</div>';
      }).join('');
      requestAnimationFrame(function () {
        var fills = barsBox.querySelectorAll('.rbar-tr i');
        for (var j = 0; j < fills.length; j++) fills[j].style.width = fills[j].getAttribute('data-w') + '%';
      });
    });
  }

  /* ── 퀴즈 ─────────────────────────────────── */
  function start() {
    state.i = 0;
    state.answers = [];
    state.preview = false;
    state.view = null;
    state.busy = false;
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    preload();
    show('screen-quiz');
    renderQuestion();
  }

  function preload() {
    var list = {};
    QUESTIONS.forEach(function (q) { list[q.img] = 1; });
    ORDER.forEach(function (k) { list[TYPES[k].img] = 1; });
    Object.keys(list).forEach(function (src) { var im = new Image(); im.src = src; });
  }

  function renderQuestion() {
    var q = QUESTIONS[state.i];
    var prev = state.answers[state.i];
    setAccent(q.accent);

    $('qNow').textContent = state.i + 1;
    $('qTotal').textContent = QUESTIONS.length;
    $('qbarFill').style.width = (state.i / QUESTIONS.length * 100) + '%';
    $('qPeriod').textContent = state.i + 1;
    $('qArea').textContent = q.area;
    $('qSheetNo').textContent = '문항 ' + ('0' + (state.i + 1)).slice(-2) + ' / ' + QUESTIONS.length;
    $('qTag').textContent = q.tag;
    $('qText').textContent = q.q;
    $('qImgTag').textContent = 'Q' + (state.i + 1) + ' · ' + q.label;

    var img = $('qImg');
    if (img.getAttribute('src') !== q.img) {
      img.classList.add('is-fading');
      var src = q.img;
      var pos = q.pos || '';
      var pending = new Image();
      pending.onload = function () {
        img.src = src;
        img.style.objectPosition = pos;
        img.alt = q.tag + ' 상황 일러스트';
        img.classList.remove('is-fading');
      };
      pending.onerror = function () { img.classList.remove('is-fading'); };
      pending.src = src;
    }

    $('opts').innerHTML = q.opts.map(function (o, idx) {
      return '<button class="opt' + (prev === idx ? ' is-picked' : '') + '" type="button" data-i="' + idx + '">' +
        '<span class="opt-mark" aria-hidden="true">' + 'ABCD'[idx] + '</span>' +
        '<span class="opt-t">' + o.t + '</span></button>';
    }).join('');

    $('btnBack').style.visibility = state.i === 0 ? 'hidden' : 'visible';
  }

  function pick(idx) {
    if (state.busy) return;
    var q = QUESTIONS[state.i];
    if (!q.opts[idx]) return;
    state.busy = true;
    state.answers[state.i] = idx;
    Sound.click();

    var buttons = $('opts').querySelectorAll('.opt');
    for (var i = 0; i < buttons.length; i++) buttons[i].classList.remove('is-picked');
    buttons[idx].classList.add('is-picked');

    setTimeout(function () {
      state.busy = false;
      if (state.i < QUESTIONS.length - 1) {
        state.i++;
        renderQuestion();
      } else {
        analyze();
      }
    }, 230);
  }

  function back() {
    if (state.busy || state.i === 0) return;
    state.i--;
    renderQuestion();
  }

  /* ── 분석 ─────────────────────────────────── */
  var ANALYZE_LINES = [
    '답안지를 스캔하는 중',
    '연필심 마모도 측정 중',
    '감독관 시선 회피율 계산 중',
    '옆자리 페이지 수 대조 중',
    'AI 안경 배터리 확인 중',
    '놈 유형 판독 중'
  ];
  function analyze() {
    show('screen-analyzing');
    var line = $('anLine'), n = 0;
    line.textContent = ANALYZE_LINES[0];
    var timer = setInterval(function () {
      n = (n + 1) % ANALYZE_LINES.length;
      line.textContent = ANALYZE_LINES[n];
    }, 340);
    setTimeout(function () {
      clearInterval(timer);
      if (navigator.vibrate) { try { navigator.vibrate(12); } catch (e) {} }
      finish();
    }, 1750);
  }

  function tally() {
    var score = {}, max = {}, lastAt = {};
    ORDER.forEach(function (k) { score[k] = 0; max[k] = 0; lastAt[k] = -1; });
    QUESTIONS.forEach(function (q, qi) {
      var seen = {};
      q.opts.forEach(function (o) { seen[o.k] = 1; });
      Object.keys(seen).forEach(function (k) { max[k] += 1; });
      var a = state.answers[qi];
      if (a == null) return;
      var k = q.opts[a].k;
      score[k] += 1;
      lastAt[k] = qi;
    });

    var pct = {}, best = null, bestVal = -1;
    ORDER.forEach(function (k) {
      pct[k] = max[k] ? Math.round(score[k] / max[k] * 100) : 0;
      var v = max[k] ? score[k] / max[k] : 0;
      if (v > bestVal + 1e-9) { bestVal = v; best = k; }
      else if (best && Math.abs(v - bestVal) <= 1e-9) {
        if (lastAt[k] > lastAt[best] || (lastAt[k] === lastAt[best] && ORDER.indexOf(k) < ORDER.indexOf(best))) best = k;
      }
    });
    return { key: best || 'honest', pct: pct };
  }

  function finish() {
    var r = tally();
    state.result = r;
    var before = rankMap(counts(store))[r.key];
    store.inc[r.key] = (store.inc[r.key] || 0) + 1;
    store.done += 1;
    saveStore(store);
    var after = rankMap(counts(store))[r.key];

    renderPeople();
    Sound.reveal();
    showResult(r.key, { pct: r.pct, preview: false });
    history.replaceState(null, '', location.pathname + location.search + '#' + r.key);
    setTimeout(function () {
      if (after < before) toast('내 유형 순위 상승! ' + before + '위 → ' + after + '위');
      else toast(TYPES[r.key].emoji + ' ' + TYPES[r.key].label + ' +1 · 총 ' + fmt(totalOf(counts(store))) + '명');
    }, 900);
  }

  /* ── 케미 렌더 ────────────────────────────── */
  function renderChemi(friendKey, myKey) {
    var box = $('chemi');
    var data = chemi(friendKey, myKey);
    var f = TYPES[friendKey], m = TYPES[myKey];
    $('chemImgA').src = f.img; $('chemImgA').alt = f.name;
    $('chemImgB').src = m.img; $('chemImgB').alt = m.name;
    $('chemNameA').textContent = SHORT[friendKey] || f.name;
    $('chemNameB').textContent = SHORT[myKey] || m.name;
    $('chemScore').textContent = data[0];
    $('chemTitle').textContent = data[1];
    $('chemLine').innerHTML = data[2].map(function (l) { return '<span>' + l + '</span>'; }).join('');
    box.hidden = false;
    $('btnChemShare').onclick = function () {
      var url = SITE + '?from=' + myKey;
      var text = '시험장 케미 결과: 나 "' + (SHORT[myKey] || m.name) + '" vs 너 "' + (SHORT[friendKey] || f.name) + '" → ' + data[0] + '점 (' + data[1] + ')\n' + data[2][1];
      if (navigator.share) {
        navigator.share({ title: '시험장 놈놈놈 케미', text: text, url: url }).catch(function () {});
      } else {
        copyText(url, '케미 결과 링크를 복사했어요');
      }
    };
  }

  /* ── 결과 화면 ────────────────────────────── */
  function showResult(key, opt) {
    var t = TYPES[key];
    var opts = opt || {};
    state.view = key;
    state.preview = !!opts.preview;

    root.style.setProperty('--accent', t.accent);
    root.style.setProperty('--accent-tint', t.tint);
    setAccent(t.accent);

    var img = $('rImg');
    img.src = t.img;
    img.alt = t.name + ' 캐릭터 일러스트';
    $('rName').textContent = t.name;
    $('rTag').textContent = t.tagline;
    $('rDesc').innerHTML = t.desc.map(function (line) {
      var real = /^현실에서도/.test(line);
      return '<span class="' + (real ? 'is-real' : '') + '">' + line + '</span>';
    }).join('');
    $('rBadge').textContent = (ORDER.indexOf(key) + 1) + '번 놈';

    $('rFacts').innerHTML = t.facts.map(function (f) { return '<li>' + f + '</li>'; }).join('');
    $('rAiLine').textContent = t.aiLine;

    var scores = document.querySelector('#rcard .rc-scores');
    if (opts.pct) {
      scores.style.display = '';
      var rows = ORDER.slice().sort(function (a, b) { return opts.pct[b] - opts.pct[a]; });
      $('rBars').innerHTML = rows.map(function (k) {
        var tt = TYPES[k], mine = k === key;
        return '<div class="bar' + (mine ? ' is-mine' : '') + '">' +
          '<div class="bar-h"><span>' + tt.emoji + ' ' + tt.label + (mine ? ' · 나' : '') + '</span><b>' + opts.pct[k] + '%</b></div>' +
          '<div class="track"><i data-w="' + Math.max(2, opts.pct[k]) + '"></i></div></div>';
      }).join('');
      requestAnimationFrame(function () {
        var fills = $('rBars').querySelectorAll('.track i');
        for (var j = 0; j < fills.length; j++) fills[j].style.width = fills[j].getAttribute('data-w') + '%';
      });
    } else {
      scores.style.display = 'none';
    }

    var fk = t.fantasy, nk = t.nemesis;
    var pf = pairInfo(key, fk), pn = pairInfo(key, nk);
    $('rPairs').innerHTML =
      pairHtml('fantasy', fk, '환상의 짝꿍', pf) +
      pairHtml('nemesis', nk, '최악의 상극', pn);

    var ne = TYPES[nk];
    $('rWorst').innerHTML = '<span class="worst-main">🚫 이 놈이랑 <b>앞뒤 자리</b> 앉으면 둘 다 망함 — <b>' +
      ne.emoji + ' ' + ne.name + '</b></span><span class="worst-why">' + (pn && pn.fail ? pn.fail : '') + '</span>';

    renderShop(key);

    var banner = $('previewBanner');
    if (state.preview) {
      banner.hidden = false;
      $('previewBannerText').textContent = state.result ? '미리보기 · 내 결과는 그대로 있어요' : '공유된 결과를 보는 중';
      $('btnBannerBack').textContent = state.result ? '내 결과로' : '나도 해보기';
    } else {
      banner.hidden = true;
    }

    var chem = $('chemi');
    if (!state.preview && state.result && state.from && TYPES[state.from]) {
      renderChemi(state.from, key);
    } else {
      chem.hidden = true;
    }

    renderRanking();
    show('screen-result');
  }

  /* ── 생존템 카드 ──────────────────────────── */
  function renderShop(key) {
    var block = $('shopBlock');
    var it = AFFILIATE_ITEMS[key];
    if (!block || !it) { if (block) block.hidden = true; return; }
    block.hidden = false;

    var live = typeof it.url === 'string' && /^https?:\/\//.test(it.url);
    var emoji = TYPES[key].emoji;
    var inner = '<span class="shop-e" aria-hidden="true">' + emoji + '</span>' +
      '<span class="shop-b"><b>' + it.name + '</b><span>' + it.desc + '</span></span>';

    if (live) {
      $('shopCard').innerHTML = '<a class="shop-card is-live" href="' + it.url + '" target="_blank" rel="sponsored nofollow noopener">' +
        inner + '<span class="shop-cta">보러 가기 →</span></a>';
      $('shopNote').textContent = '※ 이 페이지는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 받을 수 있습니다.';
    } else {
      $('shopCard').innerHTML = '<div class="shop-card">' + inner +
        '<span class="shop-cta is-soon">제휴 링크 준비 중</span></div>';
      $('shopNote').textContent = '※ 아직 제휴 링크가 연결되지 않았어요. 쿠팡 파트너스 링크를 연결하면 이 카드가 바로 구매 링크로 바뀝니다.';
    }
  }

  function pairHtml(kind, key, label, info) {
    var t = TYPES[key];
    var score = info && info.s ? '<b class="pair-s">' + info.s + '</b>' : '';
    var lines = ((info && info.why) || ['']).map(function (l) { return '<span>' + l + '</span>'; }).join('');
    return '<button class="pair p-' + kind + '" type="button" data-k="' + key + '">' +
      '<span class="pair-k">' + label + score + '</span>' +
      '<span class="pair-n"><span class="pair-e" aria-hidden="true">' + t.emoji + '</span> ' + t.name + '</span>' +
      '<span class="pair-r">' + lines + '</span></button>';
  }

  /* ── 8종 목록 ─────────────────────────────── */
  function renderList() {
    $('typeList').innerHTML = ORDER.map(function (k) {
      var t = TYPES[k];
      return '<button class="litem" type="button" data-k="' + k + '">' +
        '<span class="litem-e"><img src="' + t.img + '" alt="" width="720" height="720" loading="lazy"></span>' +
        '<span class="litem-b"><span class="litem-n">' + t.emoji + ' ' + t.name + '</span>' +
        '<span class="litem-t">' + t.tagline + '</span></span></button>';
    }).join('');
  }

  /* ── 9:16 카드 ────────────────────────────── */
  var CARD_W = 1080, CARD_H = 1920;
  var FONT = '"Apple SD Gothic Neo","Pretendard","Noto Sans KR","Noto Sans CJK KR","Malgun Gothic",sans-serif';

  /* 카드에서는 두 줄로 자연스럽게 끊어 쓴다 (자동 축소) */
  var CARD_NAMES = {
    ai: ['AI 안경 몰래 끼고', '답 베끼는 놈'],
    sleep: ['시험 10분 만에', '꿀잠 자는 놈'],
    honest: ['정직하게 땀 뻘뻘', '열심히 푸는 놈'],
    guess: ['아는 거 없는데 끝까지', '머리 굴려 찍는 놈'],
    escape: ['다 풀었든 말든', '먼저 나가버리는 놈'],
    deepfocus: ['지우개 가루 산 쌓고', '한 문제에 목숨 거는 놈'],
    watch: ['옆자리 책장 넘기는 소리에', '멘탈 나가는 놈'],
    omr: ['종료 3분 전 OMR 밀려 써서', '식은땀 흘리는 놈']
  };

  function roundRect(ctx, x, y, w, h, r) {
    if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); return; }
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function wrapLines(ctx, text, maxWidth) {
    var words = text.split(' ');
    var lines = [], line = '';
    for (var i = 0; i < words.length; i++) {
      var test = line ? line + ' ' + words[i] : words[i];
      if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = words[i]; }
      else { line = test; }
    }
    if (line) lines.push(line);
    return lines;
  }
  function loadImg(src) {
    return new Promise(function (res, rej) {
      var im = new Image();
      im.onload = function () { res(im); };
      im.onerror = rej;
      im.src = src;
      if (im.complete && im.naturalWidth) res(im);
    });
  }

  function drawCard(key, pct, img) {
    var t = TYPES[key];
    var ctx = $('cardCanvas').getContext('2d');
    var W = CARD_W, H = CARD_H, PAD = 76;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#fdfaf2';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(22,23,29,0.05)';
    ctx.lineWidth = 2;
    for (var yy = 64; yy < H; yy += 60) {
      ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy); ctx.stroke();
    }
    for (var xx = 0; xx < W; xx += 48) {
      ctx.fillStyle = t.accent;
      ctx.fillRect(xx, 0, 32, 14);
      ctx.fillStyle = '#ffe94d';
      ctx.fillRect(xx + 32, 0, 16, 14);
    }

    ctx.textAlign = 'left';
    ctx.fillStyle = '#16171d';
    ctx.font = '900 40px ' + FONT;
    ctx.fillText('시험 중 나는..?', PAD, 104);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#71757f';
    ctx.font = '800 30px ' + FONT;
    ctx.fillText('시험장 놈놈놈 테스트', W - PAD, 102);
    ctx.strokeStyle = 'rgba(22,23,29,0.18)';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(PAD, 132); ctx.lineTo(W - PAD, 132); ctx.stroke();

    var iw = 620, ix = (W - iw) / 2, iy = 172;
    ctx.save();
    ctx.shadowColor = 'rgba(22,23,29,0.20)';
    ctx.shadowBlur = 26;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = '#fffdf7';
    roundRect(ctx, ix - 16, iy - 16, iw + 32, iw + 32, 40);
    ctx.fill();
    ctx.restore();
    ctx.save();
    roundRect(ctx, ix - 16, iy - 16, iw + 32, iw + 32, 40);
    ctx.strokeStyle = '#16171d';
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.restore();
    ctx.save();
    roundRect(ctx, ix, iy, iw, iw, 30);
    ctx.clip();
    if (img) {
      var s = Math.max(iw / img.width, iw / img.height);
      var dw = img.width * s, dh = img.height * s;
      ctx.drawImage(img, ix + (iw - dw) / 2, iy + (iw - dh) / 2, dw, dh);
    } else {
      ctx.fillStyle = t.tint; ctx.fillRect(ix, iy, iw, iw);
    }
    ctx.restore();

    var y = 862;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#71757f';
    ctx.font = '900 26px ' + FONT;
    ctx.fillText('당 신 은', W / 2, y);

    ctx.fillStyle = '#16171d';
    var nameLines = CARD_NAMES[key] || wrapLines(ctx, t.name, W - PAD * 2 - 30);
    var nameMaxW = W - PAD * 2 - 20;
    var nameSize = 76;
    while (nameSize > 42) {
      ctx.font = '900 ' + nameSize + 'px ' + FONT;
      var widest = 0;
      nameLines.forEach(function (ln) { widest = Math.max(widest, ctx.measureText(ln).width); });
      if (widest <= nameMaxW) break;
      nameSize -= 2;
    }
    ctx.font = '900 ' + nameSize + 'px ' + FONT;
    var nameLh = nameSize + 14;
    y += nameSize + 10;
    nameLines.forEach(function (ln) {
      ctx.fillText(ln, W / 2, y);
      y += nameLh;
    });
    y -= 12;

    ctx.fillStyle = '#3a3d47';
    ctx.font = '700 33px ' + FONT;
    y += 6;
    (t.card || t.desc.slice(0, 2)).forEach(function (line) {
      wrapLines(ctx, line, W - PAD * 2 - 70).forEach(function (ln) {
        ctx.fillText(ln, W / 2, y);
        y += 46;
      });
    });

    y += 12;
    ctx.font = '800 30px ' + FONT;
    var tw = ctx.measureText(t.tagline).width;
    var pw = tw + 64, ph = 62;
    ctx.fillStyle = t.accent;
    roundRect(ctx, (W - pw) / 2, y, pw, ph, 31);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillText(t.tagline, W / 2, y + 41);
    y += ph + 32;

    ctx.save();
    ctx.setLineDash([10, 12]);
    ctx.strokeStyle = 'rgba(22,23,29,0.28)';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(PAD, y); ctx.lineTo(W - PAD, y); ctx.stroke();
    ctx.restore();
    y += 18;

    if (pct) {
      var rows = ORDER.slice().sort(function (a, b) { return pct[b] - pct[a]; }).slice(0, 4);
      var rowH = Math.min(72, (1670 - y) / rows.length);
      rows.forEach(function (k) {
        var tt = TYPES[k];
        var bx = PAD + 250, bw = W - PAD - 190 - bx;
        ctx.textAlign = 'left';
        ctx.fillStyle = k === key ? '#16171d' : '#71757f';
        ctx.font = (k === key ? '900 ' : '800 ') + '30px ' + FONT;
        ctx.fillText(tt.emoji + '  ' + tt.label, PAD, y + 26);
        ctx.fillStyle = 'rgba(22,23,29,0.10)';
        roundRect(ctx, bx, y + 6, bw, 22, 11);
        ctx.fill();
        ctx.fillStyle = t.accent;
        roundRect(ctx, bx, y + 6, Math.max(14, bw * pct[k] / 100), 22, 11);
        ctx.fill();
        ctx.textAlign = 'right';
        ctx.fillStyle = '#16171d';
        ctx.font = '900 30px ' + FONT;
        ctx.fillText(pct[k] + '%', W - PAD, y + 27);
        y += rowH;
      });
    }

    // 최악의 상극 한 줄
    if (pct && y < 1700) {
      var ne = TYPES[t.nemesis];
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(224,54,47,0.92)';
      ctx.font = '800 25px ' + FONT;
      ctx.fillText('🚫 최악의 상극 · ' + ne.emoji + ' ' + ne.label + ' — 앞뒤 자리 앉으면 둘 다 망함', W / 2, y + 34);
    }

    ctx.textAlign = 'center';
    ctx.fillStyle = '#16171d';
    ctx.font = '900 34px ' + FONT;
    ctx.fillText('너는 어떤 놈이야?', W / 2, 1738);
    ctx.fillStyle = '#71757f';
    ctx.font = '700 28px ' + FONT;
    ctx.fillText('handobin9782-lang.github.io/mind-test', W / 2, 1788);
    ctx.fillStyle = 'rgba(22,23,29,0.45)';
    ctx.font = '700 24px ' + FONT;
    ctx.fillText('시험장 놈놈놈 테스트 · 8가지 유형 · 10문항', W / 2, 1832);

    ctx.fillStyle = t.accent;
    ctx.fillRect(0, H - 10, W, 10);
  }

  function cardBlob() {
    return new Promise(function (resolve, reject) {
      if (!state.view) return reject(new Error('no result'));
      var key = state.view;
      var pct = (state.result && state.result.key === key) ? state.result.pct : null;
      loadImg(TYPES[key].img).then(function (im) {
        drawCard(key, pct, im);
        var cv = $('cardCanvas');
        if (cv.toBlob) cv.toBlob(function (b) { b ? resolve(b) : reject(new Error('blob')); }, 'image/png');
        else { try { resolve(dataUrlToBlob(cv.toDataURL('image/png'))); } catch (e) { reject(e); } }
      }).catch(reject);
    });
  }
  function dataUrlToBlob(url) {
    var parts = url.split(','), bin = atob(parts[1]);
    var arr = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type: 'image/png' });
  }

  function saveCard() {
    var btn = $('btnSave'), old = btn.textContent;
    btn.disabled = true;
    btn.textContent = '카드 만드는 중...';
    cardBlob().then(function (blob) {
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'mind-test-' + state.view + '.png';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        URL.revokeObjectURL(url);
        a.remove();
        btn.disabled = false;
        btn.textContent = old;
        toast('9:16 카드 저장 · 사진 앱에서 확인하세요');
      }, 900);
    }).catch(function () {
      btn.disabled = false;
      btn.textContent = old;
      toast('카드를 만들지 못했어요. 다시 시도해 주세요.');
    });
  }

  function inviteUrl(key) { return SITE + '?from=' + key; }
  function inviteText(key) {
    var t = TYPES[key];
    return '시험장 놈놈놈 테스트에서 나 "' + t.emoji + ' ' + t.name + '" 나옴ㅋㅋ 너는 뭐 나오는지 해봐!';
  }

  function shareResult() {
    var key = state.view;
    var url = inviteUrl(key);
    var text = inviteText(key);
    var btn = $('btnShare');
    btn.disabled = true;
    cardBlob().then(function (blob) {
      btn.disabled = false;
      var file = null;
      try { file = new File([blob], 'mind-test-' + key + '.png', { type: 'image/png' }); } catch (e) {}
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        return navigator.share({ files: [file], title: '시험 중 나는..?', text: text + '\n' + url }).catch(function () {});
      }
      if (navigator.share) return navigator.share({ title: '시험 중 나는..?', text: text, url: url }).catch(function () {});
      copyText(url, '링크를 복사했어요. 친구에게 붙여넣기!');
    }).catch(function () {
      btn.disabled = false;
      if (navigator.share) navigator.share({ title: '시험 중 나는..?', text: text, url: url }).catch(function () {});
      else copyText(url, '링크를 복사했어요. 친구에게 붙여넣기!');
    });
  }

  function copyText(text, okMsg) {
    var done = function () { toast(okMsg || '복사했어요'); };
    var fail = function () {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { toast('복사가 안 돼요. 주소창의 링크를 복사해 주세요.'); }
      ta.remove();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done).catch(fail);
    else fail();
  }

  function copyLink() {
    var key = state.view || (state.result && state.result.key) || null;
    if (!key) { copyText(SITE, '링크를 복사했어요'); return; }
    copyText(inviteUrl(key) + '  ' + inviteText(key), '초대 링크와 멘트를 복사했어요. 붙여넣기만 하면 돼요!');
  }

  /* ── 이벤트 ───────────────────────────────── */
  document.addEventListener('click', function (e) {
    var opt = e.target.closest ? e.target.closest('.opt') : null;
    if (opt) { pick(Number(opt.getAttribute('data-i'))); return; }
    var pair = e.target.closest ? e.target.closest('.pair') : null;
    if (pair) { showResult(pair.getAttribute('data-k'), { preview: true }); return; }
    var li = e.target.closest ? e.target.closest('.litem') : null;
    if (li) { showResult(li.getAttribute('data-k'), { preview: true }); return; }
  });

  $('btnStart').addEventListener('click', start);
  $('btnStartFromList').addEventListener('click', start);
  $('btnBack').addEventListener('click', back);
  $('btnRetry').addEventListener('click', start);
  $('btnSave').addEventListener('click', saveCard);
  $('btnShare').addEventListener('click', shareResult);
  $('btnCopy').addEventListener('click', copyLink);
  $('btnList').addEventListener('click', function () { renderRanking(); show('screen-list'); });
  $('btnListFromIntro').addEventListener('click', function () { renderRanking(); show('screen-list'); });
  $('btnBackFromList').addEventListener('click', function () { show(state.result ? 'screen-result' : 'screen-intro'); });
  $('btnBannerBack').addEventListener('click', function () {
    if (state.result) showResult(state.result.key, { pct: state.result.pct });
    else start();
  });

  $('btnSound').addEventListener('click', function () {
    var on = Sound.setEnabled(!Sound.isOn());
    paintSoundBtn();
    if (on) toast('사운드 켜짐 · 시험장 똑딱 사운드');
  });

  document.addEventListener('pointerdown', function () { Sound.unlock(); }, { once: true });

  document.addEventListener('keydown', function (e) {
    if (!$('screen-quiz').classList.contains('is-on')) return;
    if (e.key >= '1' && e.key <= '4') {
      var idx = Number(e.key) - 1;
      if (QUESTIONS[state.i].opts[idx]) pick(idx);
    } else if (e.key === 'Backspace' || e.key === 'ArrowLeft') {
      back();
    }
  });

  /* ── 시작 ─────────────────────────────────── */
  renderTeaser();
  renderList();
  renderPeople();
  paintSoundBtn();
  $('qTotal').textContent = QUESTIONS.length;
  $('year').textContent = new Date().getFullYear();

  (function boot() {
    var f = param('from');
    if (f && TYPES[f]) { state.from = f; renderInvite(); }
    var h = (location.hash || '').replace(/^#\/?/, '');
    if (h && TYPES[h]) {
      renderRanking();
      showResult(h, { preview: true });
    }
  })();
})();
