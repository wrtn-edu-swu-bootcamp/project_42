# Cursor 개발 규칙 (아띠 프로젝트)

> 이 문서는 `.cursorrules` 파일의 문서화 버전입니다.  
> 실제 동작하는 규칙 파일은 프로젝트 루트의 `.cursorrules`를 참고하세요.

**목적**: 문서 기반 개발 + 2시간 MVP 제약 준수 + 안전/품질 보장

---

## 최상위 원칙

1. **문서가 진실**: `docs/**/*.md` 우선. 모르면 검색/확인, 추측 금지.
2. **작고 안전하게**: 최소 diff, 기존 패턴 유지, 테스트/린트/타입 함께 수정.
3. **보안 철저**: API 키/개인정보 절대 커밋/로그 금지. `.env.local` 전용.
4. **위기 대응 최우선**: 자해/극단 신호 감지 시 일반 조언 중단 → Safety 화면 전환.

---

## 소스 오브 트루스 (작업 전 필독)

개발 시작 전 반드시 확인해야 하는 문서들:

- [docs/README.md](README.md) - 문서 인덱스
- [docs/아띠_MVP_기획안.md](아띠_MVP_기획안.md) - 프로덕트/기능/요구사항
- [docs/개발_시작_가이드.md](개발_시작_가이드.md) - 스택/개발 절차
- [docs/아띠_Design_System.md](아띠_Design_System.md) - UI/UX/톤/안전 규칙
- [docs/아띠_Code_Architecture.md](아띠_Code_Architecture.md) - 아키텍처/데이터 모델/API 설계
- [docs/음악_카탈로그_예시.json](음악_카탈로그_예시.json) - 액션 아이템 예시

**규칙**: 작업 시작 전 관련 문서를 `rg`/`grep`으로 검색 후 열람. 충돌 시 최신/명시적 규정 우선.

---

## 프로젝트 개요

- **이름**: 아띠 (순우리말 "친구" + AI)
- **목적**: 10대~30대 위한 감정 일기 + 근거 기반 액션 추천
- **핵심 기능**: 
  - 일기 입력 → 130+ 감정 라벨 분석 (심리학 이론)
  - 공감/조언 → 음악/꽃/활동 추천 (근거 포함)
  - 히스토리/트렌드
- **MVP 제약**: 
  - 2시간 구현
  - localStorage 저장
  - JSON 백업/복원
  - 서버 라우트에서 LLM 호출
  - 위기 감지 시 Safety 전환

---

## 기술 스택 (2026-01 기준)

| 카테고리 | 도구 | 버전 |
|----------|------|------|
| Runtime | Node.js | 24.13.0 LTS |
| Framework | Next.js | 16.1.2 (App Router) |
| Language | TypeScript | 5.9.3 |
| Styling | Tailwind CSS | 4.1.18 |
| UI | shadcn/ui | 3.6.3 |
| AI | OpenAI SDK | 5.19.1 (GPT-3.5-turbo) |
| Validation | Zod | 4.2.0 |
| Chart | Recharts | 3.7.0 |
| Lint | ESLint | 9.39.2 |
| Format | Prettier | 3.8.0 |
| Deploy | Vercel | - |
| Storage | localStorage | (MVP) → Supabase (Phase 2) |

---

## 폴더 구조

```
atti-app/
├── app/                      # Next.js 라우트
│   ├── page.tsx              # Home (일기 작성)
│   ├── result/page.tsx       # Result (분석 결과)
│   ├── history/page.tsx      # History (기록/트렌드)
│   ├── safety/page.tsx       # Safety (위기 안내)
│   ├── settings/page.tsx     # Settings (백업/복원)
│   ├── api/analyze/route.ts  # AI 분석 API
│   └── layout.tsx
├── components/               # UI 컴포넌트
│   ├── emotion-badge.tsx
│   ├── action-card.tsx
│   └── ui/                   # shadcn/ui
├── lib/                      # 비즈니스 로직/유틸
│   ├── storage.ts            # localStorage CRUD
│   ├── prompts.ts            # LLM 시스템 프롬프트
│   ├── types.ts              # TypeScript 타입 + Zod 스키마
│   ├── safety.ts             # 위험 신호 탐지
│   ├── catalogs/             # JSON 카탈로그
│   └── atti/                 # 캐릭터 전용
├── public/atti/
│   ├── emotions/             # 감정 표정 SVG (12종)
│   └── poses/                # 포즈/상태 SVG (6종)
└── docs/                     # 기획/가이드 문서
```

