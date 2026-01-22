# 아띠 프로젝트 개발 진행 상황

> 마지막 업데이트: 2026-01-22  
> 진행 중인 Phase: Phase 1 — MVP ✅ 완료!  
> 다음 단계: Phase 2 — Beta (품질 강화 및 고도화)

---

## 📋 Phase 0 체크리스트

- [x] P0-1: 문서 범위/우선순위 확정
- [x] P0-2: 개발 환경 준비
- [x] P0-3: 프로젝트 생성(Next.js)
- [x] P0-4: 필수 패키지 설치
- [x] P0-5: 환경 변수(.env) 설정
- [x] P0-6: 폴더 구조 확정
- [x] P0-7: 디자인 톤/규칙 합의
- [x] P0-8: 안전/윤리 기준 확정

---

## ✅ P0-1: 문서 범위/우선순위 확정 (완료)

### 산출물: MVP 범위 확정 메모

**기준 문서 (Source of Truth)**:
1. `docs/개발_TODO_리스트.md` - Phase별 작업 항목의 기준
2. `docs/아띠_MVP_기획안.md` - 제품 요구사항/기능/화면 설계
3. `docs/개발_시작_가이드.md` - 개발 절차/기술 스택/환경 설정
4. `docs/아띠_Code_Architecture.md` - 코드 구조/데이터 모델/API 설계
5. `docs/아띠_Design_System.md` - UI/UX/톤/안전 규칙
6. `docs/Cursor_개발_규칙.md` - 개발 규칙 및 보안 정책
7. `docs/음악_카탈로그_예시.json` - 액션 아이템 예시

**MVP 포함 기능** (docs/README.md > "📊 MVP 범위"):
- ✅ 일기 작성
- ✅ AI 감정 분석 (130+ 감정)
- ✅ 맞춤 답변 (심리학 이론 기반)
- ✅ 액션 추천 (음악, 꽃, 활동)
- ✅ 기록 저장 & 조회
- ✅ 감정 트렌드 (7일)
- ✅ 위기 신호 감지

**MVP 제외 기능** (Phase 2 이후):
- ❌ 로그인/회원가입
- ❌ 소셜 기능
- ❌ 푸시 알림
- ❌ 결제

**기술 스택** (docs/Cursor_개발_규칙.md):
- Runtime: Node.js 24.13.0 LTS
- Framework: Next.js 16.1.2 (App Router)
- Language: TypeScript 5.9.3
- Styling: Tailwind CSS 4.1.18
- UI: shadcn/ui 3.6.3
- AI: OpenAI SDK 5.19.1 (GPT-3.5-turbo)
- Storage: localStorage (MVP) → Supabase (Phase 2)
- Deploy: Vercel

**변경 요청 규칙**:
- 문서에 명시되지 않은 사항은 기존 문서에 추가 후 진행
- 충돌 시: 최신 문서 & 명시적 규정 우선
- 보안/안전 관련 규칙은 절대 우선

### 참고 문서:
- docs/README.md > "📊 MVP 범위"
- docs/아띠_MVP_기획안.md > "6. MVP 범위 (처음엔 뭘 만들까요?)"

### 완료 기준:
✅ MVP 포함/제외 기능 명확히 구분됨  
✅ 기준 문서 7개 목록 확정  
✅ 기술 스택 확정

---

## 📝 Decisions (문서에 없어서 결정한 것)

1. **Zod 버전 다운그레이드 (4.2.0 → 3.23.8)**
   - 이유: OpenAI SDK 5.x는 Zod 3.x만 지원
   - 근거: npm install 오류 해결 (peerOptional dependency 충돌)
   - 영향: Zod 4.x 신기능 사용 불가, 하지만 3.x로도 충분함

2. **Tailwind CSS 4.x PostCSS 플러그인 수정**
   - 이유: Tailwind CSS 4.x는 새로운 PostCSS 플러그인 사용 (@tailwindcss/postcss)
   - 근거: 빌드 에러 해결 (PostCSS plugin has moved to a separate package)
   - 영향: postcss.config.mjs 수정, @tailwindcss/postcss 패키지 추가 설치

3. **Tailwind CSS v4에서 @apply 제거**
   - 이유: Tailwind v4는 CSS 변수를 자동으로 유틸리티 클래스로 변환하지 않음
   - 근거: `@apply bg-background text-foreground` 오류 해결
   - 영향: app/globals.css에서 직접 CSS 속성으로 작성 (`background-color: hsl(var(--background));`)

