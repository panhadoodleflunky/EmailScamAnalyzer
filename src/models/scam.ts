export type SignalSeverity = 'low' | 'medium' | 'high'

export type AnalysisPoint = {
  text: string
  severity: SignalSeverity
}

export type ScamAnalysis = {
  likelihood: number
  points: AnalysisPoint[]
  summary: string
}

export type HistoryItem = {
  id: string
  createdAt: string
  sourceText: string
  analysis: ScamAnalysis
}

export type RiskLevel = 'veryLow' | 'low' | 'moderate' | 'high'

export const SAMPLE_EMAIL = `Subject: URGENT: Your Microsoft 365 account will be suspended in 30 minutes

Dear Saki,

We detected unusual login activity from Russia and your mailbox is now at high risk. For your security, your account will be permanently suspended within 30 minutes unless you verify immediately.

Verify now:
http://microsoft-security-check-verify-login.com/secure

If you do not verify, you may lose all emails, OneDrive files, and Teams access.

To avoid suspension, reply to this email with your password and the 6-digit code you receive.

Thank you,
Microsoft 365 Security Team`

export function normalizeLikelihood(likelihood: number) {
  const scaledLikelihood = likelihood >= 0 && likelihood <= 1 ? likelihood * 100 : likelihood
  return Math.max(0, Math.min(100, scaledLikelihood))
}

export function formatLikelihoodPercent(likelihood: number) {
  const normalized = normalizeLikelihood(likelihood)
  const rounded = Number.isInteger(normalized)
    ? normalized
    : Number(normalized.toFixed(1))
  return `${rounded}%`
}

export function getRiskLevel(likelihood: number): RiskLevel {
  if (likelihood >= 80) {
    return 'high'
  }
  if (likelihood >= 50) {
    return 'moderate'
  }
  if (likelihood >= 25) {
    return 'low'
  }
  return 'veryLow'
}

export function severityClass(severity: SignalSeverity) {
  if (severity === 'high') {
    return 'signal-high'
  }
  if (severity === 'medium') {
    return 'signal-medium'
  }
  return 'signal-low'
}
