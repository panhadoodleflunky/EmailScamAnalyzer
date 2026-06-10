import { useI18n } from '../../localization/i18nContext'
import {
  formatLikelihoodPercent,
  getRiskLevel,
  type ScamAnalysis,
  type SignalSeverity,
} from '../../models/scam'

type AnalysisResultProps = {
  analysis: ScamAnalysis
  normalizedLikelihood: number
}

export function AnalysisResult({ analysis, normalizedLikelihood }: AnalysisResultProps) {
  const { t } = useI18n()
  const riskLevel = getRiskLevel(normalizedLikelihood)

  return (
    <section className={`panel result risk-${riskLevel}`} aria-live="polite">
      <div className="result-hero">
        <RiskGauge value={normalizedLikelihood} label={formatLikelihoodPercent(analysis.likelihood)} />

        <div className="verdict">
          <span className="risk-tag">
            <RiskDot />
            {t(`risk.${riskLevel}`)}
          </span>
          <h2>{t(`verdict.${riskLevel}`)}</h2>
          <p className="summary">{analysis.summary}</p>
        </div>
      </div>

      <div className="advice">
        <span className="advice-icon" aria-hidden="true">
          <InfoIcon />
        </span>
        <div>
          <h3>{t('result.adviceTitle')}</h3>
          <p>{t(`advice.${riskLevel}`)}</p>
        </div>
      </div>

      <h3 className="signals-title">{t('result.whyTitle')}</h3>
      <ul className="signal-list">
        {analysis.points.map((point, index) => (
          <li
            key={`${point.text}-${index}`}
            className={`signal-item signal-${point.severity}`}
          >
            <SeverityIcon severity={point.severity} />
            <span className="signal-text">{point.text}</span>
            <span className="signal-badge">{t(`severity.${point.severity}`)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function RiskGauge({ value, label }: { value: number; label: string }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, value))
  const offset = circumference - (clamped / 100) * circumference

  return (
    <div className="gauge" role="img" aria-label={`${label}`}>
      <svg viewBox="0 0 130 130" width="130" height="130">
        <circle
          className="gauge-track"
          cx="65"
          cy="65"
          r={radius}
          fill="none"
          strokeWidth="12"
        />
        <circle
          className="gauge-value"
          cx="65"
          cy="65"
          r={radius}
          fill="none"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 65 65)"
        />
      </svg>
      <div className="gauge-center">
        <span className="gauge-value-text">{label}</span>
        <span className="gauge-caption">scam risk</span>
      </div>
    </div>
  )
}

function RiskDot() {
  return <span className="risk-dot" aria-hidden="true" />
}

function SeverityIcon({ severity }: { severity: SignalSeverity }) {
  if (severity === 'high') {
    return (
      <svg className="severity-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <path d="M12 4l9 16H3l9-16z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M12 10v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="17" r="1" fill="currentColor" />
      </svg>
    )
  }

  if (severity === 'medium') {
    return (
      <svg className="severity-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 8v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="16" r="1" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg className="severity-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 11v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1.1" fill="currentColor" />
    </svg>
  )
}
