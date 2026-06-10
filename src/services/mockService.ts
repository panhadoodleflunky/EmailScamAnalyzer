import type { AnalysisPoint, ScamAnalysis, SignalSeverity } from '../models/scam'

// Lightweight, offline stand-in for the real backend. It does NOT call any AI —
// it just scores the text against a few common scam cues so the UI shows
// realistic-looking results without Ollama or the Express server running.

type Rule = {
  pattern: RegExp
  weight: number
  severity: SignalSeverity
  text: string
}

const RULES: Rule[] = [
  { pattern: /\b(urgent|immediately|within \d+ (minutes|hours)|act now|asap)\b/i, weight: 22, severity: 'high', text: 'Creates urgency or a countdown to pressure you into acting fast.' },
  { pattern: /\b(suspend|suspended|deactivat|terminat|locked|closed)\b/i, weight: 18, severity: 'high', text: 'Threatens to suspend or close your account if you don’t respond.' },
  { pattern: /\b(verify|confirm|update|re-?activate)\b.*\b(account|identity|details|information)\b/i, weight: 16, severity: 'high', text: 'Asks you to “verify” your account or identity — a classic phishing move.' },
  { pattern: /\b(password|passcode|otp|one[- ]?time|mfa|2fa|pin|cvv)\b/i, weight: 24, severity: 'high', text: 'Requests sensitive credentials (password, OTP, or security code).' },
  { pattern: /\b(bank|paypal|wire|transfer|payment|invoice|refund|gift card|bitcoin|crypto)\b/i, weight: 14, severity: 'medium', text: 'Involves money, payments, or gift cards — common in financial scams.' },
  { pattern: /https?:\/\/[^\s]+/i, weight: 12, severity: 'medium', text: 'Contains a link. Hover to check the real destination before clicking.' },
  { pattern: /\b(dear (customer|user|member)|valued customer)\b/i, weight: 8, severity: 'medium', text: 'Uses a generic greeting instead of your real name.' },
  { pattern: /\b(winner|won|prize|lottery|congratulations|claim)\b/i, weight: 16, severity: 'medium', text: 'Promises a prize or winnings you didn’t sign up for.' },
  { pattern: /\b(do not contact|don’t tell|keep this confidential|between us)\b/i, weight: 14, severity: 'high', text: 'Asks you to keep it secret or avoid contacting support — a red flag.' },
]

function pseudoRandom(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 1000
  }
  return hash / 1000
}

export function mockAnalyse(text: string): ScamAnalysis {
  const matched: AnalysisPoint[] = []
  let score = 0

  for (const rule of RULES) {
    if (rule.pattern.test(text)) {
      score += rule.weight
      matched.push({ text: rule.text, severity: rule.severity })
    }
  }

  // A little noise so different emails don't all land on round numbers.
  const jitter = Math.round(pseudoRandom(text) * 8)
  const likelihood = Math.max(3, Math.min(98, score + jitter))

  let summary: string
  if (likelihood >= 80) {
    summary =
      'This message shows several strong scam signals, including urgency and requests for sensitive information. Treat it as a phishing attempt.'
  } else if (likelihood >= 50) {
    summary =
      'This message has some concerning traits often seen in scams. Be cautious and verify the sender before taking any action.'
  } else if (likelihood >= 25) {
    summary =
      'A few minor warning signs were found, but nothing strongly conclusive. Stay alert and double-check links and the sender.'
  } else {
    summary =
      'No strong scam indicators were found in this message. It appears relatively safe, but always stay cautious with unexpected requests.'
  }

  if (matched.length === 0) {
    matched.push({
      text: 'No common scam patterns (urgency, credential requests, suspicious links) were detected.',
      severity: 'low',
    })
  }

  return { likelihood, summary, points: matched.slice(0, 6) }
}
