'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, subDays, startOfDay } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { JournalEntry } from '@/lib/types'
import BottomNav from '@/components/BottomNav'
import { getEmotionEmoji, getEmotionColor } from '@/lib/emotions'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function HistoryPage() {
  const router = useRouter()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('atti-storage')
      if (stored) {
        const data = JSON.parse(stored)
        setEntries(data.entries || [])
      }
    } catch (error) {
      console.error('Failed to load history:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // 특정 날짜의 일기 목록 가져오기
  const getEntriesForDate = (date: Date) => {
    return entries.filter(entry => 
      isSameDay(new Date(entry.createdAt), date)
    )
  }

  // 선택된 날짜의 일기들
  const selectedDateEntries = selectedDate ? getEntriesForDate(selectedDate) : []

  // 7일 감정 트렌드 데이터 생성
  const get7DayTrendData = () => {
    const today = startOfDay(new Date())
    const sevenDaysAgo = subDays(today, 6)
    
    const trendData = []
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i)
      const dayEntries = entries.filter(entry => 
        isSameDay(new Date(entry.createdAt), date)
      )
      
      // 해당 날짜의 모든 감정 점수 평균 계산
      let totalScore = 0
      let emotionCount = 0
      let dominantEmotion = ''
      let maxScore = 0
      
      dayEntries.forEach(entry => {
        entry.analysis.emotions.forEach(emotion => {
          totalScore += emotion.score
          emotionCount++
          if (emotion.score > maxScore) {
            maxScore = emotion.score
            dominantEmotion = emotion.label
          }
        })
      })
      
      const avgScore = emotionCount > 0 ? totalScore / emotionCount : 0
      
      // 감정 카테고리별 점수 계산 (긍정/부정/중립)
      let positiveScore = 0
      let negativeScore = 0
      let neutralScore = 0
      
      dayEntries.forEach(entry => {
        entry.analysis.emotions.forEach(emotion => {
          const label = emotion.label.toLowerCase()
          if (['joy', 'excited', 'calm', 'gratitude', 'hopeful', 'proud', 'content', 'relaxed', 'peaceful', 'satisfied', 'loved', 'confident'].includes(label)) {
            positiveScore += emotion.score
          } else if (['sad', 'lonely', 'depressed', 'helpless', 'disappointed', 'hurt', 'anxiety', 'nervous', 'worried', 'scared', 'overwhelmed', 'stressed', 'anger', 'irritated', 'frustrated', 'resentful', 'betrayed', 'jealous'].includes(label)) {
            negativeScore += emotion.score
          } else {
            neutralScore += emotion.score
          }
        })
      })
      
      trendData.push({
        date: format(date, 'M/d'),
        dateFull: format(date, 'yyyy-MM-dd'),
        dayName: format(date, 'EEE', { locale: ko }),
        avgScore: Math.round(avgScore * 100) / 100,
        positiveScore: Math.round(positiveScore * 100) / 100,
        negativeScore: Math.round(negativeScore * 100) / 100,
        neutralScore: Math.round(neutralScore * 100) / 100,
        dominantEmotion,
        entryCount: dayEntries.length
      })
    }
    
    return trendData
  }

  const trendData = get7DayTrendData()

  // 캘린더 날짜 생성
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  // 이전/다음 달 이동
  const goToPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const goToToday = () => {
    setCurrentMonth(new Date())
    setSelectedDate(new Date())
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-700 border-t-transparent mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">기록을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pastel-gradient pb-20">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100/50 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">마음 기록</h1>
              <p className="text-sm text-gray-500">총 {entries.length}개의 일기</p>
            </div>
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-sm font-medium text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
            >
              오늘
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4">
        {/* 7일 감정 트렌드 차트 */}
        {entries.length > 0 && (
          <div className="bg-white rounded-2xl shadow-soft border border-gray-100 mb-4 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">최근 7일 감정 트렌드</h2>
              <p className="text-xs text-gray-500 mt-1">일주일간의 감정 변화를 확인해봐</p>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickLine={{ stroke: '#e5e7eb' }}
                    domain={[0, 1]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '8px 12px'
                    }}
                    formatter={(value: number | undefined, name: string) => {
                      if (value === undefined) return ['0%', name]
                      if (name === 'positiveScore') return [`${(value * 100).toFixed(0)}%`, '긍정']
                      if (name === 'negativeScore') return [`${(value * 100).toFixed(0)}%`, '부정']
                      if (name === 'neutralScore') return [`${(value * 100).toFixed(0)}%`, '중립']
                      return [value.toString(), name]
                    }}
                    labelFormatter={(label) => {
                      const data = trendData.find(d => d.date === label)
                      return data ? `${data.dayName} ${data.date}` : label
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                    formatter={(value) => {
                      if (value === 'positiveScore') return '긍정'
                      if (value === 'negativeScore') return '부정'
                      if (value === 'neutralScore') return '중립'
                      return value
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="positiveScore" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b', r: 4 }}
                    name="긍정"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="negativeScore" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={{ fill: '#ef4444', r: 4 }}
                    name="부정"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="neutralScore" 
                    stroke="#94a3b8" 
                    strokeWidth={2}
                    dot={{ fill: '#94a3b8', r: 4 }}
                    name="중립"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 월간 캘린더 */}
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 mb-4 overflow-hidden">
          {/* 월 네비게이션 */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <button
              onClick={goToPrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              {format(currentMonth, 'yyyy년 M월', { locale: ko })}
            </h2>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 border-b border-gray-100">
            {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
              <div
                key={day}
                className={`py-2 text-center text-xs font-medium ${
                  index === 0 ? 'text-red-400' : index === 6 ? 'text-blue-400' : 'text-gray-500'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              const dayEntries = getEntriesForDate(day)
              const hasEntry = dayEntries.length > 0
              const isCurrentMonth = isSameMonth(day, currentMonth)
              const isToday = isSameDay(day, new Date())
              const isSelected = selectedDate && isSameDay(day, selectedDate)
              const dayOfWeek = day.getDay()

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    relative aspect-square flex flex-col items-center justify-center
                    border-b border-r border-gray-50 transition-all
                    ${!isCurrentMonth ? 'opacity-30' : ''}
                    ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}
                  `}
                >
                  {/* 날짜 숫자 */}
                  <span className={`
                    text-sm font-medium
                    ${isToday ? 'w-7 h-7 bg-amber-700 text-white rounded-full flex items-center justify-center' : ''}
                    ${!isToday && dayOfWeek === 0 ? 'text-red-400' : ''}
                    ${!isToday && dayOfWeek === 6 ? 'text-blue-400' : ''}
                    ${!isToday && dayOfWeek !== 0 && dayOfWeek !== 6 ? 'text-gray-700' : ''}
                  `}>
                    {format(day, 'd')}
                  </span>
                  
                  {/* 일기 있음 표시 */}
                  {hasEntry && isCurrentMonth && (
                    <div className="absolute bottom-1 flex gap-0.5">
                      {dayEntries.length <= 3 ? (
                        dayEntries.map((_, i) => (
                          <div key={i} className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
                        ))
                      ) : (
                        <>
                          <div className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
                          <div className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
                          <span className="text-[10px] text-amber-600 font-medium">+{dayEntries.length - 2}</span>
                        </>
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* 선택된 날짜의 일기 목록 */}
        {selectedDate && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3 px-1">
              {format(selectedDate, 'M월 d일 (EEEE)', { locale: ko })}
              {selectedDateEntries.length > 0 && (
                <span className="ml-2 text-amber-700">{selectedDateEntries.length}개의 기록</span>
              )}
            </h3>

            {selectedDateEntries.length === 0 ? (
              <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
                <p className="text-gray-400 text-sm mb-3">이 날은 기록이 없어</p>
                <button
                  onClick={() => router.push('/')}
                  className="text-sm text-amber-700 font-medium hover:underline"
                >
                  지금 일기 쓰러가기
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateEntries.map((entry) => (
                  <div
                    key={entry.id}
                    onClick={() => router.push(`/result?id=${entry.id}`)}
                    className="bg-white rounded-xl p-4 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 mb-1">
                          {format(new Date(entry.createdAt), 'a h:mm', { locale: ko })}
                        </p>
                        <p className="text-gray-700 text-sm line-clamp-2 mb-2">
                          {entry.text}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {entry.analysis.emotions.slice(0, 3).map((emotion, index) => {
                            const colors = getEmotionColor(emotion.label)
                            return (
                              <span
                                key={index}
                                className={`px-2 py-0.5 ${colors.bg} ${colors.text} text-xs rounded-md flex items-center gap-1`}
                              >
                                <span>{getEmotionEmoji(emotion.label)}</span>
                                <span>{emotion.label}</span>
                              </span>
                            )
                          })}
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 전체 일기 목록 (선택된 날짜가 없을 때) */}
        {!selectedDate && entries.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3 px-1">최근 기록</h3>
            <div className="space-y-3">
              {entries.slice(0, 10).map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => router.push(`/result?id=${entry.id}`)}
                  className="bg-white rounded-xl p-4 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 mb-1">
                        {format(new Date(entry.createdAt), 'M월 d일 (EEE) a h:mm', { locale: ko })}
                      </p>
                      <p className="text-gray-700 text-sm line-clamp-2 mb-2">
                        {entry.text}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {entry.analysis.emotions.slice(0, 3).map((emotion, index) => {
                          const colors = getEmotionColor(emotion.label)
                          return (
                            <span
                              key={index}
                              className={`px-2 py-0.5 ${colors.bg} ${colors.text} text-xs rounded-md flex items-center gap-1`}
                            >
                              <span>{getEmotionEmoji(emotion.label)}</span>
                              <span>{emotion.label}</span>
                            </span>
                          )
                        })}
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 빈 상태 */}
        {entries.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">아직 기록이 없어</h3>
            <p className="text-sm text-gray-500 mb-4">첫 일기를 써볼까?</p>
            <button
              onClick={() => router.push('/')}
              className="px-5 py-2.5 bg-amber-700 text-white text-sm font-medium rounded-xl hover:bg-amber-800 transition-colors"
            >
              일기 쓰러가기
            </button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
