import { analysisSchema, analysisSystemPrompt } from '../models/analysis'

// Models sometimes wrap JSON in markdown fences or add surrounding prose even
// when asked not to. Extract the first balanced JSON object so parsing is robust.
function extractJson(raw: string): string {
  const trimmed = raw.trim()

  // Strip ```json ... ``` or ``` ... ``` fences if present.
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
  if (fenced) {
    return fenced[1].trim()
  }

  // Otherwise grab from the first { to the last }.
  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')
  if (start !== -1 && end !== -1 && end > start) {
    return trimmed.slice(start, end + 1)
  }

  return trimmed
}

export async function analyseText(text: string) {
  const ollamaUrl = process.env.OLLAMA_URL ?? 'http://localhost:11434'
  const model = process.env.OLLAMA_MODEL ?? 'mistral'

  const prompt = `${analysisSystemPrompt}\n\nAnalyze this email and respond ONLY with valid JSON (no markdown, no explanation):\n\n${text}\n\nRespond with JSON in this exact format:\n{\n  "likelihood": <number 0-100>,\n  "summary": "<string>",\n  "points": [\n    {"text": "<string>", "severity": "low|medium|high"},\n    ...\n  ]\n}`

  const response = await fetch(`${ollamaUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      // Ask Ollama to constrain output to JSON so we don't get prose/markdown.
      format: 'json',
    }),
  })

  if (!response.ok) {
    throw new Error(
      `Ollama error: ${response.status}. Make sure Ollama is running (ollama serve) and the model is installed (ollama pull ${model})`,
    )
  }

  const data = (await response.json()) as { response?: string }

  if (typeof data.response !== 'string' || data.response.trim().length === 0) {
    throw new Error('Ollama returned an empty response. Please try again.')
  }

  let parsedJson: unknown
  try {
    parsedJson = JSON.parse(extractJson(data.response))
  } catch {
    throw new Error('Could not parse the model response as JSON. Please try again.')
  }

  return analysisSchema.parse(parsedJson)
}