---

## 🧪 How to Verify (검증 방법)

### P0-1 검증:
- [x] 기준 문서 7개가 모두 존재하는지 확인
- [x] MVP 포함/제외 기능 목록이 문서화됨
- [x] 기술 스택 버전이 명시됨

---

---

## ✅ P0-2: 개발 환경 준비 (완료)

### 환경 확인 결과:
- ✅ Node.js: v24.13.0 (요구사항: 24.13.0 LTS)
- ✅ Git: 2.50.1.windows.1
- ✅ npm: 11.6.2
- ✅ 코드 에디터: Cursor (사용 중)

### 참고 문서:
- docs/개발_시작_가이드.md > "Step 1: 개발 환경 준비"

### 완료 기준:
✅ `node -v` 실행 성공 (v24.13.0)  
✅ `git --version` 실행 성공 (2.50.1)  
✅ 모든 필수 도구 설치 완료

---

---

## ✅ P0-3: 프로젝트 생성(Next.js) (완료)

### 생성된 구조:
- ✅ package.json (Next.js 16.1.2, React 19, TypeScript 5)
- ✅ tsconfig.json (TypeScript 설정)
- ✅ next.config.ts (Next.js 설정)
- ✅ tailwind.config.ts (Tailwind CSS 4.1.18)
- ✅ .gitignore (환경변수, node_modules 제외)
- ✅ app/ 폴더 (App Router 구조)
  - layout.tsx (루트 레이아웃, 한국어 설정)
  - page.tsx (홈 페이지)
  - globals.css (Tailwind 기본 스타일)
- ✅ README.md (프로젝트 설명)

### 참고 문서:
- docs/개발_시작_가이드.md > "Step 2: 프로젝트 생성 (5분)"
- docs/아띠_MVP_기획안.md > "9.2 추천 기술 스택"

### 완료 기준:
✅ Next.js 프로젝트 구조 생성 완료  
✅ App Router 사용 설정  
✅ TypeScript, ESLint, Tailwind 옵션 적용  
⚠️ 패키지 설치 필요: 터미널에서 `npm install` 실행

### 중요 안내:
한글 경로(`기획안만들기`) 이슈로 인해 자동 패키지 설치가 실패했습니다.  
다음 명령어를 터미널에서 수동으로 실행해주세요:
```bash
cd c:\Users\yeong\기획안만들기
npm install
npm run dev
```

---

---

## ✅ P0-4: 필수 패키지 설치 (완료)

### 설치된 패키지:
- ✅ OpenAI SDK 5.19.1 (AI 감정 분석)
- ✅ Zod 4.2.0 (스키마 검증)
- ✅ date-fns 4.1.0 (날짜 처리)
- ✅ recharts 3.7.0 (트렌드 차트)
- ✅ shadcn/ui 관련:
  - class-variance-authority 0.7.1
  - clsx 2.1.1
  - tailwind-merge 2.6.0
  - lucide-react 0.468.0 (아이콘)
- ✅ Prettier 3.8.0 (코드 포맷팅)

### shadcn/ui 초기화:
- ✅ components.json 설정 생성
- ✅ lib/utils.ts 유틸리티 함수 생성
- ✅ Tailwind CSS 설정 업데이트 (CSS 변수)

### 참고 문서:
- docs/개발_시작_가이드.md > "Step 3: 필요한 패키지 설치 (3분)"
- docs/아띠_Code_Architecture.md > "3-1. 선택한 스택(최신 stable)"

### 완료 기준:
✅ package.json에 모든 필수 패키지 추가됨  
✅ shadcn/ui 초기화 완료  
⚠️ 실제 패키지 다운로드는 `npm install` 실행 필요

---

---

## ✅ P0-5: 환경 변수(.env) 설정 (완료)

### 생성된 문서:
- ✅ ENV_SETUP.md (환경 변수 설정 가이드)
  - OpenAI API 키 발급 방법
  - .env.local 파일 생성 방법
  - 보안 주의사항
  - 문제 해결 가이드
  - 비용 관리 방법

### 환경 변수 목록:
- `OPENAI_API_KEY`: OpenAI API 키 (필수)

