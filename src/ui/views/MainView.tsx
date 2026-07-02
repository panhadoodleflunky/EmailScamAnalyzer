import type { FormEvent } from 'react'
import { AnalysisComparison } from '../components/AnalysisComparison'
import { AnalysisForm } from '../components/AnalysisForm'
import { AnalysisHistory } from '../components/AnalysisHistory'
import { AnalysisResult } from '../components/AnalysisResult'
import { useI18n } from '../../localization/i18nContext'
import type { HistoryItem, ScamAnalysis } from '../../models/scam'

type MainViewProps = {
  text: string
  analysis: ScamAnalysis | null
  history: HistoryItem[]
  normalizedLikelihood: number
  comparedEntry: HistoryItem | null
  comparisonCandidates: HistoryItem[]
  canAnalyse: boolean
  isLoading: boolean
  error: string | null
  isDark: boolean
  onToggleTheme: () => void
  onTextChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onUseSample: () => void
  onClearText: () => void
  onCompareChange: (value: string) => void
  onClearHistory: () => void
  onLoadHistoryItem: (item: HistoryItem) => void
}

export function MainView({
  text,
  analysis,
  history,
  normalizedLikelihood,
  comparedEntry,
  comparisonCandidates,
  canAnalyse,
  isLoading,
  error,
  isDark,
  onToggleTheme,
  onTextChange,
  onSubmit,
  onUseSample,
  onClearText,
  onCompareChange,
  onClearHistory,
  onLoadHistoryItem,
}: MainViewProps) {
  const { t, locale, availableLocales, setLocale } = useI18n()

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <ShieldIcon />
          </span>
          <span className="brand-name">{t('app.eyebrow')}</span>
        </div>

        <div className="topbar-controls">
          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          <label className="language-control" htmlFor="locale-select">
            <span className="sr-only">{t('app.language')}</span>
            <GlobeIcon />
            <select
              id="locale-select"
              value={locale}
              onChange={(event) => setLocale(event.target.value as typeof locale)}
            >
              {availableLocales.map((availableLocale) => (
                <option key={availableLocale} value={availableLocale}>
                  {availableLocale.toUpperCase()}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <main className="page-main">
        <section className="hero">
          <h1>{t('app.title')}</h1>
          <p className="intro">{t('app.intro')}</p>
          <p className="privacy-pill">
            <LockIcon />
            {t('app.badge.private')}
          </p>
        </section>

        <section className="panel" aria-label={t('form.emailTextLabel')}>
          <AnalysisForm
            text={text}
            canAnalyse={canAnalyse}
            isLoading={isLoading}
            onTextChange={onTextChange}
            onSubmit={onSubmit}
            onUseSample={onUseSample}
            onClearText={onClearText}
          />

          {error ? (
            <p className="error" role="alert">
              <WarningIcon />
              {error}
            </p>
          ) : null}
        </section>

        {isLoading ? <ResultSkeleton /> : null}

        {!isLoading && analysis ? (
          <AnalysisResult
            analysis={analysis}
            normalizedLikelihood={normalizedLikelihood}
          />
        ) : null}

        {!isLoading && analysis && comparedEntry ? (
          <AnalysisComparison
            analysis={analysis}
            normalizedLikelihood={normalizedLikelihood}
            comparedEntry={comparedEntry}
            comparisonCandidates={comparisonCandidates}
            onCompareChange={onCompareChange}
          />
        ) : null}

        <AnalysisHistory
          history={history}
          onClearHistory={onClearHistory}
          onLoadItem={onLoadHistoryItem}
        />
      </main>

      <footer className="page-footer">
        <LockIcon />
        <span>{t('app.badge.private')}</span>
      </footer>
    </div>
  )
}

function ResultSkeleton() {
  return (
    <section className="panel skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-gauge" />
      <div className="skeleton-lines">
        <div className="skeleton skeleton-line lg" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line sm" />
      </div>
    </section>
  )
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      {/* Shield body */}
      <path
        d="M12 2.5L4 6v5.5c0 5.25 3.4 9.75 8 11 4.6-1.25 8-5.75 8-11V6l-8-3.5z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M12 2.5L4 6v5.5c0 5.25 3.4 9.75 8 11 4.6-1.25 8-5.75 8-11V6l-8-3.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Radar/scan rings */}
      <circle cx="12" cy="11" r="2" fill="currentColor" />
      <path
        d="M12 7.5a3.5 3.5 0 0 1 3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M12 5.5a5.5 5.5 0 0 1 5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 11V8a4 4 0 118 0v3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <path
        d="M12 4l9 16H3l9-16z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M12 10v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
    </svg>
  )
}
