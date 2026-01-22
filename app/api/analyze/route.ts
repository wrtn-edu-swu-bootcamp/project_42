import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { z } from 'zod'
import { AnalysisResultSchema, type JournalEntry, type AnalysisResult, type Emotion, type ActionItem } from '@/lib/types'
import { SYSTEM_PROMPT, buildUserMessage } from '@/lib/prompts'
import { randomUUID } from 'crypto'

/**
 * AI 응답 실패 시 안전한 Fallback 응답
 */
function getFallbackAnalysis(): AnalysisResult {
  const emotions: Emotion[] = [
    { label: 'confused', score: 0.5 },
  ]
  
  const actions: ActionItem[] = [
    {
      id: 'music-001',
      category: 'music',
      title: '에픽하이 - 스물다섯, 스물하나',
      description: '힘든 시기를 지나온 가사가 깊은 위로를 줘요. 느린 템포가 마음을 진정시켜줘요.',
    },
  ]

  return {
    emotions,
    summary: '지금 네 마음을 정확히 이해하지 못했어.',
    needs: '다시 한번 차분히 표현해봐.',
    response: {
      empathy: '네 감정을 제대로 읽지 못해서 미안해. 아띠가 아직 많이 배워야 해.',
      advice: '조금 더 구체적으로 상황이나 기분을 설명해주면, 더 잘 이해할 수 있을 것 같아.',
    },
    actions,
    riskLevel: 'low',
  }
}

// 사용 가능한 모델 목록 (2026년 기준)
const STABLE_MODELS = [
  'gemini-2.0-flash-lite',  // 가벼운 버전 (과부하 적음)
  'gemini-2.0-flash',       // 메인 모델
]

// 현재 사용할 모델 인덱스
let currentModelIndex = 0

/** 429 / rate limit / quota exhausted 여부 확인 */
function is429OrRateLimitError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const e = err as Record<string, unknown>
  const status = e?.status as number | string | undefined
  const code = e?.code as number | string | undefined
  const msg = String(e?.message ?? '')
  if (status === 429 || code === 429) return true
  if (status === 'RESOURCE_EXHAUSTED') return true
  const lower = msg.toLowerCase()
  return (
    lower.includes('429') ||
    lower.includes('resource_exhausted') ||
    lower.includes('quota') ||
    lower.includes('rate limit') ||
    lower.includes('rate_limit') ||
    lower.includes('too many requests')
  )
}

// Gemini 클라이언트 초기화
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')