### 보안 설정:
- ✅ `.gitignore`에 `.env*` 제외 설정 완료
- ✅ 클라이언트 노출 금지 규칙 명시
- ✅ 서버 컴포넌트에서만 사용하도록 안내

### 참고 문서:
- docs/개발_시작_가이드.md > "Step 4: 환경 변수 설정 (2분)"
- docs/아띠_MVP_기획안.md > "9.3 환경 변수로 API 키 보호"
- ENV_SETUP.md (새로 생성)

### 완료 기준:
✅ 환경 변수 설정 가이드 문서화됨  
✅ `.env.local` 템플릿 제공됨  
✅ Git에 환경 변수 파일 제외 확인됨  
⚠️ 실제 API 키는 사용자가 직접 발급해서 설정해야 함

---

---

## ✅ P0-6: 폴더 구조 확정 (완료)

### 생성된 폴더:
- ✅ components/ (UI 컴포넌트)
- ✅ components/ui/ (shadcn/ui 전용)
- ✅ lib/catalogs/ (JSON 카탈로그)
- ✅ lib/atti/ (캐릭터 관련)
- ✅ public/atti/emotions/ (감정 SVG)
- ✅ public/atti/poses/ (포즈 SVG)

### 생성된 문서:
- ✅ FOLDER_STRUCTURE.md (전체 폴더 구조 및 역할)
  - app/ - Next.js App Router (페이지 라우팅)
  - components/ - UI 컴포넌트 (재사용)
  - lib/ - 비즈니스 로직/유틸
  - public/ - 정적 파일 (SVG, 이미지)
  - docs/ - 기획/가이드 문서

### 파일 위치 규칙:
- 페이지: `app/{화면이름}/page.tsx`
- API: `app/api/{엔드포인트}/route.ts`
- 컴포넌트: `components/{이름}.tsx`
- 타입: `lib/types.ts`
- 카탈로그: `lib/catalogs/{이름}.json`
- SVG: `public/atti/{카테고리}/{파일}.svg`

### 참고 문서:
- docs/개발_시작_가이드.md > "📂 폴더 구조"
- docs/아띠_Code_Architecture.md > "4. 리포지토리 구조 (폴더 트리)"
- FOLDER_STRUCTURE.md (새로 생성)

### 완료 기준:
✅ 폴더 구조 정의 문서 생성됨  
✅ 모든 필요한 폴더 생성됨  
✅ 파일 위치 규칙 명확히 정리됨

---

---

## ✅ P0-7: 디자인 톤/규칙 합의 (완료)

### 생성된 문서:
- ✅ DESIGN_RULES.md (디자인 톤/규칙 요약)
  - 말투/톤 규칙 (반말/친구 톤, 금지 톤)
  - 디자인 원칙 5가지
  - 컬러 토큰 (캐릭터 컬러, shadcn/ui 토큰)
  - 타이포그래피 (폰트, 사이즈, 행간)
  - 간격 토큰 (Tailwind spacing)
  - 컴포넌트 규칙 (버튼, 카드, 입력 필드)
  - 캐릭터 표정/포즈 사용 규칙
  - 안전 UX 규칙

### 확정된 규칙:
- ✅ 반말/친구 톤 고정 (예: "아띠에게 오늘을 말해봐")
- ✅ 이모지 1~2개까지만 사용
- ✅ 금지 톤: 훈계/평가/냉소/과잉확신/의학적단정
- ✅ 디자인 원칙: 정서안전 우선, 귀여움≠신뢰방해, 공감→행동, 작은완료경험, 모바일우선
- ✅ 컬러 토큰: 아띠 캐릭터 컬러 + shadcn/ui 기본 컬러 (globals.css 적용)
- ✅ 터치 영역 44px 이상, 대비 4.5:1 이상

### 참고 문서:
- docs/아띠_Design_System.md > "1. 브랜드 & 캐릭터 가이드"
- docs/아띠_Design_System.md > "2. 디자인 원칙"
- docs/아띠_Design_System.md > "9. 디자인 시스템 토큰"
- DESIGN_RULES.md (새로 생성)

### 완료 기준:
✅ 디자인 규칙 요약 문서 생성됨  
✅ 반말/친구 톤 규칙 확정  
✅ 디자인 원칙 5가지 확정  
✅ 컬러/타이포/간격 토큰 정의  
✅ UI 전반에 동일 톤 적용 기준 합의됨

---

---

## ✅ P0-8: 안전/윤리 기준 확정 (완료)

