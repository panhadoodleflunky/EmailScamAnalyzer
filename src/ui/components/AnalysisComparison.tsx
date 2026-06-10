import { useI18n } from '../../localization/i18nContext'
import {
  formatLikelihoodPercent,
  getRiskLevel,
  normalizeLikelihood,
  type HistoryItem,
  type ScamAnalysis,
} from '../../models/scam'

type AnalysisComparisonProps = {
  analysis: ScamAnalysis
  normalizedLikelihood: number
  comparedEntry: HistoryItem
  comparisonCandidates: HistoryItem[]
  onCompareChange: (value: string) => void
}

export function AnalysisComparison({
  analysis,
  normalizedLikelihood,
  comparedEntry,
  comparisonCandidates,
  onCompareChange,
}: AnalysisComparisonProps) {
  const { t } = useI18n()

  const currentRisk = getRiskLevel(normalizedLikelihood)
  const comparedRisk = getRiskLevel(normalizeLikelihood(comparedEntry.analysis.likelihood))

  return (
    <section className="panel comparison" aria-live="polite">
      <div className="section-head">
        <h3>{t('comparison.title')}</h3>
        <select
          className="select"
          value={comparedEntry.id}
          onChange={(event) => onCompareChange(event.target.value)}
        >
          {comparisonCandidates.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {new Date(entry.createdAt).toLocaleString()}
            </option>
          ))}
        </select>
      </div>

      <div className="comparison-grid">
        <article className={`compare-card risk-${currentRisk}`}>
          <h4>{t('comparison.current')}</h4>
          <p className="comparison-score">{formatLikelihoodPercent(analysis.likelihood)}</p>
          <p className="comparison-label">
            <span className="risk-dot" aria-hidden="true" />
            {t(`risk.${currentRisk}`)}
          </p>
          <p className="comparison-summary">{analysis.summary}</p>
        </article>

        <article className={`compare-card risk-${comparedRisk}`}>
          <h4>{t('comparison.selectedHistory')}</h4>
          <p className="comparison-score">
            {formatLikelihoodPercent(comparedEntry.analysis.likelihood)}
          </p>
          <p className="comparison-label">
            <span className="risk-dot" aria-hidden="true" />
            {t(`risk.${comparedRisk}`)}
          </p>
          <p className="comparison-summary">{comparedEntry.analysis.summary}</p>
        </article>
      </div>
    </section>
  )
}
