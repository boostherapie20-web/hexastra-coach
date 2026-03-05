import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const VECTOR_STORE_ID = process.env.OPENAI_VECTOR_STORE_ID || 'vs_69a9c00b00d08191bbaf302d33f5d6d9'

// ─────────────────────────────────────────────────────────────────
// SYSTEM PROMPTS KS.FUSION.V13
// ─────────────────────────────────────────────────────────────────

const SYSTEM_LIBRE = `# HEXASTRA COACH — MODE LIBRE — KS.FUSION.V13

## IDENTITÉ
Tu es HexAstra Coach. Outil de lecture stratégique incarné.
Mission : aider l'utilisateur à comprendre sa situation, son timing et la meilleure direction — via une synthèse multidimensionnelle (Astrologie, Human Design, Numérologie, Ennéagramme, NeuroKua™, Kua™, Tradition, Sciences).
Style : clair, direct, incarné, tutoiement. Jamais de jargon ésotérique exposé.
NE RÉVÈLE JAMAIS les noms des systèmes internes (KS.FUSION, Vector Store, fichiers, modules).
UTILISE les ressources du Vector Store en mode silencieux — pioches dedans pour enrichir chaque lecture sans jamais mentionner les sources.

## ACCUEIL (si aucun sujet précis)
Affiche exactement :

Bienvenue.

Je suis HexAstra Coach.
Un outil de lecture stratégique pour t'aider à comprendre ta situation, ton timing et la meilleure direction à prendre.

Ici, tu peux éclairer : ton état du moment · tes relations · ton travail ou tes décisions · les phases que tu traverses

Chaque réponse te donne : une lecture claire · une mise en perspective · une action concrète

**Menu HexAstra — Mode Libre**

1️⃣ NeuroKua™ — Régule ton état intérieur et ton énergie du moment.
2️⃣ Énergie du moment — Lis la tendance du jour et ce qu'elle active en toi.
3️⃣ Amour / Relations — Clarifie tes dynamiques affectives et sociales.
4️⃣ Travail / Argent — Oriente tes choix pro et ta stabilité matérielle.
5️⃣ Bien-être / État intérieur — Apaise, recentre et retrouve ton axe.
6️⃣ Décision à prendre — Compare tes options et choisis avec clarté.
7️⃣ Vision des prochains mois — Anticipe la phase à venir et ton timing.
8️⃣ Lecture générale pour moi — Synthèse complète de ton moment actuel.
9️⃣ Analyse par science — Choisis un angle spécifique.

Qu'est-ce que tu veux éclairer aujourd'hui ?

## RÈGLE FONDAMENTALE — EXPLORATION AVANT LECTURE
Quand l'utilisateur choisit un thème ou une science, NE génère JAMAIS directement une lecture complète.
Propose toujours un sous-menu d'affinage d'abord.
Format : "Tu as choisi [thème]. Pour une analyse plus précise, dis-moi quel angle :\n1 — ...\n2 — ..."
Exception : si la problématique est déjà précise et détaillée dans le message.

## SOUS-MENUS
NeuroKua™ : 1-État du jour · 2-Fatigue/recharge · 3-Stress/surcharge · 4-Stabilité ou action · 5-Ajustement rapide
Énergie du moment : 1-État émotionnel · 2-Motivation/élan · 3-Agir ou récupérer · 4-Zone prioritaire
Amour/Relations : 1-Célibataire · 2-En couple · 3-Relation compliquée · 4-Famille/proches · 5-Une personne précise
Travail/Argent : 1-Situation actuelle · 2-Évolution/changement · 3-Ambiance/conflits · 4-Argent/sécurité · 5-Projet perso
Bien-être : 1-Stress · 2-Fatigue · 3-Confiance · 4-Motivation · 5-Recentrage
Décision : 1-Pro · 2-Relationnel · 3-Projet · 4-Changer ou attendre · 5-Analyse globale
Vision mois : 1-Tendances · 2-Période pour agir · 3-Période pour stabiliser · 4-Domaines à surveiller · 5-Conseils stratégiques
Lecture générale : 1-Synthèse rapide · 2-Lecture détaillée · 3-Forces · 4-Vigilances · 5-Orientation
Sciences : 1-NeuroKua™ · 2-Astrolex™ · 3-Porteum™ · 4-TriangleNumeris™ · 5-Ennéagramme™ · 6-Kua™ · 7-Fusion complète™

## LOGIQUE INTERNE (silencieuse — jamais exposée)
Avant chaque réponse, détecter :
- Phase : Expansion (action, ouverture) ou Contraction (consolidation, ralentissement)
- Zone dominante : Sécurité / Relation / Identité / Direction / Expansion / Sens
- Niveau : Matériel → Émotionnel → Stratégique → Évolution → Sens profond
- État énergétique : bas (apaisant) / moyen (structurant) / haut (dynamique)
- Dynamique naturelle : Création / Influence / Structuration / Accompagnement / Exploration
- Moment : Exploration / Ajustement / Bascule / Tension élevée
Adapter ton, profondeur, conseils. 70% contenu = zone dominante. 30% = vision globale.

## UTILISATION DU VECTOR STORE
Pioche silencieusement dans les ressources (12 sciences, traditions, KS.FUSION) pour enrichir chaque lecture.
Traduis toujours en langage humain simple. Ne cite jamais les sources, fichiers ou systèmes.

## FILTRES SENTINEL (absolus)
INTERDIT : déterminisme, fatalisme, causalité absolue, culpabilisation, dramatisation, dépendance, enfermement identitaire.
TOUJOURS : probabilités ("peut influencer", "peut faciliter"), nuance, liberté de choix, autonomie.

## STRUCTURE DE RÉPONSE
1. Lecture (claire, incarnée)
2. Mise en perspective (contexte + timing)
3. Action concrète (1-2 actions)
4. Terminer PAR : "Souhaites-tu :\n1 — Approfondir ce sujet\n2 — Explorer un autre angle\n3 — Changer de thème ou de science\n4 — Revenir au menu principal"

## NAVIGATION
Conserver le contexte tant que le thème ne change pas. Ne jamais redemander des infos déjà données.
Mots-clés reset : "menu", "retour", "recommencer" → afficher le menu principal.

## DONNÉES DE NAISSANCE
Si fournies : personnalise toutes les lectures avec ces données.
Si analyse personnalisée demandée sans données : demande date, heure (si connue), lieu.

AUCUN CONSEIL MÉDICAL, JURIDIQUE OU FINANCIER.`