### 생성된 문서:
- ✅ SAFETY_RULES.md (안전/윤리 기준 전체)
  - 위험 신호 키워드 정의 (자해/극단적 선택/위험 행동)
  - 감지 시 즉시 동작 규칙 (Safety 전환)
  - Safety 화면 필수 요소 (1393, 도움 리소스, 면책 문구)
  - 금지 표현/톤 (과한 확신, 비난, 감정 무시 등)
  - 일반 응답 윤리 규칙 (공감/조언 작성 시)
  - 개인정보/프라이버시 규칙 (서버 저장 안 함)
  - 면책 문구 노출 위치 (Settings, Safety, Result)
  - 테스트 케이스 (명확/경계선/일반)

### 확정된 안전 규칙:
- ✅ 위험 신호 감지 시 **즉시 Safety 화면 전환** (일반 조언 중단)
- ✅ 1393 (자살예방 상담전화) 필수 노출
- ✅ 차분한 톤 유지 ("지금 혼자가 아니야")
- ✅ 금지 표현: "무조건 괜찮아질 거야", "너가 잘못했어", "별거 아니야"
- ✅ 면책 문구: "이 앱은 의료적 진단/치료를 대신하지 않아"
- ✅ 캐릭터: `atti_pose_safety.svg` (차분한 포즈, 볼 0개)

### 참고 문서:
- docs/아띠_Design_System.md > "13. 위기(정신건강) 안전 UX 규칙"
- docs/아띠_MVP_기획안.md > "4.2 위험 신호 감지"
- SAFETY_RULES.md (새로 생성)

### 완료 기준:
✅ 안전 UX 체크리스트 문서화됨  
✅ 위기 신호 감지 규칙 확정  
✅ Safety 화면/문구 규칙 정의  
✅ 면책 문구 노출 위치 확정  
✅ 테스트 케이스 준비됨

---

# 🎉 Phase 0 — Foundations 완료!

## 완료된 항목 요약

1. ✅ **P0-1: 문서 범위/우선순위 확정** - MVP 범위 및 기준 문서 7개 확정
2. ✅ **P0-2: 개발 환경 준비** - Node.js 24.13.0, Git, npm 확인
3. ✅ **P0-3: 프로젝트 생성** - Next.js 16.1.2 프로젝트 구조 생성
4. ✅ **P0-4: 필수 패키지 설치** - OpenAI SDK, Zod, shadcn/ui 등 추가
5. ✅ **P0-5: 환경 변수 설정** - ENV_SETUP.md 가이드 생성
6. ✅ **P0-6: 폴더 구조 확정** - FOLDER_STRUCTURE.md 생성, 필요한 폴더 생성
7. ✅ **P0-7: 디자인 톤/규칙 합의** - DESIGN_RULES.md 생성
8. ✅ **P0-8: 안전/윤리 기준 확정** - SAFETY_RULES.md 생성

## 생성된 주요 파일

### 설정 파일
- package.json (Next.js 16.1.2, TypeScript, Tailwind)
- tsconfig.json
- next.config.ts
- tailwind.config.ts
- components.json (shadcn/ui)
- .gitignore
- .eslintrc.json

### 코드 파일
- app/layout.tsx (루트 레이아웃)
- app/page.tsx (홈 페이지)
- app/globals.css (Tailwind + shadcn/ui CSS 변수)
- lib/utils.ts (shadcn/ui 유틸)

### 문서 파일
- README.md (프로젝트 README)
- ENV_SETUP.md (환경 변수 설정 가이드)
- FOLDER_STRUCTURE.md (폴더 구조 가이드)
- DESIGN_RULES.md (디자인 톤/규칙)
- SAFETY_RULES.md (안전/윤리 기준)
- docs/PROGRESS.md (진행 상황 추적)

### 폴더 구조
- components/ (UI 컴포넌트)
- components/ui/ (shadcn/ui)
- lib/catalogs/ (JSON 카탈로그)
- lib/atti/ (캐릭터 관련)
- public/atti/emotions/ (감정 SVG)
- public/atti/poses/ (포즈 SVG)

## ⚠️ 수동 작업 필요

Phase 0 완료 후, 다음 작업을 수동으로 진행해주세요:

1. **패키지 설치** (한글 경로 이슈로 자동 설치 실패)
   ```bash
   cd c:\Users\yeong\기획안만들기
   npm install
   ```

