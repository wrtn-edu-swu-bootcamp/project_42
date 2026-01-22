import { z } from 'zod'

// ============================================================================
// TypeScript 타입 정의
// ============================================================================

/**
 * 감정 라벨 (130+ 감정 중 일부, MVP에서는 주요 감정만 사용)
 * 참고: docs/아띠_Code_Architecture.md > "5. 데이터 모델"
 */
export type EmotionLabel =
  // 긍정 감정
  | 'joy' | 'excited' | 'calm' | 'gratitude' | 'hopeful' | 'proud'
  | 'content' | 'relaxed' | 'peaceful' | 'satisfied' | 'loved' | 'confident'
  // 부정 감정 - 슬픔
  | 'sad' | 'lonely' | 'depressed' | 'helpless' | 'disappointed' | 'hurt'
  // 부정 감정 - 불안
  | 'anxiety' | 'nervous' | 'worried' | 'scared' | 'overwhelmed' | 'stressed'
  // 부정 감정 - 분노
  | 'anger' | 'irritated' | 'frustrated' | 'resentful' | 'betrayed' | 'jealous'
  // 중립/복합 감정
  | 'numb' | 'confused' | 'embarrassed' | 'guilty' | 'ashamed' | 'bored'
  | 'tired' | 'uncertain' | 'ambivalent'

/**
 * 감정 객체 (라벨 + 강도)
 */
export interface Emotion {
  label: EmotionLabel
  score: number // 0.0 ~ 1.0
}

/**
 * 액션 아이템 카테고리
 */
export type ActionCategory = 'music' | 'flower' | 'activity' | 'breathing' | 'writing'

/**
 * 액션 아이템 (추천 활동)
 */
export interface ActionItem {
  id: string // 카탈로그 ID (예: "music-001")
  category: ActionCategory
  title: string
  description: string
  evidenceId?: string // evidence.json 참조 (선택)
}

/**
 * 근거 참조 (선택적, 추후 구현)
 */
export interface EvidenceRef {
  id: string
  source: string // 연구 출처 (예: "음악 치료 메타분석, 2023")
  summary: string // 1줄 요약
  link?: string // 외부 링크
}

/**
 * 위험 신호 레벨
 */
export type RiskLevel = 'low' | 'medium' | 'high'

/**
 * AI 분석 결과
 */
export interface AnalysisResult {
  emotions: Emotion[] // 3~5개
  summary: string // 1~3줄 핵심 사건 요약
  needs: string // 욕구 해석 (Maslow/SDT 기반)
  response: {
    empathy: string // 공감 메시지
    advice: string // 조언
    theory_tags?: string[] // 심리학 이론 태그 (기획안 기반)
  }
  actions: ActionItem[] // 3~5개
  riskLevel: RiskLevel // 위험 신호 레벨
}

/**
 * 사용자 컨디션 (선택 입력)
 */
export interface Condition {
  sleep: 'bad' | 'normal' | 'good'
  meal: 'skipped' | 'light' | 'normal' | 'heavy'
  activity: 'none' | 'light' | 'moderate' | 'intense'
}

/**
 * 일기 항목 (저장 단위)
 */
export interface JournalEntry {
  id: string // UUID
  createdAt: string // ISO 8601
  text: string // 일기 원문
  condition?: Condition // 컨디션 (선택)
  tags?: string[] // 태그 (예: ['#학교', '#친구'])
  intensity?: number // 감정 강도 (0~5, 선택)
  analysis: AnalysisResult // AI 분석 결과
  completedActions: string[] // 완료한 ActionItem ID 목록
}

/**
 * localStorage 저장 포맷 (버전 관리 포함)
 */
export interface StorageData {
  version: string // "1.0.0"
  entries: JournalEntry[]
  createdAt: string // 최초 생성 시각
  lastModified: string // 마지막 수정 시각
}

// ============================================================================
// Zod 스키마 (런타임 검증)
// ============================================================================

/**
 * 감정 스키마
 */
export const EmotionSchema = z.object({
  label: z.string(), // EmotionLabel (런타임에서는 string으로 검증)
  score: z.number().min(0).max(1)
})

/**
 * 액션 아이템 스키마
 */
export const ActionItemSchema = z.object({
  id: z.string().min(1),
  category: z.enum(['music', 'flower', 'activity', 'breathing', 'writing']),
  title: z.string().min(1),
  description: z.string().min(1),
  evidenceId: z.string().optional()
})

/**
 * 분석 결과 스키마
 */
export const AnalysisResultSchema = z.object({
  emotions: z.array(EmotionSchema).min(1).max(5),
  summary: z.string().min(10).max(500),
  needs: z.string().min(10).max(300),
  response: z.object({
    empathy: z.string().min(10),
    advice: z.string().min(10),
    theory_tags: z.array(z.string()).optional()
  }),
  actions: z.array(ActionItemSchema).min(1).max(5),
  riskLevel: z.enum(['low', 'medium', 'high'])
})

/**
 * 컨디션 스키마
 */
export const ConditionSchema = z.object({
  sleep: z.enum(['bad', 'normal', 'good']),
  meal: z.enum(['skipped', 'light', 'normal', 'heavy']),
  activity: z.enum(['none', 'light', 'moderate', 'intense'])
})

/**
 * 일기 항목 스키마
 */
export const JournalEntrySchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  text: z.string().min(1),
  condition: ConditionSchema.optional(),
  tags: z.array(z.string()).optional(),
  intensity: z.number().int().min(0).max(5).optional(),
  analysis: AnalysisResultSchema,
  completedActions: z.array(z.string())
})

/**
 * localStorage 저장 포맷 스키마
 */
export const StorageDataSchema = z.object({
  version: z.string(),
  entries: z.array(JournalEntrySchema),
  createdAt: z.string().datetime(),
  lastModified: z.string().datetime()
})