### 폴더 책임

- `app/`: 라우트만. 컴포넌트는 `components/`, 로직은 `lib/`로 분리
- `components/`: UI만. 비즈니스 로직 금지 (props로 데이터 받기)
- `lib/`: 순수 함수/클래스. React hook 금지 (유틸만)

---

## 코드 작성 규칙

### 공통

- **네이밍**: camelCase(변수/함수), PascalCase(컴포넌트/타입), kebab-case(파일)
- **타입**: 모든 함수 시그니처에 타입 명시. public API는 Zod 스키마 검증.
- **에러**: try-catch + 명확한 메시지. "조용히 실패" 금지.
- **로깅**: `console.log` 금지. 개인정보/키 마스킹 필수.

### Next.js/React

- App Router 전용 (`pages` 사용 금지)
- Server Component 우선, 필요 시 `'use client'`
- 비동기 데이터는 React 19 Suspense/Error Boundary
- CSS: Tailwind utility 우선, custom CSS 최소화

### API Route (`/api/analyze`)

1. 입력 검증 (최소 10자)
2. 위험 신호 1차 탐지 (키워드/패턴)
3. LLM 호출 (시스템 프롬프트 + JSON 스키마 강제)
4. Zod 검증 + 카탈로그 ID whitelist 체크
5. 실패 시 1회 재시도 → fallback 응답
6. API 키는 서버에서만, 절대 클라이언트 노출 금지

### 환각 방지

- 액션 아이템은 **카탈로그에 존재하는 ID**만 반환 허용
- 음악: 가수+곡명+가사 1~2줄만. 재생/링크 금지 (저작권)
- 근거: `evidence.json`의 ID 참조 → 출처/요약 표시
- 검증 실패 시: "지금 추천이 어려워. 잠시 후 다시 시도해줘" fallback

---

## UI/UX 규칙 (Design System 준수)

### 톤/말투

- 반말, 친구 톤 고정 ("아띠에게 오늘을 말해봐")
- 이모지 최대 1~2개
- **금지**: 훈계/냉소/과잉 확신/의학적 단정

### 감정 배지

- SVG 에셋 사용: `public/atti/emotions/atti_emotion_{joy|sad|anxiety...}.svg`
- LLM 라벨 → `lib/atti/emotionMap.ts`로 매핑
- fallback: `atti_emotion_neutral.svg`
- 히스토리 캘린더: 작은 스탬프로 표시

### Safety (위기 화면)

- 자해/극단 신호 감지 시 **즉시 전환**, 일반 조언 중단
- 톤: 차분, 단정 금지 ("무조건 괜찮아질 거야" 금지)
- 1393 노출, 면책 문구 필수
- 캐릭터: 차분 포즈만 (반짝/볼 최소화)

### 로딩/에러/빈 상태

- 모든 화면에 skeleton/로딩 메시지 필수
- 에러: "앗, 잠깐 문제가 생겼어. 다시 시도해볼래?" (친근)
- 빈 상태: "아직 기록이 없어. 첫 일기부터 써볼래?"

---

## 보안/프라이버시

- **API 키**: `.env.local` (OPENAI_API_KEY), git에서 제외
- **일기 원문**: 서버 로그 금지, 분석 후 즉시 삭제
- **저장**: 암호화된 로컬 (MVP는 localStorage, 추후 E2E 암호화)
- **개인정보**: 수집 최소화, MVP는 기기 ID만 (이메일/이름 없음)

---

## 배포 (Vercel)

- **환경변수**: OPENAI_API_KEY, NODE_ENV
- **빌드 커맨드**: `npm run build`
- **Node 버전**: 24 LTS
- **배포 후 스모크 테스트**: 
  1. Home 렌더
  2. 일기 제출
  3. Result 표시
  4. History 저장
  5. Safety 전환

---

## 테스트 전략

