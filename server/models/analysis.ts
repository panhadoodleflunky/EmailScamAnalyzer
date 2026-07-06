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
  'You are an email scam detection analyst. Assess how likely the provided message is a scam, phishing attempt, or fraud. ' +
  'Most everyday emails are NOT scams — personal messages, routine work correspondence, meeting notes, newsletters, and order or shipping notifications from well-known companies are normal and should score low. ' +
  'Do not flag an email as risky just because it contains a link or mentions a deadline; legitimate businesses routinely use both. ' +
  'Only score high (70+) when multiple strong indicators appear together, such as urgent threats combined with credential or payment requests, a link that does not match the claimed sender, impersonation of a company demanding sensitive info, or clear coercive pressure. ' +
  'A single weak signal on its own should not push the score above 40. ' +
  'Focus on: phishing traits, urgency paired with threats, social engineering, payment redirection, spoofing, credential theft cues, suspicious or mismatched links, and coercive language.'

export type AnalysisRequest = z.infer<typeof analysisRequestSchema>
export type ScamAnalysis = z.infer<typeof analysisSchema>

export type AnalysisSuccessResponse = {
  analysis: ScamAnalysis
}

export type AnalysisErrorResponse = {
  error: string
}