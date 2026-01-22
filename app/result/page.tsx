'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import type { JournalEntry } from '@/lib/types'
import { getEvidenceDescription } from '@/lib/evidence'
import { getEmotionEmoji, getEmotionColor } from '@/lib/emotions'
import BottomNav from '@/components/BottomNav'

// Suspense fallback 로딩 컴포넌트
function ResultLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent mx-auto mb-3"></div>
        <p className="text-gray-500 text-sm">결과를 불러오는 중...</p>
      </div>
    </div>
  )
}

// 메인 페이지 (Suspense로 래핑)
export default function ResultPage() {
  return (
    <Suspense fallback={<ResultLoading />}>
      <ResultContent />
    </Suspense>
  )
}

// 실제 콘텐츠 컴포넌트
function ResultContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [entry, setEntry] = useState<JournalEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const id = searchParams.get('id')
    if (!id) {
      setError('결과를 찾을 수 없어요')
      setLoading(false)
      return
    }

    // localStorage에서 데이터 가져오기
    try {
      const stored = localStorage.getItem('atti-storage')
      if (stored) {
        const data = JSON.parse(stored)
        const found = data.entries.find((e: JournalEntry) => e.id === id)
        if (found) {
          setEntry(found)
        } else {
          setError('결과를 찾을 수 없어요')
        }
      } else {
        setError('저장된 데이터가 없어요')
      }
    } catch (err) {
      setError('데이터를 불러오는 중 오류가 발생했어요')
    } finally {
      setLoading(false)
    }
  }, [searchParams])

  // riskLevel이 high일 때 Safety 페이지로 자동 리다이렉트
  useEffect(() => {
    if (entry?.analysis?.riskLevel === 'high') {
      router.push('/safety')
    }
  }, [entry, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">결과를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error || !entry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">{error || '결과를 찾을 수 없어요'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            처음으로
          </button>
        </div>
      </div>
    )
  }

  const { analysis } = entry

  return (
    <div className="min-h-screen bg-pastel-gradient pb-20">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100/50 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors mb-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">뒤로</span>
          </button>
          <h1 className="text-xl font-bold text-gray-900">분석 결과</h1>
          <p className="text-sm text-gray-500">
            {new Date(entry.createdAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'short',
            })}
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* 감정 분석 */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-soft">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">감정 분석</h2>
          </div>
          <div className="p-4">
            <div className="flex flex-wrap gap-2">
              {analysis.emotions.map((emotion, index) => {
                const colors = getEmotionColor(emotion.label)
                return (
                  <div
                    key={index}
                    className={`px-3 py-2 ${colors.bg} border ${colors.border} rounded-xl flex items-center gap-2`}
                  >
                    <span className="text-xl">{getEmotionEmoji(emotion.label)}</span>
                    <div>
                      <span className={`font-medium ${colors.text} text-sm`}>
                        {emotion.label}
                      </span>
                      <span className="text-xs text-gray-500 ml-1.5">
                        {Math.round(emotion.score * 100)}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 핵심 요약 */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-soft">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">핵심 요약</h2>
          </div>
          <div className="p-4">
            <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
          </div>
        </div>

        {/* 지금 필요한 것 */}
        <div className="bg-gradient-to-br from-violet-50 to-blue-50 rounded-2xl border border-violet-100 overflow-hidden shadow-soft">
          <div className="px-4 py-3 border-b border-violet-100/50">
            <h2 className="font-semibold text-violet-900">지금 필요한 것</h2>
          </div>
          <div className="p-4">
            <p className="text-violet-800 leading-relaxed">{analysis.needs}</p>
          </div>
        </div>

        {/* 아띠의 한마디 */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-soft">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">아띠의 한마디</h2>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">공감</p>
              <p className="text-gray-700 leading-relaxed">{analysis.response.empathy}</p>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">조언</p>
              <p className="text-gray-700 leading-relaxed">{analysis.response.advice}</p>
            </div>
          </div>
        </div>

        {/* 추천 행동 */}
        {analysis.actions.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-soft">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">지금 해보면 좋을 것</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {analysis.actions.map((action) => (
                <div key={action.id} className="p-4">
                  <div className="flex items-start gap-3">
                    {/* 카테고리 아이콘 */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      action.category === 'music' ? 'bg-purple-100' :
                      action.category === 'flower' ? 'bg-pink-100' :
                      action.category === 'activity' ? 'bg-green-100' :
                      action.category === 'breathing' ? 'bg-cyan-100' :
                      'bg-amber-100'
                    }`}>
                      <span className="text-lg">
                        {action.category === 'music' && '🎵'}
                        {action.category === 'flower' && '🌸'}
                        {action.category === 'activity' && '🏃'}
                        {action.category === 'breathing' && '🌬️'}
                        {action.category === 'writing' && '✏️'}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-400 uppercase">
                          {action.category === 'music' && '음악'}
                          {action.category === 'flower' && '꽃'}
                          {action.category === 'activity' && '활동'}
                          {action.category === 'breathing' && '호흡'}
                          {action.category === 'writing' && '쓰기'}
                        </span>
                      </div>
                      <h3 className="font-medium text-gray-800 mb-1">{action.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{action.description}</p>
                      
                      {/* 추천 근거 */}
                      {action.evidenceId && getEvidenceDescription(action.evidenceId) && (
                        <p className="text-xs text-blue-600 mt-2 flex items-start gap-1">
                          <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          <span>{getEvidenceDescription(action.evidenceId)}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 안전 안내 (위험 레벨에 따라 표시) */}
        {analysis.riskLevel === 'medium' && (
          <div className="bg-yellow-50 rounded-2xl border border-yellow-100 p-4">
            <p className="text-sm text-yellow-800">
              마음이 조금 무거울 수 있어. 괜찮아질 거야.
            </p>
          </div>
        )}

        {/* 버튼들 */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => router.push('/history')}
            className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
          >
            기록 보기
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            새 일기
          </button>
        </div>

        {/* 면책 문구 */}
        <p className="text-xs text-center text-gray-400 pt-2">
          이 앱은 의료적 진단이나 치료를 대신하지 않아요.
        </p>
      </main>

      <BottomNav />
    </div>
  )
}
