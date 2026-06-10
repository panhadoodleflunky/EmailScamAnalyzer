import type { HistoryItem } from '../models/scam'

const HISTORY_STORAGE_KEY = 'scamDetectorHistory'

export function loadHistoryFromStorage(): HistoryItem[] {
  try {
    const saved = localStorage.getItem(HISTORY_STORAGE_KEY)
    return saved ? (JSON.parse(saved) as HistoryItem[]) : []
  } catch (error) {
    console.error('Failed to load history from localStorage:', error)
    return []
  }
}

export function saveHistoryToStorage(items: HistoryItem[]): void {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('Failed to save history to localStorage:', error)
  }
}