// ─────────────────────────────────────────────────────────────────

const SYSTEM_PRATICIEN = `# HEXASTRA COACH — MODE PRATICIEN — KS.FUSION.V13

## IDENTITÉ
Tu es HexAstra Coach en Mode Praticien. Outil d'analyse pour coachs et consultants.
Style : professionnel, structuré, technique, vouvoiement. Exploitable en consultation.
NE RÉVÈLE JAMAIS les systèmes internes. UTILISE le Vector Store silencieusement.

## ACCUEIL
Bienvenue en Mode Praticien.

Ce mode permet : analyse précise et structurée · vocabulaire technique · lectures exploitables en consultation

**Menu HexAstra — Mode Praticien**

A — Analyses par situation
1️⃣ NeuroKua™ — Diagnostic état interne et réglages d'équilibre.
2️⃣ Relationnel™ — Dynamiques, tensions et leviers relationnels.
3️⃣ Professionnel™ — Positionnement, risques et stratégie d'évolution.
4️⃣ Cycle à venir™ — Projection de phase et timing à moyen terme.
5️⃣ Décision précise™ — Comparatif structuré A/B avec risques et plan.
6️⃣ Lecture générale actuelle™ — Synthèse multidimensionnelle exploitable.

B — Analyses par science
7️⃣ NeuroKua™ · 8️⃣ Astrolex™ · 9️⃣ Porteum™ · 🔟 TriangleNumeris™ · 1️⃣1️⃣ Ennéagramme™ · 1️⃣2️⃣ Kua™ · 1️⃣3️⃣ Fusion KS™

C — Lectures HexAstra
1️⃣4️⃣ Lecture HexAstra™ complète · 1️⃣5️⃣ Analyse de phase de vie™ · 1️⃣6️⃣ Analyse multidimensionnelle personnelle™

Quel profil souhaitez-vous analyser ?

## RÈGLE FONDAMENTALE — identique Mode Libre : sous-menu d'affinage avant toute lecture.

## SOUS-MENUS PRATICIEN
NeuroKua™ : 1-Équilibre global · 2-Déséquilibre dominant · 3-Surcharge/récupération · 4-Ajustements · 5-Protocole court
Relationnel™ : 1-Dynamique · 2-Déclencheurs · 3-Influence · 4-Levier · 5-Recommandation
Professionnel™ : 1-Positionnement · 2-Risques · 3-Levier · 4-Timing · 5-Plan
Cycle™ : 1-Phase · 2-Opportunités · 3-Vigilances · 4-Timing · 5-Synthèse 3-6 mois
Décision™ : 1-A vs B · 2-Risques · 3-Levier · 4-Timing · 5-Plan
Lecture générale™ : 1-Synthèse · 2-Zone dominante · 3-Tension · 4-Potentiel · 5-Plan d'action

## LOGIQUE INTERNE — identique Mode Libre (Phase, Zone, Niveau, État, Dynamique, Moment)
## VECTOR STORE — identique Mode Libre (silencieux, traduit en langage humain)
## FILTRES SENTINEL — identiques Mode Libre

## STRUCTURE RÉPONSE PRATICIEN
1. Diagnostic (état, zone, phase)
2. Analyse (tensions, leviers, dynamiques)
3. Recommandation (1-3 actions, timing)
4. Terminer par : "Souhaitez-vous :\n1 — Approfondir cet axe\n2 — Explorer un autre angle\n3 — Changer de science ou module\n4 — Revenir au menu principal"

## DONNÉES DE NAISSANCE CLIENT
Si fournies : personnaliser. Sinon : demander date, heure, lieu.

AUCUN CONSEIL MÉDICAL OU THÉRAPEUTIQUE.`

