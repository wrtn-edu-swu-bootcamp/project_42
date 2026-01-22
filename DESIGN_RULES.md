# 아띠 디자인 톤/규칙 요약

> 참고: docs/아띠_Design_System.md

## 📝 말투/톤 규칙

### ✅ 기본 원칙
- **반말/친구 말투 고정** (예: "아띠에게 오늘을 말해봐")
- 이모지는 1~2개까지만 사용 (과다 사용 금지)
- 감정 공감 → 행동 제안 → 안전 안내 순서 유지

### ❌ 금지 톤
- 훈계, 평가, 냉소, 과잉 확신, 의학적 단정
- 죄책감 유발 ("왜 그렇게 했어?")
- 가스라이팅/감정 무시 ("그건 별거 아니야")

### 화면별 주요 문구
- **Home**: "아띠에게 오늘을 말해봐", "지금 마음을 그대로 적어줘"
- **Result**: "오늘 너의 마음이 이렇게 보였어", "지금 딱 하기 좋은 작은 행동"
- **History**: "최근 7일 마음 흐름", "오늘도 기록이 쌓였어"
- **Safety**: "지금 혼자가 아니야", "바로 도움 받을 수 있는 곳"

## 🎨 디자인 원칙 (5가지)

1. **정서 안전 우선**
   - 파스텔과 둥근 형태로 시각적 긴장 낮추기
   - 조심스럽고 따뜻한 언어 사용

2. **귀여움은 신뢰를 방해하지 않게**
   - 과한 유아성 배제
   - 부드러운 대비와 절제된 모션으로 차분함 유지

3. **행동으로 이어지는 공감**
   - 공감 문구 → 즉시 행동 제안
   - "위로 → 실행" 흐름 고정

4. **작고 빠른 완료 경험**
   - 5~15분 내 행동 강조
   - 체크 애니메이션으로 성취감 제공

5. **모바일 우선 + 접근성**
   - 터치 영역 44px 이상
   - 대비 4.5:1 이상
   - 집중 흐름을 끊지 않는 레이아웃

## 🎨 컬러 토큰 (Tailwind CSS 변수)

### 주요 브랜드 컬러
```css
/* 아띠 캐릭터 컬러 */
--atti-shell-green: #BFE6D2;    /* 바디 컬러 */
--atti-face-cream: #FFF4DA;     /* 얼굴창 */
--atti-soil-brown: #9C7A5E;     /* 흙 뚜껑 */
--atti-leaf-green: #7BCB96;     /* 잎 */
--atti-blush: #F4A9B8;          /* 볼 */
--atti-indicator: #F7D27C;      /* 알림 */

/* 배경 컬러 */
--bg-primary: #FAF8FF;          /* 라이트 배경 */
--surface: #FFFFFF;             /* 카드/서피스 */
```

### shadcn/ui 토큰 (이미 globals.css에 적용됨)
- Primary: 파란색 계열 (`hsl(221.2 83.2% 53.3%)`)
- Secondary: 연한 회색 (`hsl(210 40% 96.1%)`)
- Muted: 부드러운 회색 (`hsl(215.4 16.3% 46.9%)`)
- Destructive: 빨간색 계열 (위험 표시용)

## 📐 타이포그래피

### 폰트
- 기본: 시스템 폰트 (Apple SD Gothic Neo, Segoe UI)
- 폴백: -apple-system, BlinkMacSystemFont, sans-serif

### 사이즈 (Tailwind)
- Heading Large: `text-4xl` (36px) - 페이지 제목
- Heading Medium: `text-2xl` (24px) - 섹션 제목
- Body Large: `text-lg` (18px) - 주요 텍스트
- Body: `text-base` (16px) - 기본 텍스트
- Small: `text-sm` (14px) - 보조 텍스트
- Tiny: `text-xs` (12px) - 캡션/라벨

### 행간
- 제목: `leading-tight` (1.25)
- 본문: `leading-normal` (1.5)
- 긴 텍스트: `leading-relaxed` (1.625)