- **Unit**: `lib/**` (storage, emotionMap, prompts) - Vitest
- **Integration**: API route (analyze) - 실제 LLM 모킹
- **E2E**: Playwright - 핵심 플로우 1개 (Home→Result→History)

---

## 금지 사항

- ❌ 음원 재생/링크/전체 가사 게재 (저작권 위반)
- ❌ 로그인/결제/푸시 (MVP 범위 외)
- ❌ 과설계 (2시간 제약 초과)
- ❌ 클라이언트에 API 키 노출
- ❌ Safety 전환 없이 위기 신호 무시
- ❌ 카탈로그 외 추천 (환각)
- ❌ 개인정보/키 로그 출력

---

## Dev TODO (우선순위)

### P0 (지금 당장 - 환경 설정)

1. Next.js 16.1.2 프로젝트 생성 (`npx create-next-app@latest`, App Router)
2. 환경변수: `.env.local` 생성 (OPENAI_API_KEY), `.env.example` 문서화
3. 의존성: openai, zod, recharts, date-fns, shadcn/ui 설치
4. 폴더 구조: `app/`, `components/`, `lib/`, `public/atti/` 생성
5. 린트/포맷: ESLint 9.39.2, Prettier 3.8.0 설정

### P1 (핵심 기능 - 2시간 MVP)

6. Home: 일기 입력 폼 (텍스트 + 컨디션/태그/강도 선택)
7. API `/api/analyze`: OpenAI 호출 + Zod 검증 + 카탈로그 ID whitelist
8. Result: 감정 배지 (SVG) + 요약 + 공감/조언 + 액션 카드
9. localStorage: JournalEntry 저장/조회 (`lib/storage.ts`)
10. History: 최근 7일 트렌드 (Recharts) + 캘린더 뷰 + 상세
11. Safety: 위기 신호 감지 시 전환 + 1393 노출 + 면책 문구
12. Settings: JSON 백업 다운로드 + 복원 업로드 + 초기화

### P2 (데이터/에셋)

13. 음악 카탈로그: `lib/catalogs/music.json` (30곡, 감정별)
14. 꽃 카탈로그: `lib/catalogs/flowers.json` (15종)
15. 근거 라이브러리: `lib/catalogs/evidence.json` (연구 출처 10개)
16. 감정 SVG 에셋: `public/atti/emotions/` (6종 우선)
17. 포즈 SVG 에셋: `public/atti/poses/` (loading/support/safety)
18. emotionMap: `lib/atti/emotionMap.ts` (LLM 라벨 → SVG 매핑 + fallback)

### P3 (안전/품질)

19. 프롬프트 설계: `lib/prompts.ts` (시스템 프롬프트 + JSON 스키마)
20. 위험 신호 탐지: 키워드/패턴 기반 1차 필터 (`lib/safety.ts`)
21. Zod 스키마: AnalysisResult, JournalEntry, ActionItem
22. 에러 핸들링: 429/500/timeout → 친근한 메시지 + 재시도 1회
23. 로딩 상태: skeleton UI (Home/Result/History)
24. 빈 상태: "첫 일기 써볼래?" (History)

### P4 (배포/테스트)

25. Vercel 배포: GitHub 연결 + 환경변수 설정 + Node 24 LTS
26. 스모크 테스트: 10개 시나리오
27. 접근성: 터치 44px, 대비 4.5:1, 키보드 탐색
28. 성능: LCP < 2.5s, Lighthouse 80+ (모바일)
29. 보안 점검: API 키 노출 확인, `.env.local` git 제외

### P5 (문서화)

30. README.md: 실행 방법 (`npm run dev/build/start`)
31. 환경변수 목록: `.env.example` 최신화
32. 배포 가이드: Vercel 설정 단계 + 환경변수 설명
33. 아키텍처 문서: 폴더 구조 + 데이터 흐름 + API 설계

### 후순위 (Phase 2 이후)

- Supabase 연동 (PostgreSQL + Row Level Security)
- 로그인/회원가입 (NextAuth.js)
- 푸시 알림 (Web Push API)
- RAG/웹검색 근거 강화
- 네이티브 앱 (React Native 전환 고려)

---

**"아띠"와 함께 오늘도 힘내요! 💙**
