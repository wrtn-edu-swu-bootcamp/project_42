/**
 * 입력 검증 유틸리티
 * Phase 2 - P2-1: 입력 검증/에러 메시지 강화
 */

// 최소/최대 글자수
// 감정 분석을 위해 최소 20자 이상의 문맥이 필요합니다
export const INPUT_LIMITS = {
  MIN_LENGTH: 20,
  MAX_LENGTH: 2000,
} as const

// 금칙어 목록 (스팸, 광고, 부적절한 내용)
const BLOCKED_KEYWORDS = [
  // 스팸/광고
  '대출', '사업자금', '무담보', '무보증', '저금리',
  '홍보', '광고', '마케팅', '홍보문의',
  // 테스트/의미 없는 내용
  'test', 'ㅁㄴㅇㄹ',
] as const

// 반복 문자 패턴 (예: "ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ")
const REPEATED_CHAR_PATTERN = /(.)\1{9,}/

/**
 * 일기 텍스트 검증
 */
export function validateDiaryText(text: string): { valid: boolean; error?: string } {
  const trimmed = text.trim()

  // 1. 빈 입력
  if (!trimmed) {
    return { valid: false, error: '내용을 입력해줘' }
  }

  // 2. 최소 길이
  if (trimmed.length < INPUT_LIMITS.MIN_LENGTH) {
    const remaining = INPUT_LIMITS.MIN_LENGTH - trimmed.length
    return {
      valid: false,
      error: `아띠가 마음을 이해하려면 조금 더 써줘! (${remaining}자 더 필요해)`,
    }
  }

  // 3. 최대 길이
  if (trimmed.length > INPUT_LIMITS.MAX_LENGTH) {
    return {
      valid: false,
      error: `글이 너무 길어. ${INPUT_LIMITS.MAX_LENGTH}자 이하로 줄여줄래?`,
    }
  }

  // 4. 반복 문자 패턴 (예: "ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ")
  if (REPEATED_CHAR_PATTERN.test(trimmed)) {
    return {
      valid: false,
      error: '같은 문자를 너무 많이 반복했어. 조금만 다르게 써줄래?',
    }
  }

  // 5. 금칙어 검사
  const lowerText = trimmed.toLowerCase()
  for (const keyword of BLOCKED_KEYWORDS) {
    if (lowerText.includes(keyword.toLowerCase())) {
      return {
        valid: false,
        error: '부적절한 내용이 포함된 것 같아. 다시 써줄래?',
      }
    }
  }

  // 6. 의미 있는 내용인지 (최소 공백 1개 이상)
  if (!trimmed.includes(' ') && trimmed.length < 30) {
    return {
      valid: false,
      error: '조금 더 자세히 써줄래? 문장으로 표현해봐',
    }
  }

  return { valid: true }
}

/**
 * 태그 검증
 */
export function validateTags(tags: string): { valid: boolean; error?: string; parsed?: string[] } {
  const trimmed = tags.trim()

  if (!trimmed) {
    return { valid: true, parsed: [] }
  }

  // # 기호로 시작하는 태그 추출
  const tagList = trimmed.split(/\s+/).filter(tag => tag.startsWith('#'))

  if (tagList.length === 0) {
    return {
      valid: false,
      error: '태그는 #으로 시작해야 해 (예: #학교 #친구)',
    }
  }

  // 태그 개수 제한 (최대 5개)
  if (tagList.length > 5) {
    return {
      valid: false,
      error: '태그는 최대 5개까지만 입력할 수 있어',
    }
  }

  // 태그 길이 제한 (각 태그 최대 20자)
  for (const tag of tagList) {
    if (tag.length > 20) {
      return {
        valid: false,
        error: '각 태그는 20자 이하로 써줘',
      }
    }
  }

  return { valid: true, parsed: tagList }
}

/**
 * API 에러를 사용자 친화적 메시지로 변환
 */
export function getErrorMessage(error: any, statusCode?: number): string {
  // 네트워크 오류
  if (error.message === 'Failed to fetch') {
    return '인터넷 연결을 확인해줘'
  }

  // HTTP 상태 코드별 메시지
  if (statusCode) {
    switch (statusCode) {
      case 400:
        return '입력 내용에 문제가 있어. 다시 확인해줄래?'
      case 401:
        return 'API 키 설정을 확인해줘'
      case 429:
        return '지금 아띠가 바빠. 잠시 후 다시 시도해줘!'
      case 500:
      case 503:
        return '아띠가 잠깐 혼란스러워. 다시 시도해줄래?'
      default:
        return '문제가 생겼어. 다시 시도해줄래?'
    }
  }

  // 기본 메시지
  return '문제가 생겼어. 다시 시도해줄래?'
}