## 📏 간격 토큰 (Tailwind Spacing)

- `space-1`: 4px (최소 간격)
- `space-2`: 8px (작은 요소 간격)
- `space-3`: 12px (일반 요소 간격)
- `space-4`: 16px (섹션 내부 간격)
- `space-6`: 24px (섹션 간 간격)
- `space-8`: 32px (큰 섹션 간격)
- `space-12`: 48px (화면 간 간격)

## 🔘 컴포넌트 규칙

### 버튼
- Primary: 파란색 배경, 흰색 텍스트
- Secondary: 연한 회색 배경, 어두운 텍스트
- Destructive: 빨간색 (삭제 등)
- 최소 높이: 44px (터치 영역)
- 둥근 모서리: `rounded-lg` (8px)

### 카드
- 배경: 흰색 (`bg-white`)
- 테두리: 연한 회색 (`border-gray-200`)
- 그림자: `shadow-sm` (은은한 그림자)
- 둥근 모서리: `rounded-2xl` (16px)
- 내부 패딩: `p-6` (24px)

### 입력 필드
- 테두리: 연한 회색
- 포커스: 파란색 링
- 오류: 빨간색 테두리 + 오류 메시지
- 플레이스홀더: 친구 톤 (예: "지금 마음을 그대로 적어줘")

## 🎭 아띠 캐릭터 표정 사용

### 감정별 SVG 매핑
- 기쁨/만족: `atti_emotion_joy.svg`
- 평온/차분: `atti_emotion_calm.svg`
- 슬픔/우울: `atti_emotion_sad.svg`
- 불안/긴장: `atti_emotion_anxiety.svg`
- 화남/짜증: `atti_emotion_anger.svg`
- 두려움: `atti_emotion_fear.svg`
- 외로움: `atti_emotion_lonely.svg`
- 중립/기본: `atti_emotion_neutral.svg`

### 포즈별 SVG
- 로딩 중: `atti_pose_loading.svg`
- 지지/응원: `atti_pose_support.svg`
- 위기 안내: `atti_pose_safety.svg`

### 사용 원칙
- 24px 작은 사이즈에서도 핵심 특징 인식 가능하도록 설계
- Safety 화면: 볼 0개, 하이라이트 1개, 모션 최소화
- 기본 화면: 볼 1개, 하이라이트 2개, 약한 모션

## 🔴 안전 UX 규칙 (Safety)

### 위험 신호 감지 시
1. **즉시 Safety 화면 전환** (일반 응답 중단)
2. **차분한 톤 유지** ("무조건 괜찮아질 거야" 같은 확신 금지)
3. **1393 노출 필수** (바로 전화 가능하게)
4. **면책 문구 표시** ("이 앱은 의료적 진단/치료를 대신하지 않아")
5. **캐릭터: 차분 포즈만** (반짝/볼 최소화)

### 금지 표현
- 의학적 단정 ("너는 우울증이야")
- 치료 권유 ("병원 가봐")
- 과한 확신 ("다 잘될 거야")
- 조급함 유발 ("빨리 ~해야 해")

## ✅ 구현 체크리스트 (P0-7 완료 기준)

- [x] 반말/친구 톤 규칙 확정
- [x] 디자인 원칙 5가지 확정
- [x] 컬러 토큰 정의 (globals.css에 적용됨)
- [x] 타이포그래피 규칙 정의
- [x] 간격 토큰 정의 (Tailwind 기본 사용)
- [x] 캐릭터 표정/포즈 매핑 규칙 정의
- [x] 안전 UX 규칙 확정

## 📚 참고 문서

- [아띠 Design System 전체](docs/아띠_Design_System.md)
- [아띠 MVP 기획안](docs/아띠_MVP_기획안.md)
- [Tailwind CSS 설정](tailwind.config.ts)
- [Global CSS](app/globals.css)

---

**이 규칙들은 Phase 1 이후 모든 화면/컴포넌트 구현 시 따라야 해!** 💙
