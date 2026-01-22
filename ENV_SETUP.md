# 환경 변수 설정 가이드

## 필수 환경 변수

### `.env.local` 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Google Gemini API Key
# https://aistudio.google.com/apikey 에서 생성
GOOGLE_API_KEY=your-api-key-here
```

---

## Google Gemini API 키 발급 방법 (무료!)

### 1. Google AI Studio 접속
1. https://aistudio.google.com 접속
2. Google 계정으로 로그인

### 2. API 키 생성
1. 왼쪽 메뉴에서 **"Get API key"** 클릭
2. **"Create API key"** 버튼 클릭
3. 프로젝트 선택 (없으면 "Create API key in new project" 선택)
4. 생성된 API 키 복사 (예: `AIzaSyXXXXXXXXXXXXXXXXXX`)

### 3. 프로젝트에 적용
1. 프로젝트 루트에 `.env.local` 파일 생성
2. 복사한 키를 붙여넣기:
   ```
   GOOGLE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXX
   ```
3. 파일 저장 (Ctrl+S 또는 Cmd+S)

### 4. 무료 사용량
- **분당**: 15 요청
- **일일**: 1,500 요청
- **월간**: 무제한 (일일 제한만 있음)
- **💡 충분함**: 개발/테스트에 완전히 충분합니다!

---

## 왜 Gemini를 사용하나요?

### ✅ Gemini의 장점

1. **완전 무료**: 신용카드 등록 없이 바로 사용 가능
2. **높은 할당량**: 하루 1,500 요청 (일기 1,500개 분석 가능)
3. **좋은 성능**: GPT-3.5와 비슷한 품질
4. **JSON 모드**: 구조화된 출력 지원

### 💰 비용 비교

| 항목 | OpenAI GPT-3.5 | Google Gemini |
|------|----------------|---------------|
| 초기 비용 | $5 최소 충전 | **무료** |
| 일기 1개 | $0.002 | **무료** |
| 일일 제한 | 없음 (비용 발생) | 1,500개 |
| 신용카드 | 필수 | **불필요** |

---

## 보안 주의사항

### ✅ 해야 할 것
- ✅ `.env.local` 파일은 `.gitignore`에 포함됨 (절대 Git에 올라가지 않음)
- ✅ API 키는 서버 컴포넌트에서만 사용 (클라이언트 노출 금지)
- ✅ Vercel 배포 시 환경 변수 별도 등록

### ❌ 하면 안 되는 것
- ❌ API 키를 코드에 직접 하드코딩
- ❌ API 키를 GitHub에 커밋
- ❌ API 키를 클라이언트 컴포넌트에서 사용

---

## 문제 해결

### 문제 1: "GOOGLE_API_KEY is not set" 오류

**원인**: API 키가 설정되지 않음

**해결**:
1. `.env.local` 파일이 **프로젝트 루트**에 있는지 확인
   - ✅ 올바른 위치: `c:\Users\yeong\기획안만들기\.env.local`
   - ❌ 잘못된 위치: `c:\Users\yeong\기획안만들기\app\.env.local`
2. 파일 이름이 정확한지 확인 (`.env.local`, 점 포함)
3. API 키 앞뒤에 **공백이 없는지** 확인
4. 서버를 **완전히 종료하고 재시작** (Ctrl+C → npm run dev)

### 문제 2: "API key invalid" 오류

**원인**: API 키가 잘못됨

**해결**:
1. API 키를 다시 복사해서 붙여넣기
2. Google AI Studio에서 새 키 생성
3. 키가 `AIzaSy`로 시작하는지 확인

### 문제 3: "Rate limit exceeded" 오류

**원인**: 분당 15 요청 또는 일일 1,500 요청 초과

**해결**:
1. 잠시 기다렸다가 다시 시도 (1분 후)
2. 일일 제한 초과 시: 다음 날까지 대기
3. Google Cloud Console에서 유료 플랜으로 업그레이드 (선택)

### 문제 4: JSON 파싱 오류

**원인**: Gemini가 JSON이 아닌 텍스트를 반환함

**해결**:
1. 자동으로 재시도됨
2. 계속 실패하면: 프롬프트 확인 (`lib/prompts.ts`)
3. `responseMimeType: 'application/json'` 설정 확인

---

## 테스트 방법

### 1. 서버 시작
```bash
npm run dev
```

### 2. 브라우저 테스트
1. http://localhost:3000 접속
2. 일기 입력:
   ```
   오늘 친구랑 싸웠어. 속상해.
   ```
3. "아띠에게 보내기" 클릭
4. 결과 화면이 표시되면 **성공**! 🎉

### 3. 터미널 확인
성공 시 터미널에 다음과 유사한 로그가 표시됩니다:
```
POST /api/analyze 200 in 2000ms
```

---

## Vercel 배포 시 환경 변수 설정

### 1. Vercel 대시보드 접속
1. https://vercel.com 로그인
2. 프로젝트 선택

### 2. 환경 변수 추가
1. "Settings" 탭 클릭
2. "Environment Variables" 선택
3. 새 변수 추가:
   - **Name**: `GOOGLE_API_KEY`
   - **Value**: (API 키 붙여넣기)
   - **Environment**: Production, Preview, Development 모두 선택
4. "Save" 클릭

### 3. 재배포
1. "Deployments" 탭으로 이동
2. 최신 배포 선택
3. "Redeploy" 클릭

---

## 추가 정보

### Gemini 1.5 Flash 모델

현재 사용 중인 모델: **gemini-1.5-flash**

- **속도**: 매우 빠름 (1-3초)
- **품질**: GPT-3.5와 유사
- **컨텍스트**: 최대 1M 토큰
- **비용**: 무료 (할당량 내)

### API 사용량 확인

https://aistudio.google.com/apikey 에서 확인:
- 오늘 사용량
- 남은 할당량
- 에러 로그

---

## 참고 문서

- [Google AI Studio](https://aistudio.google.com)
- [Gemini API 문서](https://ai.google.dev/gemini-api/docs)
- [할당량 및 제한](https://ai.google.dev/gemini-api/docs/quota)
- [@google/generative-ai 패키지](https://www.npmjs.com/package/@google/generative-ai)
