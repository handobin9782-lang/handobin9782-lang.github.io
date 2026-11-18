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
      accent: '#6b4bf6', tint: '#efeaff', img: 'assets/type-ai.webp',
      desc: ['공부는 안 했지만 세팅은 완벽하다.', '문제보다 안경 각도가 더 신경 쓰이는 하루.'],
      facts: [
        '공부는 안 했지만 정보 수집은 했다. 그것도 아주 치밀하게.',
        '문제를 읽는 시간보다 안경 각도를 조절하는 시간이 길다.',
        '시험이 끝나면 머리에 남은 건 없다. 안경엔 다 있는데, 배터리는 3%.'
      ],
      feats: [
        '시험지를 받자마자 손보다 목이 먼저 움직인다. 사방 정찰 3초.',
        '연필 2자루, 안경 1개, 배터리 87%. 완벽한 풀세팅.',
        '감독관이 다가오면 갑자기 아주 정성스럽게 문제를 "읽는 척" 한다.',
        '모르는 문제가 나오면 오히려 안심한다. 렌ズ에 답이 뜨는 순간을 기다린다.'
      ],
      aiLine: '렌즈에 "정답입니다"가 뜨는 순간, 화면 한켠에 배터리 3% 경고가 깜박인다. 마지막 문제에서 안경이 꺼지고, 그 직전까지 본 정답이 감독관 뒤통수에 반사된다. 시험은 끝나고, 안경은 압수되고, 집에 전화가 간다.',
      fantasy: ['guess', '내가 정보를, 쟤가 촉을. 손만 대면 만점 아니냐.'],
      nemesis: ['honest', '쟤가 팔로 답안지를 가리고 앉는다. 최악.']
    },
    sleep: {
      emoji: '😴', label: '꿀잠',
      name: '시험 10분 만에 꿀잠 자는 놈',
      tagline: '멘탈 초연 · 낭만 직진러',
      quirk: '10분 만에 엎드려 잔다',
      accent: '#0d9488', tint: '#e3f7f2', img: 'assets/type-sleep.webp',
      desc: ['시험지가 인생 전부는 아니라는 걸 몸으로 증명한다.', '깨어나면 이미 종이 울려 있다.'],
      facts: [
        '공부를 안 한 게 아니다. "안 해도 되는 이유"를 열 개쯤 준비해 왔다.',
        '긴장감이라는 단어는 사전에서만 봤다.',
        '잠결에 들은 3번 문제 답은 기억한다. 그것도 틀렸다.'
      ],
      feats: [
        '책상에 엎드리는 자세가 국가대표급. 3초 만에 호흡이 정리된다.',
        '필통을 열지 않는다. 필통은 방석 역할을 한다.',
        '감독관이 깨우면 "아, 다 풀었어요"라고 말한다. 백지인데.',
        '종이 울리면 가장 개운한 얼굴로 일어난다.'
      ],
      aiLine: 'AI 안경을 써도 3분이면 잠든다. 렌즈에 정답이 떠 있는 걸 아무도 못 본다. 다만 코고는 소리가 4번 문제까지 들린다.',
      fantasy: ['watch', '옆에서 조용히 자 주기만 해도 고마운 사람. 숨소리가 위로가 된다.'],
      nemesis: ['deepfocus', '쟤가 지우개를 갈아서 내 꿈속까지 갈린다.']
    },
    honest: {
      emoji: '✍️', label: '땀뻘뻘',
      name: '정직하게 땀 뻘뻘 열심히 푸는 놈',
      tagline: '노력파 · 뚝심의 정석',
      quirk: '땀 흘리며 뭐라도 쓴다',
      accent: '#e8590c', tint: '#ffece0', img: 'assets/type-honest.webp',
      desc: ['모르는 문제도 일단 뭐라도 쓴다.', '빈칸이 세상에서 제일 무섭다.'],
      facts: [
        '새벽 2시까지 봤는데 10시에 잔 친구가 더 잘 봤다. 세상은 불공평하다.',
        '모르는 문제도 뭐라도 쓴다. 부분점수에 인생을 건다.',
        '화장실 갈 시간이 아까워서 물을 안 마신다. 그게 생존법이다.'
      ],
      feats: [
        '손에 땀이 차서 연필이 미끄러진다. 그래서 2B를 네 자루 챙긴다.',
        '문제를 세 번 읽는다. 시간이 없어서 세 번째는 못 읽지만.',
        '옆에서 종이 넘어가는 소리만 들어도 심장이 빨라진다.',
        'AI 안경 얘기가 나오면 "그거 부정행위야"라며 진심으로 화난다.'
      ],
      aiLine: 'AI 안경을 끼고도 스스로 풀려고 한다. 결국 안경을 벗고 손으로 풀고, 안경 배터리만 떨어진다. 이게 정직의 낭비다.',
      fantasy: ['deepfocus', '서로의 노력을 존중한다. 대신 둘 다 시간이 부족하다.'],
      nemesis: ['ai', '정직의 가치를 논쟁하다가 시험이 끝난다.']
    },
    guess: {
      emoji: '🧠', label: '찍기',
      name: '아는 거 없는데 끝까지 머리 굴려 찍는 놈',
      tagline: '촉 · 임기응변 만렙러',
      quirk: '끝까지 찍어 본다',
      accent: '#d6336c', tint: '#ffe9f1', img: 'assets/type-guess.webp',
      desc: ['답은 모르지만 C가 연속 두 번 안 나온 건 안다.', '찍을 때만큼은 진심이다.'],
      facts: [
        '답은 모르지만 "C가 세 번 연속 안 나왔다"는 건 안다.',
        '찍을 때만큼은 진지하다. 연필로 답안지를 세 번 톡톡 치고 정한다.',
        '답 맞춰보면 두 개는 맞았다. 아는 문제보다 잘 찍었다.'
      ],
      feats: [
        '1번부터 10번까지 다 풀었는데 전부 찍었다. 필기구 색만 진짜다.',
        '선택지가 네 개면 "가운데가 답"이라는 신념이 확고하다.',
        '문제에 나온 단어와 가장 비슷하게 생긴 선택지를 고른다.',
        '답안지에 옮겨 적으며 "혹시나" 하고 한 번 더 본다.'
      ],
      aiLine: 'AI 안경이 정답을 다 알려줘도 못 믿어서 다섯 개를 지우고 다시 찍는다. 촉은 안경도 못 이긴다.',
      fantasy: ['ai', '찍어도 안경이 검증해 준다. 인생 최고의 조합.'],
      nemesis: ['escape', '쟤가 30분 만에 나가서 내 촉이 흔들린다.']
    },
    escape: {
      emoji: '🏃', label: '탈주',
      name: '다 풀었든 말든 제일 먼저 나가버리는 놈',
      tagline: '스피드 · 탈주러',
      quirk: '40분 만에 나가 버린다',
      accent: '#f59f00', tint: '#fff3d6', img: 'assets/type-escape.webp',
      desc: ['시험은 100분, 내 인내심은 40분.', '문을 나서는 순간이 이 하루의 하이라이트다.'],
      facts: [
        '다 푼 게 아니다. "더 앉아 있어 봤자"를 계산한 결과다.',
        '제출하고 나오는 그 개운함이 이 시험의 유일한 보상이다.',
        '집에 와서 답을 맞춰보면 아직 안 푼 문제가 있다는 걸 알게 된다.'
      ],
      feats: [
        '시작 30분 만에 손을 든다. 감독관이 "벌써요?"라고 묻는다.',
        '화장실을 두 번 갔다 오는 사이 나머지 절반을 포기했다.',
        '책가방은 이미 어깨에 걸려 있다. 끝나면 바로 탈출.',
        '아직 앉아 있는 사람들이 신기하다. 왜 저러지?'
      ],
      aiLine: 'AI 안경을 쓰면 10분 만에 다 풀고 나간다. 그리고 로비에서 안경으로 정답을 확인하고, 지하철에서 인생을 반성한다.',
      fantasy: ['omr', '내가 먼저 나가서 "쟤 아직 쓰고 있어"라고 말해 줄 수 있는 사이.'],
      nemesis: ['guess', '쟤가 찍는 걸 기다리다가 30분을 버렸다.']
    },
    deepfocus: {
      emoji: '🔍', label: '과몰입',
      name: '지우개 가루 산 쌓고 한 문제에 목숨 거는 놈',
      tagline: '과몰입러 · 집요함의 화신',
      quirk: '한 문제에 목숨을 건다',
      accent: '#2f9e44', tint: '#e7f7e4', img: 'assets/type-deepfocus.webp',
      desc: ['10점짜리 한 문제에 40분을 쓴다.', '지우개 가루로 책상에 눈이 내렸다.'],
      facts: [
        '그 한 문제는 결국 틀렸고, 나머지 문제는 아예 못 봤다.',
        '지우개가 반쯤 없어졌다. 책상엔 가루로 작은 눈산이 쌓였다.',
        '"이거 분명히 수업 시간에 했는데"를 30분 동안 되새긴다.'
      ],
      feats: [
        '한 문제에서 시계를 마흔 번 넘게 본다. 그 시간이 아깝다는 걸 안다.',
        '풀리면 인생이 열릴 것 같고, 안 풀리면 인생이 닫힌 것 같다.',
        '끝까지 앉아 있고, 나중에 그 문제 부분점수 받고 기뻐한다.',
        '"다음 문제로 넘어가세요"라는 감독관의 말이 제일 무섭다.'
      ],
      aiLine: 'AI 안경을 쓰면 그 문제를 3초에 푼다. 그리고 그 3초 동안 "이래도 되나" 하는 인생 최고의 회의를 한다.',
      fantasy: ['honest', '서로의 뚝심을 알아본다. 우정은 깊고 점수는 낮다.'],
      nemesis: ['sleep', '옆에서 코 고는 소리에 3번 문제를 통째로 놓쳤다.']
    },
    watch: {
      emoji: '👀', label: '옆자리',
      name: '옆자리 책장 넘기는 소리에 멘탈 나가는 놈',
      tagline: '주변 의식 · 예민러',
      quirk: '옆자리 책장 소리에 심장이 내려앉는다',
      accent: '#2563eb', tint: '#e6efff', img: 'assets/type-watch.webp',
      desc: ['문제보다 옆자리 책장 넘기는 소리가 더 크게 들린다.', '내 1장과 옆의 3장, 이게 인생 차이처럼 느껴진다.'],
      facts: [
        '문제는 네 개밖에 못 풀었는데 옆자리가 몇 장 넘겼는지는 정확히 기억한다.',
        '필기구 소리만 들어도 "나는 늦었다"는 결론이 3초 만에 나온다.',
        '결국 시험 끝나고 옆자리 점수를 물어본다. 그리고 더 속상해진다.'
      ],
      feats: [
        '책장 넘어가는 소리에 목이 자동으로 돌아간다. 하루에 마흔 번.',
        '감독관 발소리, 기침 소리, 의자 삐걱임까지 다 들린다. 안테나가 좋다.',
        '귀마개를 챙겨 오겠다고 다짐하고, 다음 시험에도 안 챙긴다.',
        '옆자리가 펜을 놓는 순간 심장이 내려앉는다. 아직 나는 3번인데.'
      ],
      aiLine: 'AI 안경을 쓰면 소리는 안 들릴지 몰라도, 옆자리가 안경을 안 썼다는 사실이 더 신경 쓰인다. 결국 세 문제 남기고 비교를 시작한다.',
      fantasy: ['sleep', '옆에서 자고 있어서 마음이 편하다. 조용한 게 최고의 배려다.'],
      nemesis: ['omr', '쟤가 OMR을 밀려 쓰며 지우개질하는 소리에 내 심장이 다섯 번 내려앉았다.']
    },
    omr: {
      emoji: '🫠', label: 'OMR',
      name: '종료 3분 전 OMR 밀려 써서 식은땀 흘리는 놈',
      tagline: '막판 대참사러',
      quirk: '마지막 3분에 OMR을 밀려 쓴다',
      accent: '#e0362f', tint: '#ffe8e6', img: 'assets/type-omr.webp',
      desc: ['답은 다 알았는데 마킹을 안 했다.', '종료 3분 전, 손이 두 개였으면 싶다.'],
      facts: [
        '문제 옆에 동그라미는 쳐놨는데 OMR은 백지였다. 이건 재능이다.',
        '종료 3분 전부터 손이 떨려서 5번 답을 6번 칸에 쓴다.',
        '고친 자국이 다섯 군데. 지우개는 공중에 떠 있다.'
      ],
      feats: [
        '문제를 풀 때 OMR에 옮기는 습관이 없다. "나중에 한꺼번에"가 인생 모토.',
        '3분 남았는데 남은 칸이 열두 개. 손이 두 개였으면 좋겠다.',
        '종이 울릴 때 아직 8번을 쓰고 있다.',
        '결과가 이상하게 낮다. 다 아는 문제였는데.'
      ],
      aiLine: 'AI 안경이 정답을 다 띄워 줘도 마킹은 직접 해야 한다. 안경이 "3분 남았습니다"를 세 번이나 알려 줬는데.',
      fantasy: ['escape', '쟤가 먼저 나가서 나를 기다려 준다. 유일한 이해자.'],
      nemesis: ['watch', '쟤가 옆에서 종이 넘기는 소리에 놀라 내 손이 떨렸다.']
    }
  };

  var ORDER = ['ai', 'sleep', 'honest', 'guess', 'escape', 'deepfocus', 'watch', 'omr'];

  /* ── 제휴 상품 (쿠팡 파트너스) ───────────────
     url 에 파트너스 링크를 넣으면 그 즉시 구매 카드로 활성화됩니다.
     빈 문자열이면 '준비 중' 상태로 안전하게 표시됩니다. */
  var AFFILIATE_ITEMS = {
    ai:        { name: '블루라이트 차단 안경', desc: '렌즈 반사광은 줄이고 눈은 지키는 기본템', url: '' },
    sleep:     { name: '암막 수면안대', desc: '10분 꿀잠의 완성은 빛 차단', url: '' },
    honest:    { name: '미끄럼 방지 연필 그립', desc: '손에 땀 차도 연필이 도망가지 않게', url: '' },
    guess:     { name: '행운의 미니 부적 키링', desc: '촉은 실력이 아니라 기분에서 온다', url: '' },
    escape:    { name: '초경량 미니 크로스백', desc: '40분 만에 나갈 몸에 책가방은 무겁다', url: '' },
    deepfocus: { name: '대용량 지우개 3종 세트', desc: '가루 산을 만들 만큼 넉넉하게', url: '' },
    watch:     { name: '소음 차단 귀마개', desc: '옆자리 책장 소리를 물리치는 유일한 방법', url: '' },
    omr:       { name: '컴퓨터용 사인펜 + 수정테이프 세트', desc: '마지막 3분을 살리는 최소 장비', url: '' }
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
      tag: '시험 전날 밤', area: '준비 영역', img: 'assets/cover.webp', accent: '#6b4bf6', label: 'D-1 · 23:00',
      q: '시험 전날 밤, 나는?',
      opts: [
        { k: 'ai', t: 'AI 안경 충전부터 한다. 렌즈 닦고 배터리 100% 확인.' },
        { k: 'honest', t: '기출 3년치를 훑다가 새벽 2시. 그리고 다 못 봤다.' },
        { k: 'sleep', t: '"내일은 내일의 내가 잘할 거야" 하고 11시 취침.' },
        { k: 'watch', t: '옆자리 걔는 뭐 하고 있나 카톡 프로필부터 확인한다.' }
      ]
    },
    {
      tag: '시험지 받는 순간', area: '초조 영역', img: 'assets/type-honest.webp', accent: '#e8590c', label: '09:00 · 1교시',
      q: '감독관이 "시험지 펼치세요"라고 말했다. 그때 나는?',
      opts: [
        { k: 'deepfocus', t: '제일 어려워 보이는 문제부터 찾아 표시해 둔다.' },
        { k: 'guess', t: '1번부터 10번까지 훑고 "몇 개나 찍을지" 계산한다.' },
        { k: 'watch', t: '옆자리 시험지 펼치는 속도부터 확인한다.' },
        { k: 'sleep', t: '이름 쓰고 팔 베고 눈 감는다. 시험은 이제 시작됐다.' }
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
      tag: '감독관과 눈 마주침', area: '심장 영역', img: 'assets/type-watch.webp', accent: '#2563eb', label: 'CASE 04 · 접촉',
      q: '감독관과 눈이 마주쳤다. 나는?',
      opts: [
        { k: 'watch', t: '심장이 내려앉아서 30초 동안 문제에 집중하는 척한다.' },
        { k: 'honest', t: '오히려 정면으로 마주본다. 잘못한 게 없으니까.' },
        { k: 'ai', t: '아무 일 없던 것처럼 미소 짓고 고개를 끄덕인다.' },
        { k: 'escape', t: '눈 마주친 김에 "화장실 가도 돼요?"라고 묻는다.' }
      ]
    },
    {
      tag: 'AI 안경의 유혹 · 배터리 100%', area: '양심 영역', img: 'assets/type-ai.webp', accent: '#16a34a', label: 'CASE 05 · 유혹',
      q: '책상 위에 AI 안경이 딱 놓여 있다. 렌즈에 답이 스르륵 떠오른다. 배터리 100%.',
      opts: [
        { k: 'ai', t: '이건 하늘의 계시다. 렌즈에 답 뜨는 순간까지만 쓰자.' },
        { k: 'honest', t: '부정행위다. 절대 안 쓴다. 손으로 푼다.' },
        { k: 'sleep', t: '안경은 무슨. 일단 10분만 눈 붙이자.' },
        { k: 'deepfocus', t: '안경은 됐고 이 문제 하나만 더 붙잡자.' }
      ]
    },
    {
      tag: '시간 절반', area: '시간 영역', img: 'assets/type-omr.webp', accent: '#e0362f', label: 'CASE 06 · 45분',
      q: '시험 시간 절반이 지났는데 문제도 절반 남았다.',
      opts: [
        { k: 'honest', t: '속도 올린다. 아는 것부터, 안 쓰고 넘어가고.' },
        { k: 'guess', t: '남은 문제는 다 찍는다. 대신 각오를 담아서.' },
        { k: 'escape', t: '지금 나가면 덜 창피하다고 계산한다.' },
        { k: 'omr', t: '"아, OMR 아직 안 썼다"를 이때 깨닫는다.' }
      ]
    },
    {
      tag: '옆자리의 답안지', area: '우정 영역', img: 'assets/type-sleep.webp', accent: '#0d9488', label: 'CASE 07 · 밀당',
      q: '옆자리 친구가 답안지를 살짝 밀어줬다.',
      opts: [
        { k: 'honest', t: '고맙지만 안 본다. 이건 내 시험이니까.' },
        { k: 'ai', t: '0.5초만 본다. 그리고 남은 7문제도 다 본다.' },
        { k: 'watch', t: '보기도 전에 "쟤는 다 풀었구나"로 상처받는다.' },
        { k: 'deepfocus', t: '지금 이 문제에 집중하느라 못 봤다.' }
      ]
    },
    {
      tag: '시험 끝', area: '자기합리화 영역', img: 'assets/type-escape.webp', accent: '#f59f00', label: 'CASE 08 · 종료',
      q: '시험 끝. 친구가 "몇 개 찍었어?"라고 묻는다.',
      opts: [
        { k: 'guess', t: '솔직히 7개. 다 찍었어.' },
        { k: 'escape', t: '몰라, 나 40분 만에 나왔어.' },
        { k: 'watch', t: '"너는 몇 개 맞았어?"부터 다시 묻는다.' },
        { k: 'omr', t: '"나 8번 아직 안 썼는데" OMR을 다시 본다.' }
      ]
    },
    {
      tag: '시험 3일 전', area: '환경 영역', img: 'assets/type-deepfocus.webp', accent: '#2f9e44', label: 'D-3 · 책상',
      q: '시험 3일 전, 내 방 책상은?',
      opts: [
        { k: 'honest', t: '기출 프린트, 형광펜 6색, 스탬플러까지 완벽 정리.' },
        { k: 'ai', t: '충전기 꽂힌 AI 안경. 케이블 정리까지 끝났다.' },
        { k: 'sleep', t: '이불. 그 위에 노트북. 노트북엔 유튜브.' },
        { k: 'omr', t: '답안지에 답 옮기는 연습은 한 번도 안 해봤다.' }
      ]
    },
    {
      tag: '한 문장', area: '총평 영역', img: 'assets/cover.webp', accent: '#6b4bf6', label: 'FIN · 정리',
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

  /* ── 케미 ────────────────────────────────── */
  var CHEMI_SAME = {
    ai: [84, '같은 안경 두 개', [
      '둘이 나란히 앉으면 렌즈에 같은 정답이 뜬다. 서로 그걸 확인하느라 문제는 안 푼다.',
      '결국 둘 다 감독관에게 잡히고, 집에 가는 길에 "다음엔 다른 안경 쓰자"고 말한다.'
    ]],
    sleep: [88, '쌍둥이 꿀잠', [
      '둘이 동시에 엎드리면 시험장에 코고는 소리가 두 겹으로 깔린다.',
      '감독관이 깨우면 둘 다 "다 풀었어요"라고 말한다. 둘 다 백지다.'
    ]],
    honest: [80, '정직한 동지', [
      '둘 다 땀을 흘리며 부분점수를 노리고, 손에 땀이 차서 연필이 계속 미끄러진다.',
      '시험이 끝나고 답을 맞춰보면 둘 다 조용해진다. 서로에게 미안해진다.'
    ]],
    guess: [86, '찍기의 성지', [
      '둘이 동시에 C를 찍고, 동시에 다른 답이 나와서 동시에 조용해진다.',
      '그런데 둘 다 두 개씩은 맞았다. 촉이 통한 게 아니라 문제가 이상했던 거다.'
    ]],
    escape: [90, '탈주 콤비', [
      '둘 다 40분에 나가서 로비에서 만난다. 서로를 보며 "너도?"라고 말한다.',
      '그리고 편의점에서 아이스크림을 사 먹으며 인생을 논한다. 이게 진짜 시험이다.'
    ]],
    deepfocus: [74, '과몰입 부부', [
      '둘 다 같은 문제에 목숨을 걸고, 서로 지우개를 빌려 갈아 쓴다.',
      '시험이 끝나도 둘 다 안 일어난다. 그 문제가 아직 안 풀렸기 때문이다.'
    ]],
    watch: [70, '예민 듀오', [
      '둘이 서로의 책장 소리에 예민해져서 끝없이 눈치를 주고받는다.',
      '결국 서로가 서로의 소음원이 되어, 둘 다 세 문제만 풀고 나온다.'
    ]],
    omr: [66, 'OMR 참사', [
      '종료 3분 전, 둘이 동시에 OMR을 뒤집어 엎는다. 참사가 두 배가 된다.',
      '감독관이 오면 둘 다 "이거 원래 이래요"라고 말한다. 아무도 안 믿는다.'
    ]]
  };

  var CHEMI_FRIEND = {
    'ai|guess': [96, '환상의 케미 · 검색과 촉', [
      '한 명이 안경으로 정답을 찾고, 다른 한 명이 그걸 못 믿고 다시 찍는다. 그런데 둘 다 맞힌다.',
      '이 조합은 시험을 이기고, 다음 날 둘 다 아무것도 기억하지 못한다.'
    ]],
    'sleep|watch': [92, '조용한 위로', [
      '한 명은 옆에서 조용히 자고, 다른 한 명은 그 조용함 덕분에 겨우 문제를 푼다.',
      '둘 사이에 대화는 없지만, 시험장에서 가장 평화로운 자리다.'
    ]],
    'deepfocus|honest': [86, '뚝심 콤비', [
      '둘 다 끝까지 앉아 있다. 한 명은 전체를, 한 명은 한 문제를 붙잡고.',
      '결과는 둘 다 아쉽지만, 서로의 성실함을 알아주는 유일한 사이가 된다.'
    ]],
    'escape|omr': [78, '먼저 나간 자와 남은 자', [
      '한 명이 먼저 나가서 문 앞에서 기다리고, 한 명은 3분 전에 OMR을 밀려 쓴다.',
      '복도에서 만나면 말없이 아이스크림을 사 준다. 굳이 묻지 않는다.'
    ]]
  };

  var CHEMI_FOE = {
    'ai|honest': [21, '최악의 상극 · 안경과 팔', [
      '한 명은 안경을 쓰고, 한 명은 팔로 답안지를 가린다. 서로에게 최고의 방해꾼이다.',
      '앞뒤 자리에 앉으면 둘 다 망한다. 실제로 그렇게 된다.'
    ]],
    'deepfocus|sleep': [18, '최악의 상극 · 지우개와 코고는 소리', [
      '한 명은 자고, 한 명은 지우개를 간다. 그 소리가 꿈속까지 들어간다.',
      '깨어난 쪽이 화를 내고, 깨운 쪽은 왜 화내는지 모른다. 둘 다 망한다.'
    ]],
    'escape|guess': [26, '최악의 상극 · 촉과 탈주', [
      '찍는 놈이 마킹을 고민하는 사이, 옆에서 가방을 메고 일어난다. 촉이 흔들린다.',
      '결국 찍는 놈도 같이 나가 버린다. 시험은 두 사람을 이기고 만다.'
    ]],
    'omr|watch': [24, '최악의 상극 · 소리와 식은땀', [
      '한 명은 옆자리 종이 소리에 심장이 내려앉고, 한 명은 OMR을 밀려 쓰며 종이를 갈아댄다.',
      '옆자리는 그 소리에 다섯 번 놀라고, 결국 둘 다 마지막 3분을 놓친다.'
    ]]
  };

  function pairKey(a, b) { return a < b ? a + '|' + b : b + '|' + a; }

  var NEUTRAL = [
    [72, '무난한 케미', '서로의 속도가 달라서 오히려 안 부딪힌다. 생각보다 괜찮은 자리.'],
    [58, '묘한 케미', '서로가 서로에게 딱 절반의 방해다. 둘 다 중간에서 끝난다.'],
    [44, '아슬한 케미', '한 명이 겨우 정신 차려야 둘 다 산다. 지금은 둘 다 위험하다.']
  ];

  function chemi(a, b) {
    if (a === b && CHEMI_SAME[a]) return CHEMI_SAME[a];
    var k = pairKey(a, b);
    if (CHEMI_FRIEND[k]) return CHEMI_FRIEND[k];
    if (CHEMI_FOE[k]) return CHEMI_FOE[k];
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

  /* ── 사운드 (Web Audio, 외부 파일 없음) ───── */
  var Sound = (function () {
    var ctx = null, master = null, tickTimer = null, padTimer = null, padOscs = [], beat = 0;
    var enabled = true, started = false;
    var CHORDS = [
      [220.00, 261.63, 329.63],
      [196.00, 246.94, 293.66],
      [174.61, 220.00, 261.63],
      [233.08, 293.66, 349.23]
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
    function blip(freq, dur, type, vol, delay, slideTo) {
      if (!ctx || !master) return;
      try {
        var t0 = ctx.currentTime + (delay || 0);
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type = type || 'triangle';
        o.frequency.setValueAtTime(freq, t0);
        if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        o.connect(g); g.connect(master);
        o.start(t0); o.stop(t0 + dur + 0.03);
      } catch (e) {}
    }
    function tick() {
      var accent = beat % 4 === 0;
      blip(accent ? 1480 : 1080, 0.045, 'square', accent ? 0.05 : 0.028);
      blip(accent ? 540 : 430, 0.08, 'sine', 0.022);
      beat++;
    }
    function startPad() {
      if (!ctx) return;
      try {
        var g = ctx.createGain(); g.gain.value = 0.05; g.connect(master);
        var filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 780; filter.connect(g);
        var idx = 0;
        for (var i = 0; i < 3; i++) {
          var o = ctx.createOscillator();
          o.type = i === 0 ? 'sine' : 'triangle';
          o.frequency.value = CHORDS[0][i];
          o.connect(filter);
          o.start();
          padOscs.push(o);
        }
        padTimer = setInterval(function () {
          if (!ctx) return;
          idx = (idx + 1) % CHORDS.length;
          padOscs.forEach(function (o, i) {
            try { o.frequency.setTargetAtTime(CHORDS[idx][i], ctx.currentTime, 1.6); } catch (e) {}
          });
        }, 5200);
      } catch (e) {}
    }
    function start() {
      if (!ensure()) return;
      if (started) {
        try { master.gain.setTargetAtTime(0.5, ctx.currentTime, 0.25); } catch (e) {}
        return;
      }
      started = true;
      try { master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setTargetAtTime(0.5, ctx.currentTime, 0.4); } catch (e) {}
      tickTimer = setInterval(tick, 1000);
      startPad();
    }
    function stop() {
      if (tickTimer) { clearInterval(tickTimer); tickTimer = null; }
      if (padTimer) { clearInterval(padTimer); padTimer = null; }
      padOscs.forEach(function (o) { try { o.stop(); } catch (e) {} });
      padOscs = [];
      if (ctx && master) { try { master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.1); } catch (e) {} }
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
      click: function () { if (enabled && ctx) { blip(760, 0.07, 'triangle', 0.06, 0, 980); } },
      reveal: function () {
        if (!enabled || !ctx) return;
        [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
          blip(f, 0.22, 'triangle', 0.07, i * 0.11);
        });
        blip(261.63, 0.9, 'sine', 0.05, 0.1);
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
        '<span class="tcard-sub">렌즈에 답 뜨는 순간 · 배터리 3% 경고</span>' +
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
      var pending = new Image();
      pending.onload = function () {
        img.src = src;
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
    $('rDesc').innerHTML = t.desc.map(function (line) { return '<span>' + line + '</span>'; }).join('');
    $('rBadge').textContent = (ORDER.indexOf(key) + 1) + '번 놈';

    $('rFacts').innerHTML = t.facts.map(function (f) { return '<li>' + f + '</li>'; }).join('');
    $('rFeats').innerHTML = t.feats.map(function (f) { return '<li>' + f + '</li>'; }).join('');
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

    var fk = t.fantasy[0], nk = t.nemesis[0];
    $('rPairs').innerHTML =
      pairHtml('fantasy', fk, '환상의 짝꿍', t.fantasy[1]) +
      pairHtml('nemesis', nk, '최악의 상극', t.nemesis[1]);

    var ne = TYPES[nk];
    $('rWorst').innerHTML = '<span class="worst-main">🚫 이 놈이랑 <b>앞뒤 자리</b> 앉으면 둘 다 망함 — <b>' +
      ne.emoji + ' ' + ne.name + '</b></span><span class="worst-why">' + t.nemesis[1] + '</span>';

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

  function pairHtml(kind, key, label, reason) {    var t = TYPES[key];
    return '<button class="pair p-' + kind + '" type="button" data-k="' + key + '">' +
      '<span class="pair-k">' + label + '</span>' +
      '<span class="pair-e" aria-hidden="true">' + t.emoji + '</span>' +
      '<span class="pair-n">' + t.name + '</span>' +
      '<span class="pair-r">' + reason + '</span></button>';
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
    t.desc.forEach(function (line) {
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
      var ne = TYPES[t.nemesis[0]];
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
