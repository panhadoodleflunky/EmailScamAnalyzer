import { useI18n } from '../../localization/i18nContext'
import {
  formatLikelihoodPercent,
  getRiskLevel,
  normalizeLikelihood,
  type HistoryItem,
} from '../../models/scam'

type AnalysisHistoryProps = {
  history: HistoryItem[]
  onClearHistory: () => void
  onLoadItem: (item: HistoryItem) => void
}

export function AnalysisHistory({
  history,
  onClearHistory,
  onLoadItem,
}: AnalysisHistoryProps) {
  const { t } = useI18n()

  if (history.length === 0) {
    return null
  }

  return (
    <section className="panel history" aria-live="polite">
      <div className="section-head">
        <div>
          <h3>{t('history.title')}</h3>
          <p className="section-subtitle">{t('history.subtitle')}</p>
        </div>
        <button className="ghost-btn" type="button" onClick={onClearHistory}>
          {t('history.clear')}
        </button>
      </div>

      <ul className="history-list">
        {history.map((item) => {
          const riskLevel = getRiskLevel(normalizeLikelihood(item.analysis.likelihood))
          return (
            <li key={item.id} className={`history-item risk-${riskLevel}`}>
              <span className="history-score-chip">
                <span className="risk-dot" aria-hidden="true" />
                {formatLikelihoodPercent(item.analysis.likelihood)}
              </span>
              <div className="history-body">
                <p className="history-date">{new Date(item.createdAt).toLocaleString()}</p>
                <p className="history-summary">{item.analysis.summary}</p>
              </div>
              <button
                className="text-btn"
                type="button"
                onClick={() => onLoadItem(item)}
              >
                {t('history.load')}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
