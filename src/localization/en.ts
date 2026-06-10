const en = {
  'app.eyebrow': 'Scam Detector',
  'app.title': 'Is this email a scam?',
  'app.intro':
    'Paste an email below and we’ll check it for you. You’ll get a simple safety score and clear reasons — no tech knowledge needed.',
  'app.language': 'Language',
  'app.badge.private': 'Private — your email is only used for this check',

  'form.emailTextLabel': 'Paste the email here',
  'form.helper': 'Tip: include the sender, the subject, and any links for the most accurate result.',
  'form.placeholder':
    'Example:\n\nSubject: Your account will be suspended\n\nDear customer, we noticed unusual activity. Verify now at http://...',
  'form.analyse': 'Check this email',
  'form.analysing': 'Checking…',
  'form.sample': 'Try a sample email',
  'form.clear': 'Clear',
  'form.charCount': '{count} characters',

  'result.title': 'Result',
  'result.ariaLikelihood': 'Scam likelihood {value}',
  'result.scoreLabel': 'Scam likelihood',
  'result.whyTitle': 'Why we think so',
  'result.adviceTitle': 'What you should do',

  'verdict.high': 'This looks like a scam',
  'verdict.moderate': 'Be careful with this one',
  'verdict.low': 'Probably okay, but stay alert',
  'verdict.veryLow': 'This looks safe',

  'advice.high':
    'Don’t click any links, reply, or share personal details. Delete it, or report it to your IT/security team.',
  'advice.moderate':
    'Don’t click links or share info until you’re sure. Verify the sender through a channel you trust.',
  'advice.low':
    'It seems fine, but double-check the sender and links before acting on anything.',
  'advice.veryLow':
    'No strong warning signs found. As always, stay cautious with unexpected requests.',

  'comparison.title': 'Compare with a previous check',
  'comparison.current': 'This email',
  'comparison.selectedHistory': 'Previous email',

  'history.title': 'Recent checks',
  'history.subtitle': 'Your last few results, saved on this device.',
  'history.clear': 'Clear all',
  'history.load': 'View',

  'risk.high': 'High Risk',
  'risk.moderate': 'Moderate Risk',
  'risk.low': 'Low Risk',
  'risk.veryLow': 'Very Low Risk',

  'severity.high': 'high',
  'severity.medium': 'medium',
  'severity.low': 'low',
  'signal.badge': '{severity}',

  'errors.analysisServiceUnexpected': 'The analysis service returned an unexpected error.',
  'errors.unableToAnalyse': 'Unable to analyse this message right now. Please try again.',
} as const

export default en
