import type { ScamAnalysis } from '../models/scam'
import { mockAnalyse } from './mockService'

const ANALYSE_ENDPOINT = '/api/analyse'

// Demo mode: when VITE_MOCK=true, skip the backend entirely and return a
// locally-computed result. Lets you preview the UI without Ollama or the server.
const USE_MOCK = import.meta.env.VITE_MOCK === 'true'

type AnalyseSuccessResponse = {
  analysis: ScamAnalysis
}

type AnalyseErrorResponse = {
  error: string
}

export async function analyseText(sourceText: string): Promise<ScamAnalysis> {
  if (USE_MOCK) {
    // Small delay so the loading skeleton is visible, just like the real flow.
    await new Promise((resolve) => setTimeout(resolve, 700))
    return mockAnalyse(sourceText)
  }

  const response = await fetch(ANALYSE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: sourceText }),
  })

  const payload = (await response.json()) as AnalyseSuccessResponse | AnalyseErrorResponse

  if (!response.ok || 'error' in payload) {
    throw new Error('error' in payload ? payload.error : 'ANALYSIS_SERVICE_ERROR')
  }

  return payload.analysis
}