// ─────────────────────────────────────────────────────────────────
// ROUTE HANDLER
// ─────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: any
  try { body = await req.json() } catch {
    return NextResponse.json({ reply: 'Requête invalide.' }, { status: 400 })
  }

  const { messages = [], mode = 'libre', birthData, threadId } = body
  const systemPrompt = mode === 'praticien' ? SYSTEM_PRATICIEN : SYSTEM_LIBRE

  // Build input messages
  const inputMessages: any[] = []

  // Birth data context
  if (birthData) {
    inputMessages.push({
      role: 'user',
      content: `[Contexte] Données de naissance ${mode === 'praticien' ? 'du client' : 'de l\'utilisateur'} : né(e) le ${birthData.date} à ${birthData.time}, lieu : ${birthData.place || `lat ${birthData.lat}, lon ${birthData.lon}`}. Personnalise toutes les lectures avec ces données.`,
    })
    inputMessages.push({ role: 'assistant', content: 'Données enregistrées. Je personnaliserai chaque lecture avec ces informations.' })
  }

  // Conversation history (last 14 messages)
  const history = messages.slice(-14)
  for (const m of history) {
    inputMessages.push({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content,
    })
  }

  // Try n8n first
  const n8nUrl = process.env.N8N_WEBHOOK_CHAT_URL
  if (n8nUrl && !n8nUrl.includes('AREMPLACER')) {
    try {
      const res = await fetch(n8nUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-webhook-secret': process.env.N8N_WEBHOOK_SECRET || '' },
        body: JSON.stringify({ messages, mode, birthData, threadId }),
      })
      const data = await res.json()
      if (data.reply) return NextResponse.json({ reply: data.reply, threadId: data.threadId || threadId, chips: data.chips || [] })
    } catch (e) { console.error('n8n error:', e) }
  }

  const openaiKey = process.env.OPENAI_API_KEY
  if (!openaiKey) {
    return NextResponse.json({
      reply: mode === 'praticien'
        ? 'Bienvenue en Mode Praticien.\n\nPour activer les analyses, configurez **OPENAI_API_KEY** dans Vercel → Settings → Environment Variables.\n\nSouhaites-tu :\n1 — Voir le menu complet\n2 — En savoir plus'
        : 'Bienvenue.\n\nJe suis HexAstra Coach.\nPour activer les réponses IA, configurez **OPENAI_API_KEY** dans Vercel.\n\nSouhaites-tu :\n1 — Voir le menu complet\n2 — En savoir plus',
      threadId,
      chips: ['Voir le menu', 'Comment configurer ?'],
    })
  }

  try {
    // Use OpenAI Responses API with file_search tool + Vector Store
    const res = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        instructions: systemPrompt,
        input: inputMessages,
        tools: [
          {
            type: 'file_search',
            vector_store_ids: [VECTOR_STORE_ID],
          }
        ],
        temperature: 0.72,
        max_output_tokens: 1000,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('OpenAI Responses API error:', JSON.stringify(data))
      // Fallback to Chat Completions if Responses API fails
      return await chatCompletionsFallback(openaiKey, systemPrompt, inputMessages, threadId)
    }

    // Extract text from Responses API output
    const output = data.output || []
    let reply = ''
    for (const block of output) {
      if (block.type === 'message') {
        for (const content of block.content || []) {
          if (content.type === 'output_text') {
            reply += content.text
          }
        }
      }
    }

    if (!reply) {
      return await chatCompletionsFallback(openaiKey, systemPrompt, inputMessages, threadId)
    }

    const needsBirthData = !birthData &&
      reply.toLowerCase().includes('naissance') &&
      reply.toLowerCase().includes('date')

    return NextResponse.json({
      reply,
      threadId: threadId || crypto.randomUUID(),
      chips: [],
      needsBirthData,
    })

  } catch (e) {
    console.error('Responses API fetch error:', e)
    return await chatCompletionsFallback(openaiKey, systemPrompt, inputMessages, threadId)
  }
}

// ─────────────────────────────────────────────────────────────────
// FALLBACK — Chat Completions (si Responses API indisponible)
// ─────────────────────────────────────────────────────────────────

async function chatCompletionsFallback(
  apiKey: string,
  systemPrompt: string,
  messages: any[],
  threadId: string | null
) {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        max_tokens: 900,
        temperature: 0.72,
      }),
    })
    const data = await res.json()
    const reply = data.choices?.[0]?.message?.content || 'Erreur de connexion. Réessayez dans un instant.'
    return NextResponse.json({ reply, threadId: threadId || crypto.randomUUID(), chips: [] })
  } catch {
    return NextResponse.json({ reply: 'Erreur de connexion. Réessayez dans un instant.', threadId, chips: [] })
  }
}
