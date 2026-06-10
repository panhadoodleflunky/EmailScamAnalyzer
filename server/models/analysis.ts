import { z } from 'zod'

export const analysisRequestSchema = z.object({
  text: z.string().trim().min(1).max(12000),
})

export const analysisSchema = z.object({
  likelihood: z.number().min(0).max(100),
  summary: z.string().min(1),
  points: z
    .array(
      z.object({
        text: z.string().min(1),
        severity: z.enum(['low', 'medium', 'high']),
      }),
    )
    .min(1),
})

export const analysisSystemPrompt =
  'You are an email scam detection analyst. Assess if the provided message is likely a scam. Focus on phishing traits, urgency, social engineering, payment redirection, spoofing, credential theft cues, suspicious links, and coercive language.'

export type AnalysisRequest = z.infer<typeof analysisRequestSchema>
export type ScamAnalysis = z.infer<typeof analysisSchema>

export type AnalysisSuccessResponse = {
  analysis: ScamAnalysis
}

export type AnalysisErrorResponse = {
  error: string
}