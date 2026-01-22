# 아띠 프로젝트 폴더 구조

> 참고: docs/아띠_Code_Architecture.md > "4. 리포지토리 구조 (폴더 트리)"

## 📂 전체 구조

```
atti-app/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # ✅ Home (일기 작성)
│   ├── result/
│   │   └── page.tsx              # Result (분석 결과)
│   ├── history/
│   │   └── page.tsx              # History (기록/트렌드)
│   ├── safety/
│   │   └── page.tsx              # Safety (위기 안내)
│   ├── settings/
│   │   └── page.tsx              # Settings (백업/복원)
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # POST /api/analyze (LLM 호출)
│   ├── layout.tsx                # ✅ 전역 레이아웃 (폰트/메타)
│   ├── globals.css               # ✅ Tailwind 진입점
│   ├── error.tsx                 # 에러 바운더리
│   └── not-found.tsx             # 404 페이지
│
├── components/                   # ✅ UI 컴포넌트
│   ├── journal-input.tsx         # 일기 입력 폼
│   ├── emotion-badge.tsx         # 감정 배지 (SVG)
│   ├── action-card.tsx           # 액션 아이템 카드
│   ├── music-card.tsx            # 음악 추천 카드
│   ├── trend-chart.tsx           # 감정 트렌드 차트
│   ├── calendar-view.tsx         # 히스토리 캘린더
│   ├── entry-card.tsx            # 기록 카드
│   ├── loading-skeleton.tsx     # 로딩 UI
│   └── ui/                       # ✅ shadcn/ui 컴포넌트
│       ├── button.tsx
│       ├── card.tsx
│       ├── textarea.tsx
│       ├── select.tsx
│       ├── slider.tsx
│       ├── badge.tsx
│       └── toast.tsx
│
├── lib/                          # ✅ 비즈니스 로직/유틸
│   ├── utils.ts                  # ✅ shadcn/ui 유틸 (cn 함수)
│   ├── storage.ts                # localStorage CRUD
│   ├── prompts.ts                # LLM 시스템 프롬프트
│   ├── types.ts                  # TypeScript 타입 정의
│   ├── safety.ts                 # 위험 신호 탐지 (키워드)
│   ├── catalogs/                 # ✅ 카탈로그 JSON
│   │   ├── music.json            # 음악 30곡
│   │   ├── flowers.json          # 꽃 15종
│   │   ├── activities.json       # 활동 20개
│   │   └── evidence.json         # 근거 라이브러리 10개
│   └── atti/                     # ✅ 아띠 캐릭터 전용
│       ├── emotionMap.ts         # LLM 라벨 → SVG 매핑
│       └── character.ts          # 포즈 선택 로직
│
├── public/                       # 정적 파일
│   └── atti/                     # ✅ 아띠 에셋
│       ├── emotions/             # ✅ 감정 표정 SVG (12종)
│       │   ├── atti_emotion_joy.svg
│       │   ├── atti_emotion_sad.svg
│       │   ├── atti_emotion_anxiety.svg
│       │   ├── atti_emotion_anger.svg
│       │   ├── atti_emotion_fear.svg
│       │   ├── atti_emotion_surprise.svg
│       │   ├── atti_emotion_love.svg
│       │   ├── atti_emotion_neutral.svg
│       │   └── ...
│       └── poses/                # ✅ 포즈/상태 SVG (6종)
│           ├── atti_pose_loading.svg
│           ├── atti_pose_support.svg
│           ├── atti_pose_safety.svg
│           └── ...
│
├── docs/                         # ✅ 기획/가이드 문서
│   ├── README.md
│   ├── 아띠_MVP_기획안.md
│   ├── 개발_시작_가이드.md
│   ├── 개발_TODO_리스트.md
│   ├── 아띠_Code_Architecture.md
│   ├── 아띠_Design_System.md
│   ├── Cursor_개발_규칙.md
│   ├── PROGRESS.md
│   └── 음악_카탈로그_예시.json
│
├── package.json                  # ✅ 프로젝트 설정
├── tsconfig.json                 # ✅ TypeScript 설정
├── next.config.ts                # ✅ Next.js 설정
├── tailwind.config.ts            # ✅ Tailwind 설정
├── postcss.config.mjs            # ✅ PostCSS 설정
├── components.json               # ✅ shadcn/ui 설정
├── .eslintrc.json                # ✅ ESLint 설정
├── .gitignore                    # ✅ Git 제외 파일
├── ENV_SETUP.md                  # ✅ 환경 변수 설정 가이드
├── README.md                     # ✅ 프로젝트 README
└── .env.local                    # 환경 변수 (사용자가 직접 생성)
```

## 📁 폴더 역할 설명

### `app/` - Next.js App Router
- **역할**: 페이지 라우팅 및 API 엔드포인트
- **규칙**: 
  - 컴포넌트는 `components/`로 분리
  - 비즈니스 로직은 `lib/`로 분리
  - 각 화면은 폴더 단위로 구성 (예: `result/page.tsx`)

### `components/` - UI 컴포넌트
- **역할**: 재사용 가능한 React 컴포넌트
- **규칙**:
  - UI만 담당 (비즈니스 로직 금지)
  - props로 데이터 받기
  - `components/ui/`는 shadcn/ui 전용

### `lib/` - 비즈니스 로직 & 유틸리티
- **역할**: 순수 함수, 데이터 모델, 타입 정의
- **규칙**:
  - React hook 금지 (유틸만)
  - 타입 정의는 `types.ts`에 집중
  - 카탈로그는 `lib/catalogs/`에 JSON으로 관리

### `public/` - 정적 파일
- **역할**: 이미지, SVG, 아이콘 등
- **규칙**:
  - 아띠 캐릭터 에셋은 `public/atti/`에 집중
  - 감정 SVG는 일관된 네이밍 (`atti_emotion_{type}.svg`)

### `docs/` - 기획 및 가이드 문서
- **역할**: 프로젝트 기획, 개발 가이드, 진행 상황
- **규칙**:
  - 모든 개발 결정의 근거는 이 문서들에 있음
  - 변경 사항은 해당 문서에 반영

## 🚀 다음 단계 (Phase 1)

Phase 0 완료 후 다음 폴더/파일들을 구현:

1. **app/result/page.tsx** - Result 화면
2. **app/history/page.tsx** - History 화면
3. **app/safety/page.tsx** - Safety 화면
4. **app/api/analyze/route.ts** - AI 분석 API
5. **components/emotion-badge.tsx** - 감정 배지
6. **components/action-card.tsx** - 액션 카드
7. **lib/storage.ts** - localStorage 관리
8. **lib/types.ts** - 타입 정의
9. **lib/catalogs/music.json** - 음악 카탈로그

---

**✅ = Phase 0에서 생성 완료**  
**나머지 = Phase 1에서 구현 예정**
