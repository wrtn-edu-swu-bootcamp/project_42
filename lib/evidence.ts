/**
 * 추천 근거(Evidence) 데이터
 * 각 추천 항목의 evidenceId에 해당하는 근거 설명을 제공합니다.
 */

export const EVIDENCE_MAP: Record<string, { summary: string; source?: string }> = {
  // 음악 관련 근거
  'music-therapy-depression': {
    summary: '음악 치료가 우울감 감소에 효과적이라는 연구가 있어요',
    source: '음악 치료 메타분석, 2021'
  },
  'positive-music-mood': {
    summary: '경쾌한 음악이 긍정적 기분을 증폭시켜요',
    source: '감정 조절과 음악, 2020'
  },
  'music-anxiety-reduction': {
    summary: '잔잔한 음악이 불안을 낮추는 데 도움이 돼요',
    source: '음악과 스트레스 감소, 2019'
  },
  'gratitude-music': {
    summary: '감사와 관련된 음악이 긍정 감정을 키워요',
    source: '감사 심리학 연구, 2022'
  },
  'upbeat-mood-enhancement': {
    summary: '빠른 템포의 음악이 에너지와 기분을 높여요',
    source: '음악 템포와 기분, 2020'
  },
  'emotional-validation': {
    summary: '감정을 인정받는 느낌이 심리적 안정을 줘요',
    source: '감정 타당화 연구, 2021'
  },
  'hope-based-therapy': {
    summary: '희망을 주는 메시지가 동기를 높여요',
    source: '희망 치료 이론, 2018'
  },
  'grief-processing': {
    summary: '슬픔을 표현하면 감정 처리에 도움이 돼요',
    source: '애도 심리학, 2019'
  },
  'calm-music-relaxation': {
    summary: '느린 음악이 자율신경계를 안정시켜요',
    source: '음악과 이완 반응, 2020'
  },
  'motivation-music': {
    summary: '동기부여 음악이 행동 의지를 높여요',
    source: '동기 심리학, 2021'
  },
  'change-based-therapy': {
    summary: '변화를 인정하면 적응력이 높아져요',
    source: 'ACT 수용전념치료, 2019'
  },

  // 활동 관련 근거
  'exercise-mood-boost': {
    summary: '가벼운 운동이 엔돌핀을 분비해 기분을 좋게 해요',
    source: '운동과 기분, 2020'
  },
  'warmth-comfort': {
    summary: '따뜻한 온도가 심리적 안정감을 줘요',
    source: '체온과 감정, 2019'
  },
  'environmental-change': {
    summary: '환경 변화가 주의 전환과 기분 전환에 효과적이에요',
    source: '환경 심리학, 2021'
  },
  'body-mind-connection': {
    summary: '몸의 긴장을 풀면 마음도 편해져요',
    source: '신체-정신 연결, 2020'
  },
  'reward-system': {
    summary: '작은 보상이 도파민을 분비해 기분을 높여요',
    source: '보상 심리학, 2019'
  },
  'social-connection': {
    summary: '사회적 연결이 외로움을 줄이고 행복감을 높여요',
    source: '사회 심리학, 2021'
  },
  'positive-recall': {
    summary: '긍정적 기억 회상이 현재 기분을 개선해요',
    source: '인지 심리학, 2020'
  },
  'control-restoration': {
    summary: '통제감 회복이 불안을 줄이고 자기효능감을 높여요',
    source: '통제 이론, 2019'
  },
  'distraction-technique': {
    summary: '주의 전환이 부정적 반추를 줄여요',
    source: '인지행동치료, 2020'
  },
  'expressive-writing': {
    summary: '감정을 글로 쓰면 정서 처리에 도움이 돼요',
    source: '표현적 글쓰기 연구, 2018'
  },

  // 꽃 관련 근거
  'color-therapy-yellow': {
    summary: '노란색이 긍정적 감정과 에너지를 높여요',
    source: '색채 심리학, 2020'
  },
  'aromatherapy-lavender': {
    summary: '라벤더 향이 불안과 스트레스를 줄여요',
    source: '아로마테라피 연구, 2021'
  },
  'color-therapy-white': {
    summary: '흰색이 평온함과 깨끗함의 느낌을 줘요',
    source: '색채 심리학, 2020'
  },
  'self-compassion': {
    summary: '자기 연민이 심리적 안녕감을 높여요',
    source: '자기연민 연구, 2019'
  },
  'mindfulness-simplicity': {
    summary: '단순함에 집중하면 마음이 차분해져요',
    source: '마음챙김 연구, 2020'
  },
  'color-therapy-spring': {
    summary: '봄 색상이 새로운 시작과 희망을 상징해요',
    source: '색채 심리학, 2020'
  },
  'resilience-nature': {
    summary: '자연의 회복력이 용기와 인내를 상징해요',
    source: '자연 치유 연구, 2021'
  },
  'gratitude-expression': {
    summary: '감사 표현이 관계와 행복감을 높여요',
    source: '감사 심리학, 2020'
  },

  // 호흡 관련 근거
  'breathing-anxiety-reduction': {
    summary: '호흡 조절이 부교감신경을 활성화해 긴장을 풀어요',
    source: '호흡과 자율신경, 2021'
  },
  'diaphragmatic-breathing': {
    summary: '복식호흡이 스트레스 호르몬을 줄여요',
    source: '호흡 생리학, 2020'
  },
  'box-breathing-focus': {
    summary: '규칙적 호흡이 집중력을 높이고 마음을 정돈해요',
    source: '호흡과 인지 기능, 2019'
  },
  'sigh-breathing-release': {
    summary: '한숨이 신체 긴장을 이완시켜요',
    source: '생리적 한숨 연구, 2020'
  },
  'mindful-breathing': {
    summary: '호흡에 집중하면 잡념이 줄어들어요',
    source: '마음챙김 호흡, 2021'
  },

  // 쓰기 관련 근거
  'gratitude-journaling': {
    summary: '감사 일기가 긍정 감정과 행복감을 높여요',
    source: '감사 일기 연구, 2019'
  },
  'affect-labeling': {
    summary: '감정에 이름 붙이면 감정 조절이 쉬워져요',
    source: '감정 명명 연구, 2020'
  },
  'temporal-distancing': {
    summary: '시간적 거리두기가 감정적 거리를 만들어요',
    source: '인지 재평가, 2021'
  },
  'cognitive-reframing': {
    summary: '다른 관점으로 보면 부정적 해석이 줄어요',
    source: '인지행동치료, 2019'
  },
  'worry-postponement': {
    summary: '걱정을 미루면 불안이 줄어드는 효과가 있어요',
    source: '걱정 연기 기법, 2020'
  },
}

/**
 * evidenceId로 근거 설명을 가져옵니다
 */
export function getEvidenceDescription(evidenceId: string): string {
  const evidence = EVIDENCE_MAP[evidenceId]
  return evidence?.summary || ''
}

/**
 * evidenceId로 출처를 가져옵니다
 */
export function getEvidenceSource(evidenceId: string): string | undefined {
  const evidence = EVIDENCE_MAP[evidenceId]
  return evidence?.source
}
