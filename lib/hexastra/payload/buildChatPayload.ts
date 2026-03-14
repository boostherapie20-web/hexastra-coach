import type { ChatMessage } from '@/lib/chat/chatPayloadBuilder'
import type { HexastraSessionContext } from '@/lib/hexastra/context/buildSessionContext'
import type { HexastraUserContext } from '@/lib/hexastra/context/buildUserContext'

export function buildChatPayload({
  systemPrompt,
  userContext,
  sessionContext,
  messages,
  knowledgeBlock,
}: {
  systemPrompt: string
  userContext: HexastraUserContext
  sessionContext: HexastraSessionContext
  messages: ChatMessage[]
  knowledgeBlock?: string | null
}) {
  const contextBlock = {
    userContext: {
      firstName: userContext.firstName,
      plan: userContext.plan,
      language: userContext.language,
      birthData: userContext.birthData,
      practitionerUsage: userContext.practitionerUsage,
      memory: userContext.memory,
    },
    sessionContext: {
      currentTheme: sessionContext.currentTheme,
      contextType: sessionContext.contextType,
      selectedMenuKey: sessionContext.selectedMenuKey,
      selectedSubmenuKey: sessionContext.selectedSubmenuKey,
      readingLevel: sessionContext.readingLevel,
      timing: sessionContext.timing,
      dominantPotential: sessionContext.dominantPotential,
      lifePhase: sessionContext.lifePhase,
      domainRoute: sessionContext.domainRoute,
      activeModule: sessionContext.activeModule,
    },
  }

  return {
    model: 'gpt-4o',
    instructions: systemPrompt,
    temperature: 0.68,
    max_output_tokens: 1000,
    input: [
      {
        role: 'user',
        content: `Contexte HexAstra interne à intégrer silencieusement : ${JSON.stringify(contextBlock)}`,
      },
      ...(knowledgeBlock ? [{ role: 'assistant' as const, content: knowledgeBlock }] : []),
      ...messages,
    ],
  }
}