// 입력 검증 스키마
const InputSchema = z.object({
  text: z.string().min(10, '일기는 최소 10자 이상 작성해주세요').max(2000, '일기는 2000자 이하로 작성해주세요'),
  intensity: z.number().int().min(0).max(5).optional(),
  condition: z.object({
    sleep: z.enum(['bad', 'normal', 'good']).optional(),
    meal: z.enum(['skipped', 'light', 'normal', 'heavy']).optional(),
    activity: z.enum(['none', 'light', 'moderate', 'intense']).optional(),
  }).optional(),
  tags: z.array(z.string()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    // API 키 확인
    if (!process.env.GOOGLE_API_KEY) {
      console.error('GOOGLE_API_KEY is not set')
      return NextResponse.json(
        { error: '서버 설정 오류가 발생했어요' },
        { status: 500 }
      )
    }

    // 요청 본문 파싱
    const body = await request.json()
    
    // 입력 검증
    const validated = InputSchema.parse(body)
    
    // 사용자 메시지 생성
    const userMessage = buildUserMessage(
      validated.text,
      validated.intensity,
      validated.condition,
      validated.tags
    )

    // Gemini API 호출 (여러 모델 순차 시도)
    let analysis: any = null // Zod parse 결과를 받기 위해 any 사용
    const maxRetries = STABLE_MODELS.length // 모든 모델 시도

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // 순차적으로 다른 모델 시도
        const modelName = STABLE_MODELS[(currentModelIndex + attempt - 1) % STABLE_MODELS.length]
        console.log(`Trying model: ${modelName} (attempt ${attempt})`)
        
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
            topP: 0.95,
            topK: 40,
          },
        })

        const prompt = `${SYSTEM_PROMPT}\n\n${userMessage}`
        
        // Timeout 설정 (20초로 늘림)
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 20000)
        )
        
        const result = await Promise.race([
          model.generateContent(prompt),
          timeoutPromise
        ]) as any
        
        const responseText = result.response.text()
        
        // 디버깅: 원본 응답 로그
        console.log('Raw AI response (first 500 chars):', responseText?.substring(0, 500))
        
        if (!responseText) {
          throw new Error('AI 응답이 비어있어요')
        }

        // JSON 추출 (마크다운 코드 블록 제거)
        let jsonText = responseText.trim()
        
        // ```json ... ``` 또는 ``` ... ``` 형식 제거
        if (jsonText.startsWith('```')) {
          jsonText = jsonText.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '')
        }
        
        // 디버깅: 정제된 JSON 로그
        console.log('Cleaned JSON (first 500 chars):', jsonText?.substring(0, 500))
        
        // JSON 파싱 시도
        const aiResponse = JSON.parse(jsonText)
        
        // 스키마 검증
        analysis = AnalysisResultSchema.parse(aiResponse)
        
        // 성공하면 루프 종료
        console.log(`AI analysis succeeded on attempt ${attempt}`)
        break
      } catch (parseError: unknown) {
        const errMsg = parseError instanceof Error ? parseError.message : String(parseError)
        console.warn(`AI analysis attempt ${attempt} failed:`, errMsg)

        // 마지막 시도였으면 Fallback 사용
        if (attempt === maxRetries) {
          console.error('All AI attempts failed, using fallback')
          analysis = getFallbackAnalysis()
        } else {
          // 429/할당량 초과 시 exponential backoff, 그 외 1초 대기 (503 등)
          const delayMs = is429OrRateLimitError(parseError)
            ? Math.min(2000 * Math.pow(2, attempt - 1), 15000)
            : 1000
          await new Promise((resolve) => setTimeout(resolve, delayMs))
        }
      }
    }

    // analysis가 여전히 null이면 (있을 수 없지만 안전장치)
    if (!analysis) {
      analysis = getFallbackAnalysis()
    }
    
    // 카탈로그 ID 검증 (간단 버전 - 존재하는 ID인지만 확인)
    const validatedActions = analysis.actions.filter((action: { id: string; category: string; title: string; description: string; evidenceId?: string }) => {
      // music-XXX 형식인지 확인
      const isValidFormat = /^(music|activity|flower|breathing|writing)-\d+$/.test(action.id)
      if (!isValidFormat) {
        console.warn(`Invalid action ID format: ${action.id}`)
      }
      return isValidFormat
    })
    
    // 검증된 액션이 없으면 fallback
    if (validatedActions.length === 0 && analysis.riskLevel !== 'high') {
      console.warn('No valid actions found, using fallback')
      validatedActions.push({
        id: 'music-001',
        category: 'music',
        title: '에픽하이 - 스물다섯, 스물하나',
        description: '힘든 시기를 지나온 가사가 깊은 위로를 줘요. 느린 템포가 마음을 진정시켜줘요.',
      })
    }
    
    analysis.actions = validatedActions

    // JournalEntry 생성
    // condition은 모든 필드가 있을 때만 포함 (타입 안전성)
    const hasCompleteCondition = validated.condition && 
      validated.condition.sleep && 
      validated.condition.meal && 
      validated.condition.activity

    const entry: JournalEntry = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      text: validated.text,
      condition: hasCompleteCondition ? {
        sleep: validated.condition!.sleep!,
        meal: validated.condition!.meal!,
        activity: validated.condition!.activity!,
      } : undefined,
      tags: validated.tags,
      intensity: validated.intensity,
      analysis,
      completedActions: [],
    }

    // 응답 (클라이언트에서 localStorage에 저장)
    return NextResponse.json({
      id: entry.id,
      entry,
    })

  } catch (error: any) {
    console.error('API Error:', error)

    // Zod 검증 오류
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || '입력이 올바르지 않아요' },
        { status: 400 }
      )
    }

    // Gemini API 오류
    if (error?.status) {
      if (error.status === 401 || error.status === 403) {
        return NextResponse.json(
          { error: 'API 키 설정을 확인해주세요' },
          { status: 401 }
        )
      }
      if (error.status === 404) {
        return NextResponse.json(
          { error: '사용 가능한 Gemini 모델을 찾지 못했어요. 잠시 후 다시 시도해줘.' },
          { status: 502 }
        )
      }
      if (error.status === 429) {
        return NextResponse.json(
          { error: '지금 아띠가 바빠. 잠시 후 다시 시도해줘!' },
          { status: 429 }
        )
      }
    }

    if (error?.message) {
      // Rate limit 오류
      if (error.message.includes('quota') || error.message.includes('rate')) {
        return NextResponse.json(
          { error: '지금 아띠가 바빠. 잠시 후 다시 시도해줘!' },
          { status: 429 }
        )
      }
      
      // API 키 오류
      if (error.message.includes('API key') || error.message.includes('invalid')) {
        return NextResponse.json(
          { error: 'API 키 설정을 확인해주세요' },
          { status: 401 }
        )
      }
    }

    // 일반 오류
    return NextResponse.json(
      { error: '분석 중 문제가 생겼어. 다시 시도해줄래?' },
      { status: 500 }
    )
  }
}
