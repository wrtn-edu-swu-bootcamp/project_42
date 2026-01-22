/**
 * 감정 라벨에 대응하는 이모지 매핑
 */

export const EMOTION_EMOJI: Record<string, string> = {
  // 긍정 감정
  joy: '😊',
  excited: '🤩',
  calm: '😌',
  gratitude: '🙏',
  hopeful: '🌟',
  proud: '😤',
  content: '☺️',
  relaxed: '😮‍💨',
  peaceful: '🕊️',
  satisfied: '😋',
  loved: '🥰',
  confident: '💪',
  
  // 부정 감정 - 슬픔
  sad: '😢',
  lonely: '🥺',
  depressed: '😞',
  helpless: '😔',
  disappointed: '😕',
  hurt: '💔',
  
  // 부정 감정 - 불안
  anxiety: '😰',
  nervous: '😬',
  worried: '😟',
  scared: '😨',
  overwhelmed: '🤯',
  stressed: '😫',
  
  // 부정 감정 - 분노
  anger: '😠',
  irritated: '😒',
  frustrated: '😤',
  resentful: '😑',
  betrayed: '🫤',
  jealous: '😒',
  
  // 중립/복합 감정
  numb: '😶',
  confused: '😵‍💫',
  embarrassed: '😳',
  guilty: '😣',
  ashamed: '🫣',
  bored: '😑',
  tired: '😴',
  uncertain: '🤔',
  ambivalent: '😐',
}

/**
 * 감정 라벨에 해당하는 이모지를 반환
 */
export function getEmotionEmoji(label: string): string {
  return EMOTION_EMOJI[label.toLowerCase()] || '💭'
}

/**
 * 감정 카테고리별 배경색 (파스텔톤)
 */
export function getEmotionColor(label: string): { bg: string; text: string; border: string } {
  const lowerLabel = label.toLowerCase()
  
  // 긍정 감정 - 노란색/초록색 계열
  if (['joy', 'excited', 'hopeful', 'proud', 'confident'].includes(lowerLabel)) {
    return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' }
  }
  if (['calm', 'relaxed', 'peaceful', 'content', 'satisfied'].includes(lowerLabel)) {
    return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' }
  }
  if (['gratitude', 'loved'].includes(lowerLabel)) {
    return { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' }
  }
  
  // 부정 감정 - 슬픔 (파란색 계열)
  if (['sad', 'lonely', 'depressed', 'helpless', 'disappointed', 'hurt'].includes(lowerLabel)) {
    return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' }
  }
  
  // 부정 감정 - 불안 (보라색 계열)
  if (['anxiety', 'nervous', 'worried', 'scared', 'overwhelmed', 'stressed'].includes(lowerLabel)) {
    return { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' }
  }
  
  // 부정 감정 - 분노 (빨간색 계열)
  if (['anger', 'irritated', 'frustrated', 'resentful', 'betrayed', 'jealous'].includes(lowerLabel)) {
    return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' }
  }
  
  // 중립/복합 감정 (회색 계열)
  return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' }
}