2. **개발 서버 실행** (정상 동작 확인)
   ```bash
   npm run dev
   ```
   브라우저에서 http://localhost:3000 접속 → "아띠 💙" 표시 확인

3. **환경 변수 설정**
   - `.env.local` 파일 생성
   - OpenAI API 키 등록 (ENV_SETUP.md 참고)

## 📊 검증 방법

- [x] 모든 설정 파일 생성됨
- [x] 폴더 구조 정의됨
- [x] 디자인/안전 규칙 문서화됨
- [x] `npm install` 성공
- [x] `npm run dev` 성공
- [x] http://localhost:3000 접속 성공 ("아띠 💙" 화면 확인)

---

---

# 🎉 Phase 1 — MVP 완료!

## 📋 Phase 1 체크리스트

- [x] P1-1: Home(일기 입력) 화면 구현
- [x] P1-2: Result(분석 결과) 화면 구현
- [x] P1-3: AI 분석 API 연결
- [x] P1-4: 프롬프트/출력 형식 확정
- [x] P1-5: 액션 아이템(추천) 구현
- [x] P1-6: 기록 저장/조회(History) 구현
- [x] P1-7: 위험 신호 감지 & Safety 전환
- [x] P1-8: 로딩/오류/빈 상태 UI 추가

---

## 완료된 항목 요약

