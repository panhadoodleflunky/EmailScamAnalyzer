import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'
import { useI18n } from '../localization/i18nContext'
import {
  normalizeLikelihood,
  SAMPLE_EMAIL,
  type HistoryItem,
  type ScamAnalysis,
} from '../models/scam'
import { analyseText } from '../services/restService'
import { loadHistoryFromStorage, saveHistoryToStorage } from '../services/storageService'
import { MainView } from './views/MainView'

function App() {
  const { t } = useI18n()
  const [text, setText] = useState('')
  const [analysis, setAnalysis] = useState<ScamAnalysis | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>(loadHistoryFromStorage)
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null)
  const [compareId, setCompareId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canAnalyse = text.trim().length > 0 && !isLoading

  const normalizedLikelihood = useMemo(() => {
    if (!analysis) {
      return 0
    }

    return normalizeLikelihood(analysis.likelihood)
  }, [analysis])

  const comparisonCandidates = useMemo(
    () => history.filter((entry) => entry.id !== currentAnalysisId),
    [history, currentAnalysisId],
  )

  const comparedEntry = useMemo(() => {
    if (comparisonCandidates.length === 0) {
      return null
    }

    return (
      comparisonCandidates.find((entry) => entry.id === compareId) ??
      comparisonCandidates[0]
    )
  }, [comparisonCandidates, compareId])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const nextAnalysis = await analyseText(text)

      const nextItem: HistoryItem = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        sourceText: text.trim(),
        analysis: nextAnalysis,
      }

      const nextHistory = [nextItem, ...history].slice(0, 15)
      const nextCompare = nextHistory.find((entry) => entry.id !== nextItem.id)

      setAnalysis(nextAnalysis)
      setCurrentAnalysisId(nextItem.id)
      setHistory(nextHistory)
      setCompareId(nextCompare ? nextCompare.id : null)
      saveHistoryToStorage(nextHistory)
    } catch (requestError) {
      if (requestError instanceof Error) {
        const message =
          requestError.message === 'ANALYSIS_SERVICE_ERROR'
            ? t('errors.analysisServiceUnexpected')
            : requestError.message
        setError(message)
      } else {
        setError(t('errors.unableToAnalyse'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  function useSampleEmail() {
    setText(SAMPLE_EMAIL)
    setError(null)
  }

  function clearText() {
    setText('')
    setError(null)
  }

  function loadHistoryItem(item: HistoryItem) {
    setText(item.sourceText)
    setAnalysis(item.analysis)
    setCurrentAnalysisId(item.id)

    const nextCompare = history.find((entry) => entry.id !== item.id)
    setCompareId(nextCompare ? nextCompare.id : null)
  }

  function clearHistory() {
    setHistory([])
    setCompareId(null)
    setCurrentAnalysisId(null)
    saveHistoryToStorage([])
  }

  return (
    <MainView
      text={text}
      analysis={analysis}
      history={history}
      normalizedLikelihood={normalizedLikelihood}
      comparedEntry={comparedEntry}
      comparisonCandidates={comparisonCandidates}
      canAnalyse={canAnalyse}
      isLoading={isLoading}
      error={error}
      onTextChange={setText}
      onSubmit={onSubmit}
      onUseSample={useSampleEmail}
      onClearText={clearText}
      onCompareChange={setCompareId}
      onClearHistory={clearHistory}
      onLoadHistoryItem={loadHistoryItem}
    />
  )
}

export default App
