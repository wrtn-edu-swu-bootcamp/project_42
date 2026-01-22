'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { validateDiaryText, validateTags, getErrorMessage, INPUT_LIMITS } from '@/lib/validation'
import BottomNav from '@/components/BottomNav'

// 레이트 리밋 간격 (밀리초)
const RATE_LIMIT_MS = 5000

export default function Home() {
  const router = useRouter()
  const [text, setText] = useState('')
  const [intensity, setIntensity] = useState<number | undefined>(undefined)
  const [condition, setCondition] = useState<{
    sleep?: 'bad' | 'normal' | 'good'
    meal?: 'skipped' | 'light' | 'normal' | 'heavy'
    activity?: 'none' | 'light' | 'moderate' | 'intense'
  }>({})
  const [tags, setTags] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  
  // 클라이언트 레이트 리밋을 위한 마지막 요청 시간
  const lastSubmitTimeRef = useRef<number>(0)

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setError('')

    // 클라이언트 레이트 리밋 체크
    const now = Date.now()
    const timeSinceLastSubmit = now - lastSubmitTimeRef.current
    if (timeSinceLastSubmit < RATE_LIMIT_MS && lastSubmitTimeRef.current !== 0) {
      const remainingSeconds = Math.ceil((RATE_LIMIT_MS - timeSinceLastSubmit) / 1000)
      setError(`잠깐만! ${remainingSeconds}초 후에 다시 시도해줘`)
      return
    }

    // 1. 일기 텍스트 검증
    const textValidation = validateDiaryText(text)
    if (!textValidation.valid) {
      setError(textValidation.error || '입력을 확인해줘')
      return
    }

    // 2. 태그 검증 (선택사항이므로 입력이 있을 때만)
    if (tags.trim()) {
      const tagsValidation = validateTags(tags)
      if (!tagsValidation.valid) {
        setError(tagsValidation.error || '태그를 확인해줘')
        return
      }
    }

    setIsLoading(true)
    lastSubmitTimeRef.current = Date.now()

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          intensity,
          condition: Object.keys(condition).length > 0 ? condition : undefined,
          tags: tags.trim() ? tags.split(/\s+/).filter(tag => tag.startsWith('#')) : undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        setError(getErrorMessage(errorData, response.status))
        return
      }

      const result = await response.json()
      
      // localStorage에 저장
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('atti-storage')
        const data = stored ? JSON.parse(stored) : {
          version: '1.0.0',
          entries: [],
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
        }
        
        data.entries.unshift(result.entry)
        data.lastModified = new Date().toISOString()
        localStorage.setItem('atti-storage', JSON.stringify(data))
      }
      
      // Result 화면으로 이동
      router.push(`/result?id=${result.id}`)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-pastel-gradient pb-20">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100/50 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900">아띠</h1>
            <img 
              src="/atti/atti 이미지.png" 
              alt="아띠 캐릭터" 
              className="w-8 h-8 object-contain"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          </div>
          <p className="text-sm text-gray-500">오늘 마음은 어때?</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4">
        {/* 일기 입력 카드 */}
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* 텍스트 입력 */}
            <div className="p-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="오늘 있었던 일, 느낀 감정을 자유롭게 써봐..."
                className="w-full h-40 resize-none border-0 focus:ring-0 text-gray-700 placeholder-gray-400 text-base leading-relaxed"
                disabled={isLoading}
                maxLength={INPUT_LIMITS.MAX_LENGTH}
              />
            </div>

            {/* 글자수 안내 */}
            <div className="px-4 pb-3">
              {/* 안내 문구 */}
              <div className={`text-xs mb-2 p-2 rounded-lg ${
                text.length < INPUT_LIMITS.MIN_LENGTH 
                  ? 'bg-amber-50 text-amber-600' 
                  : 'bg-green-50 text-green-600'
              }`}>
                {text.length < INPUT_LIMITS.MIN_LENGTH ? (
                  <span>
                    💡 아띠가 마음을 정확히 이해하려면 <strong>{INPUT_LIMITS.MIN_LENGTH}자 이상</strong> 써줘야 해!
                    {text.length > 0 && ` (${INPUT_LIMITS.MIN_LENGTH - text.length}자 더 필요해)`}
                  </span>
                ) : (
                  <span>✨ 좋아! 아띠가 마음을 읽을 준비가 됐어</span>
                )}
              </div>
              
              {/* 글자수 표시 */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">
                  감정 분석을 위해 최소 {INPUT_LIMITS.MIN_LENGTH}자
                </span>
                <span className={`font-medium ${
                  text.length < INPUT_LIMITS.MIN_LENGTH 
                    ? 'text-amber-500' 
                    : text.length > INPUT_LIMITS.MAX_LENGTH - 100
                    ? 'text-orange-500'
                    : 'text-green-500'
                }`}>
                  {text.length} / {INPUT_LIMITS.MAX_LENGTH}
                </span>
              </div>
            </div>

            {/* 구분선 */}
            <div className="border-t border-gray-100" />

            {/* 추가 옵션 토글 */}
            <button
              type="button"
              onClick={() => setShowOptions(!showOptions)}
              className="w-full px-4 py-3 flex items-center justify-between text-sm text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <span>추가 정보 입력 (선택)</span>
              <svg 
                className={`w-5 h-5 transition-transform ${showOptions ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* 추가 옵션 패널 */}
            {showOptions && (
              <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
                {/* 감정 강도 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    감정 강도
                  </label>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setIntensity(intensity === level ? undefined : level)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          intensity === level
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        disabled={isLoading}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5 text-center">
                    0 (약함) ~ 5 (매우 강함)
                  </p>
                </div>

                {/* 컨디션 */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      수면
                    </label>
                    <select
                      value={condition.sleep || ''}
                      onChange={(e) => setCondition({ ...condition, sleep: e.target.value as any || undefined })}
                      className="w-full px-3 py-2.5 bg-gray-100 border-0 rounded-xl text-sm text-gray-700 focus:ring-2 focus:ring-blue-500"
                      disabled={isLoading}
                    >
                      <option value="">-</option>
                      <option value="bad">나쁨</option>
                      <option value="normal">보통</option>
                      <option value="good">좋음</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      식사
                    </label>
                    <select
                      value={condition.meal || ''}
                      onChange={(e) => setCondition({ ...condition, meal: e.target.value as any || undefined })}
                      className="w-full px-3 py-2.5 bg-gray-100 border-0 rounded-xl text-sm text-gray-700 focus:ring-2 focus:ring-blue-500"
                      disabled={isLoading}
                    >
                      <option value="">-</option>
                      <option value="skipped">거름</option>
                      <option value="light">가벼움</option>
                      <option value="normal">보통</option>
                      <option value="heavy">든든함</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      활동
                    </label>
                    <select
                      value={condition.activity || ''}
                      onChange={(e) => setCondition({ ...condition, activity: e.target.value as any || undefined })}
                      className="w-full px-3 py-2.5 bg-gray-100 border-0 rounded-xl text-sm text-gray-700 focus:ring-2 focus:ring-blue-500"
                      disabled={isLoading}
                    >
                      <option value="">-</option>
                      <option value="none">없음</option>
                      <option value="light">가벼움</option>
                      <option value="moderate">보통</option>
                      <option value="intense">강함</option>
                    </select>
                  </div>
                </div>

                {/* 태그 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    태그
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="#학교 #친구 #직장"
                    className="w-full px-4 py-2.5 bg-gray-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {/* 오류 메시지 */}
            {error && (
              <div className="mx-4 mb-4 p-3 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-sm text-red-600">{error}</p>
                {!error.includes('초 후에') && (
                  <button
                    type="button"
                    onClick={() => handleSubmit()}
                    className="mt-2 text-sm text-blue-600 font-medium hover:underline"
                    disabled={isLoading}
                  >
                    다시 시도
                  </button>
                )}
              </div>
            )}

            {/* 제출 버튼 */}
            <div className="p-4 pt-0">
              <button
                type="submit"
                disabled={isLoading || text.length < INPUT_LIMITS.MIN_LENGTH}
                className="w-full py-3.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    분석 중...
                  </span>
                ) : '아띠에게 보내기'}
              </button>
            </div>
          </form>
        </div>

        {/* 안내 */}
        <p className="text-xs text-center text-gray-400 mt-4">
          추가 정보는 선택이야. 안 적어도 괜찮아.
        </p>
      </main>

      <BottomNav />
    </div>
  )
}
