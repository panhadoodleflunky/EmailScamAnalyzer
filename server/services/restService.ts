import type { Express, Request, Response } from 'express'

import type { AnalysisErrorResponse, AnalysisSuccessResponse } from '../models/analysis'
import { analysisRequestSchema } from '../models/analysis'
import { analyseText } from './agentService'

export function registerRestServices(app: Express) {
  app.post(
    '/api/analyse',
    async (
      request: Request,
      response: Response<AnalysisSuccessResponse | AnalysisErrorResponse>,
    ) => {
      const parsedRequest = analysisRequestSchema.safeParse(request.body)

      if (!parsedRequest.success) {
        return response.status(400).json({
          error: 'Please paste some email text before running analysis.',
        })
      }

      try {
        const analysis = await analyseText(parsedRequest.data.text)

        return response.status(200).json({ analysis })
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Unexpected error while running analysis.'

        return response.status(500).json({ error: message })
      }
    },
  )
}