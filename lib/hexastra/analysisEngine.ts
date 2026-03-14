/**
 * Analysis Engine — public API for Couche 3.
 *
 * Called by route.ts ONLY when:
 *   - bootstrap is complete (step === 'conversation_ready')
 *   - domain guard has passed (Couche 2)
 *   - requestType === 'chat'
 *
 * Returns instruction messages to prepend to the OpenAI inputMessages array.
 */

import { orchestrateAnalysis, type OrchestratorInput, type OrchestratorOutput } from './analysisOrchestrator'

export type { OrchestratorInput as AnalysisInput, OrchestratorOutput as AnalysisOutput }

/**
 * Main entry point.
 * Synchronous — no async calls. All analysis is pure computation.
 */
export function runAnalysisEngine(input: OrchestratorInput): OrchestratorOutput {
  return orchestrateAnalysis(input)
}
