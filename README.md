# 아띠 (Atti) - 당신의 똑똑한 친구 💙

> 감정 일기 + 근거 기반 액션 추천 웹앱

## 🚀 시작하기

### 개발 서버 실행

```bash
# 패키지 설치
npm install

# 개발 서버 시작
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

### 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음을 추가하세요:

```env
OPENAI_API_KEY=sk-proj-your-api-key-here
```

자세한 설정 방법은 [ENV_SETUP.md](./ENV_SETUP.md)를 참고하세요.

## 📚 문서

자세한 기획 및 개발 가이드는 `docs/` 폴더를 참고하세요:

- [아띠 MVP 기획안](docs/아띠_MVP_기획안.md)
- [개발 시작 가이드](docs/개발_시작_가이드.md)
- [개발 TODO 리스트](docs/개발_TODO_리스트.md)
- [Code Architecture](docs/아띠_Code_Architecture.md)
- [Design System](docs/아띠_Design_System.md)

## 🛠️ 기술 스택

- **Framework**: Next.js 16.1.2 (App Router)
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS 4.1.18
- **AI**: OpenAI API (GPT-3.5-turbo)
- **Deploy**: Vercel

## 📦 빌드 & 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start
```

## 📝 라이선스

Private Project