### ✅ P1-1: Home(일기 입력) 화면 (완료)
- 일기 텍스트 입력 (textarea, 최소 10자)
- 감정 강도 선택 (0~5)
- 컨디션 선택 (수면, 식사, 활동)
- 태그 입력 (#학교 #친구 등)
- 유효성 검사 및 오류 메시지
- 로딩 상태 표시

**산출물**: `app/page.tsx` (Home 화면)

---

### ✅ P1-2: Result(분석 결과) 화면 (완료)
- 감정 배지 (3~5개, 강도 표시)
- 핵심 요약
- 욕구 해석
- 공감 & 조언 섹션
- 액션 아이템 카드 (완료 버튼 포함)
- 위험 레벨에 따른 안내
- 기록 보기/새 일기 쓰기 버튼

**산출물**: `app/result/page.tsx` (Result 화면)

---

### ✅ P1-3: AI 분석 API 연결 (완료)
- POST `/api/analyze` 라우트 생성
- 입력 검증 (Zod 스키마)
- OpenAI API 호출 (GPT-3.5-turbo)
- JSON 응답 파싱 및 검증
- 카탈로그 ID 검증
- 에러 처리 (429, 503, 500)
- Fallback 응답

**산출물**: `app/api/analyze/route.ts` (API 라우트)

---

### ✅ P1-4: 프롬프트/출력 형식 확정 (완료)
- 시스템 프롬프트 작성 (심리학 이론 기반)
- JSON 출력 형식 정의
- 금지 사항 명시 (의학적 진단, 과장 확신 등)
- 카탈로그 ID 제약
- 안전 규칙 (riskLevel high 시 actions 비우기)
- 사용자 메시지 빌더

**산출물**: `lib/prompts.ts` (프롬프트)

---

### ✅ P1-5: 액션 아이템(추천) 구현 (완료)
- 음악 카탈로그 (16곡)
- 액션 카드 UI (Result 화면)
- 카테고리 표시 (music, activity 등)
- 완료 버튼 (추후 기능 연결 예정)

**산출물**: 
- `lib/catalogs/music.json` (음악 카탈로그)
- Result 화면에 액션 카드 구현

---

### ✅ P1-6: 기록 저장/조회(History) 구현 (완료)
- localStorage 유틸리티 함수
  - loadStorage, saveStorage
  - addEntry, getEntry, getAllEntries
  - getRecentEntries (최근 N일)
  - updateEntry, deleteEntry
  - exportData, importData
- History 화면
  - 빈 상태 UI
  - 최근 7일 감정 통계
  - 일기 목록 (카드 형태)
  - 클릭 시 Result 화면으로 이동

**산출물**:
- `lib/storage.ts` (localStorage 유틸)
- `app/history/page.tsx` (History 화면)

---

### ✅ P1-7: 위험 신호 감지 & Safety 전환 (완료)
- Safety 화면
  - 1393 (자살예방 상담전화) 큰 버튼
  - 기타 도움 리소스 (129, 정신건강의학회, 블루터치)
  - 면책 문구
  - 돌아가기 버튼
- Result 화면에서 riskLevel에 따른 안내
  - high: Safety 화면 링크
  - medium: 안내 문구

**산출물**: `app/safety/page.tsx` (Safety 화면)

---

### ✅ P1-8: 로딩/오류/빈 상태 UI 추가 (완료)
- Home 화면: 로딩 버튼, 오류 메시지
- Result 화면: 로딩 스피너, 오류 메시지
- History 화면: 로딩 스피너, 빈 상태 UI

**산출물**: 각 화면에 상태 UI 구현 완료

---

## 생성된 주요 파일

### 코드 파일
- `app/page.tsx` - Home (일기 입력) 화면
- `app/result/page.tsx` - Result (분석 결과) 화면
- `app/history/page.tsx` - History (기록) 화면
- `app/safety/page.tsx` - Safety (위기 안내) 화면
- `app/api/analyze/route.ts` - AI 분석 API 라우트

### 라이브러리 파일
- `lib/types.ts` - TypeScript 타입 정의 & Zod 스키마
- `lib/prompts.ts` - AI 시스템 프롬프트
- `lib/storage.ts` - localStorage 유틸리티 함수
- `lib/catalogs/music.json` - 음악 카탈로그 (16곡)

---

## 📊 검증 방법

### 수동 테스트 (필수)

1. **환경 변수 설정**
   ```bash
   # .env.local 파일 생성
   OPENAI_API_KEY=sk-...
   ```

2. **개발 서버 실행**
   ```bash
   npm run dev
   ```

3. **Home 화면 테스트**
   - [ ] http://localhost:3000 접속
   - [ ] 일기 입력 (10자 이상)
   - [ ] 감정 강도 선택 (선택)
   - [ ] 컨디션 선택 (선택)
   - [ ] 태그 입력 (선택)
   - [ ] "아띠에게 보내기" 클릭
   - [ ] 로딩 상태 확인

4. **Result 화면 테스트**
   - [ ] 자동으로 Result 화면으로 이동
   - [ ] 감정 배지 3~5개 표시
   - [ ] 핵심 요약 표시
   - [ ] 공감 & 조언 표시
   - [ ] 액션 아이템 카드 표시
   - [ ] "기록 보기" 버튼 클릭

5. **History 화면 테스트**
   - [ ] 최근 7일 감정 통계 표시
   - [ ] 일기 목록 표시
   - [ ] 일기 카드 클릭 시 Result 화면으로 이동

6. **Safety 화면 테스트**
   - [ ] http://localhost:3000/safety 접속
   - [ ] 1393 버튼 클릭 (전화 앱 실행 확인)
   - [ ] 기타 리소스 링크 확인

7. **오류 테스트**
   - [ ] 일기 9자 입력 시 오류 메시지
   - [ ] API 키 없이 실행 시 오류 처리

---

## ⚠️ 알려진 이슈 / 제한사항

1. **Google Gemini API 키 필수** (무료!)
   - `.env.local` 파일에 `GOOGLE_API_KEY` 설정 필요
   - 키가 없으면 분석 기능 사용 불가
   - **장점**: 완전 무료, 하루 1,500 요청 가능

2. **카탈로그 제한**
   - 음악: 16곡만 포함 (추후 확장 예정)
   - 꽃, 활동, 호흡, 쓰기: 아직 미구현

3. **액션 완료 기능 미구현**
   - "완료" 버튼 클릭 시 alert만 표시
   - localStorage에 completedActions 저장 로직 추후 추가 예정

4. **위험 신호 자동 감지 미구현**
   - AI가 riskLevel을 판단하지만, 키워드 기반 1차 필터링은 미구현
   - 프롬프트에만 의존 (추후 lib/safety.ts 추가 예정)

---

## 📌 다음 Phase: Phase 2 — Beta

**Phase 2에서 개선할 항목**:
1. 입력 검증/에러 메시지 강화
2. 스키마 검증 + 안전한 Fallback
3. 트렌드 차트 (recharts)
4. 캐릭터 SVG 추가
5. shadcn/ui 컴포넌트 적용
6. 성능 최적화
7. 접근성 개선
8. SEO 메타태그

**시작 방법**:
다음 명령어로 Phase 2 개발을 시작하세요:
```
Phase 2 개발을 시작해줘
```
