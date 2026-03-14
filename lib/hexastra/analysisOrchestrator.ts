/**
 * Analysis Orchestrator — coordinates all analysis modules.
 *
 * Pipeline:
 *   userMessage → memory → profile → timing → potential → neurokuа → responseBuilder
 *
 * Returns instruction messages ready to inject into the AI prompt.
 */

import { buildProfileContext } from './profileModule'
import { buildMemoryContext } from './memoryModule'
import { detectMoment } from './timingModule'
import { detectPotential } from './potentialModule'
import { buildNeurokuaContext } from './neurokuaModule'
import { buildInstructionMessages } from './responseBuilder'

type ChatMsg = { role: 'user' | 'assistant'; content: string }

type BirthInfo = {
  firstName?: string
  lastName?: string
  date?: string
  time?: string
  place?: string
  country?: string
  gender?: string
}

export type OrchestratorInput = {
  userMessage: string
  conversationHistory: ChatMsg[]
  birthData: BirthInfo | null
  microProfileExists: boolean
  mode: string   // 'essentiel' | 'premium' | 'praticien'
}

export type OrchestratorOutput = {
  instructionMessages: ChatMsg[]
  meta: {
    moment: string
    potential: string | null
    theme: string | null
    phase: string
  }
}

export function orchestrateAnalysis(input: OrchestratorInput): OrchestratorOutput {
  const {
    userMessage,
    conversationHistory,
    birthData,
    microProfileExists,
    mode,
  } = input

  // ── Step 1: Memory — extract session context ──────────────────────────────
  const memoryCtx = buildMemoryContext(conversationHistory)

  // ── Step 2: Profile — build birth data context ────────────────────────────
  const profileCtx = buildProfileContext(birthData, microProfileExists)

  // ── Step 3: Timing — detect moment type ──────────────────────────────────
  const timingResult = detectMoment(userMessage)

  // ── Step 4: Potential — detect dominant axis ──────────────────────────────
  const historyTexts = conversationHistory
    .filter((m) => m.role === 'user')
    .map((m) => m.content)
  const potentialResult = detectPotential(userMessage, historyTexts)

  // ── Step 5: NeuroKua — derive neuro-energetic orientation ─────────────────
  const neurokuaResult = buildNeurokuaContext(
    timingResult.moment,
    potentialResult.potential,
  )

  // ── Step 6: Response builder — assemble instruction messages ──────────────
  const instructionMessages = buildInstructionMessages({
    profile: profileCtx,
    memory: memoryCtx,
    momentInstruction: timingResult.instructionBlock,
    potentialInstruction: potentialResult.instructionBlock,
    neurokuaInstruction: neurokuaResult.instructionBlock,
    mode,
  })

  return {
    instructionMessages,
    meta: {
      moment: timingResult.moment,
      potential: potentialResult.potential,
      theme: memoryCtx.theme,
      phase: memoryCtx.phase,
    },
  }
}
