'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { exportData, importData, clearAllData } from '@/lib/storage'
import BottomNav from '@/components/BottomNav'

export default function SettingsPage() {
  const router = useRouter()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // 데이터 백업 (JSON 다운로드)
  const handleBackup = () => {
    try {
      const jsonData = exportData()
      const blob = new Blob([jsonData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `atti-backup-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      
      setMessage({ type: 'success', text: '백업 파일이 다운로드됐어' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: '백업에 실패했어. 다시 시도해줘' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  // 데이터 복원 (JSON 업로드)
  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const jsonData = event.target?.result as string
        const success = importData(jsonData)
        
        if (success) {
          setMessage({ type: 'success', text: '복원 완료! 새로고침할게' })
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        } else {
          throw new Error('Invalid data')
        }
      } catch (error) {
        setMessage({ type: 'error', text: '파일 형식이 올바르지 않아' })
        setTimeout(() => setMessage(null), 3000)
      }
    }
    reader.readAsText(file)
  }

  // 데이터 전체 삭제
  const handleDelete = () => {
    try {
      clearAllData()
      setShowDeleteModal(false)
      setMessage({ type: 'success', text: '모든 데이터가 삭제됐어' })
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } catch (error) {
      setMessage({ type: 'error', text: '삭제에 실패했어. 다시 시도해줘' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-pastel-gradient pb-20">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100/50 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">설정</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* 알림 메시지 */}
        {message && (
          <div className={`p-4 rounded-xl border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-100 text-green-700' 
              : 'bg-red-50 border-red-100 text-red-700'
          }`}>
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        {/* 데이터 관리 */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-soft">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">데이터 관리</h2>
          </div>
          
          <div className="divide-y divide-gray-100">
            {/* 백업 */}
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">데이터 백업</p>
                <p className="text-sm text-gray-500">모든 일기를 파일로 저장해</p>
              </div>
              <button
                onClick={handleBackup}
                className="px-4 py-2 bg-amber-700 text-white text-sm font-medium rounded-xl hover:bg-amber-800 transition-colors"
              >
                백업
              </button>
            </div>

            {/* 복원 */}
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">데이터 복원</p>
                <p className="text-sm text-gray-500">백업 파일에서 불러와</p>
              </div>
              <label className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors cursor-pointer">
                복원
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestore}
                  className="hidden"
                />
              </label>
            </div>

            {/* 초기화 */}
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-red-600">모든 데이터 삭제</p>
                <p className="text-sm text-gray-500">복구할 수 없어, 신중하게!</p>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-xl hover:bg-red-100 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>

        {/* 앱 정보 */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-soft">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">앱 정보</h2>
          </div>
          <div className="p-4 space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>버전</span>
              <span className="text-gray-900">0.1.0 (MVP)</span>
            </div>
            <div className="flex justify-between">
              <span>AI</span>
              <span className="text-gray-900">Google Gemini</span>
            </div>
            <div className="flex justify-between">
              <span>저장</span>
              <span className="text-gray-900">로컬 (브라우저)</span>
            </div>
          </div>
        </div>

        {/* 개인정보 처리방침 */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-soft">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">개인정보 처리방침</h2>
          </div>
          <div className="p-4 space-y-3 text-sm text-gray-600">
            <p>
              <span className="font-medium text-gray-800">로컬 저장:</span> 모든 일기는 브라우저(localStorage)에만 저장돼. 서버에는 전송되지 않아.
            </p>
            <p>
              <span className="font-medium text-gray-800">AI 분석:</span> 일기 내용은 감정 분석을 위해 Google Gemini API로 전송돼. 분석 후 즉시 폐기되고 저장되지 않아.
            </p>
            <p>
              <span className="font-medium text-gray-800">데이터 보호:</span> API 키는 서버에서만 사용돼. 브라우저에 노출되지 않아.
            </p>
          </div>
        </div>

        {/* 면책 문구 */}
        <div className="w-full bg-yellow-50 rounded-2xl border border-yellow-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-yellow-100">
            <h2 className="font-semibold text-yellow-800">면책 문구</h2>
          </div>
          <div className="p-4 space-y-3 text-sm text-yellow-800">
            <p>
              이 앱은 <strong>감정 기록 및 자기 성찰을 돕는 도구</strong>야. 의료적 진단, 치료, 상담을 대신하지 않아.
            </p>
            <button
              onClick={() => router.push('/safety')}
              className="inline-block px-3 py-1.5 bg-yellow-200 hover:bg-yellow-300 text-yellow-800 font-medium rounded-lg transition-colors"
            >
              도움받을 수 있는 곳
            </button>
          </div>
        </div>
      </main>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              정말 삭제할래?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              모든 일기와 분석 결과가 영구히 삭제돼. 복구할 수 없어.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
