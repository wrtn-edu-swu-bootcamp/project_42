import type { StorageData, JournalEntry } from './types'

const STORAGE_KEY = 'atti-storage'
const STORAGE_VERSION = '1.0.0'

/**
 * localStorage에서 데이터 불러오기
 */
export function loadStorage(): StorageData {
  if (typeof window === 'undefined') {
    // 서버 사이드에서는 빈 데이터 반환
    return {
      version: STORAGE_VERSION,
      entries: [],
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      // 최초 생성
      const initial: StorageData = {
        version: STORAGE_VERSION,
        entries: [],
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      }
      saveStorage(initial)
      return initial
    }

    const data: StorageData = JSON.parse(stored)
    
    // 버전 호환성 체크 (추후 마이그레이션 로직 추가 가능)
    if (data.version !== STORAGE_VERSION) {
      console.warn('Storage version mismatch. Migration may be needed.')
    }

    return data
  } catch (error) {
    console.error('Failed to load storage:', error)
    // 손상된 데이터면 초기화
    return {
      version: STORAGE_VERSION,
      entries: [],
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    }
  }
}

/**
 * localStorage에 데이터 저장
 */
export function saveStorage(data: StorageData): void {
  if (typeof window === 'undefined') return

  try {
    data.lastModified = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save storage:', error)
    throw new Error('저장에 실패했어요')
  }
}

/**
 * 새 일기 항목 추가
 */
export function addEntry(entry: JournalEntry): void {
  const data = loadStorage()
  data.entries.unshift(entry) // 최신 항목을 앞에 추가
  saveStorage(data)
}

/**
 * 특정 일기 항목 조회
 */
export function getEntry(id: string): JournalEntry | null {
  const data = loadStorage()
  return data.entries.find(e => e.id === id) || null
}

/**
 * 모든 일기 항목 조회
 */
export function getAllEntries(): JournalEntry[] {
  const data = loadStorage()
  return data.entries
}

/**
 * 최근 N일간의 항목 조회
 */
export function getRecentEntries(days: number = 7): JournalEntry[] {
  const data = loadStorage()
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  
  return data.entries.filter(entry => {
    const entryDate = new Date(entry.createdAt)
    return entryDate >= cutoff
  })
}

/**
 * 일기 항목 업데이트
 */
export function updateEntry(id: string, updates: Partial<JournalEntry>): void {
  const data = loadStorage()
  const index = data.entries.findIndex(e => e.id === id)
  
  if (index === -1) {
    throw new Error('항목을 찾을 수 없어요')
  }
  
  data.entries[index] = { ...data.entries[index], ...updates }
  saveStorage(data)
}

/**
 * 일기 항목 삭제
 */
export function deleteEntry(id: string): void {
  const data = loadStorage()
  data.entries = data.entries.filter(e => e.id !== id)
  saveStorage(data)
}

/**
 * 전체 데이터 초기화 (주의: 복구 불가)
 */
export function clearAllData(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * 데이터 백업 (JSON 파일로 다운로드)
 */
export function exportData(): string {
  const data = loadStorage()
  return JSON.stringify(data, null, 2)
}

/**
 * 데이터 복원 (JSON 파일에서)
 * @returns 성공 시 true, 실패 시 false
 */
export function importData(jsonString: string): boolean {
  try {
    const data: StorageData = JSON.parse(jsonString)
    
    // 기본 구조 검증
    if (!data.version || !Array.isArray(data.entries)) {
      throw new Error('Invalid data format')
    }
    
    saveStorage(data)
    return true
  } catch (error) {
    console.error('Failed to import data:', error)
    return false
  }
}
