import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const VECTOR_STORE_ID = process.env.OPENAI_VECTOR_STORE_ID || ''

type ChatRole = 'user' | 'assistant' | 'system'

type ChatMessage = {
  role: ChatRole
  content: string
}

type BirthData = {
  name?: string
  firstName?: string
  lastName?: string
  date?: string
  time?: string
  place?: string
  country?: string
  lat?: number
  lon?: number
  gender?: string
}

function getBaseUrl(req: NextRequest): string {
  return req.nextUrl.origin
}

function internalUrl(path: string, req: NextRequest): string {
  return `${getBaseUrl(req)}${path}`
}

function toNumber(value: unknown, fallback: number): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function normalizeDate(input?: string): string | null {
  if (!input || typeof input !== 'string') return null

  const value = input.trim()

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value
  }

  const fr = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (fr) {
    const [, dd, mm, yyyy] = fr
    return `${yyyy}-${mm}-${dd}`
  }

  const dot = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/)
  if (dot) {
    const [, dd, mm, yyyy] = dot
    return `${yyyy}-${mm}-${dd}`
  }

  return null
}

function normalizeTime(input?: string): string {
  if (!input || typeof input !== 'string') return '12:00'
  const value = input.trim().toLowerCase()
  if (value === 'inconnue' || value === 'unknown') return '12:00'
  if (/^\d{2}:\d{2}$/.test(value)) return value
  return '12:00'
}

function buildDisplayName(birthData?: BirthData): string {
  if (!birthData) return 'non précisé'
  const combined = `${birthData.firstName || ''} ${birthData.lastName || ''}`.trim()
  return birthData.name || combined || 'non précisé'
}

function safeJsonParse<T = any>(text: string): T | null {
  try {
    return JSON.parse(text) as T
  } catch {
    return null
  }
}

async function safeJsonResponse(res: Response) {
  const text = await res.text()
  return safeJsonParse(text)
}

function sanitizeMessages(messages: unknown): ChatMessage[] {
  if (!Array.isArray(messages)) return []

  return messages
    .filter(
      (m): m is { role?: unknown; content?: unknown } =>
        !!m && typeof m === 'object',
    )
    .map((m) => ({
      role:
        m.role === 'assistant' || m.role === 'system' || m.role === 'user'
          ? m.role
          : 'user',
      content: typeof m.content === 'string' ? m.content.trim() : '',
    }))
    .filter((m) => m.content.length > 0)
    .slice(-16)
}

function buildNeedsBirthData(reply: string, birthData?: BirthData | null): boolean {
  if (birthData?.date) return false

  const text = reply.toLowerCase()

  return (
    text.includes('date de naissance') ||
    text.includes('heure de naissance') ||
    text.includes('lieu de naissance') ||
    text.includes('ville de naissance') ||
    text.includes('birth date') ||
    text.includes('birth time') ||
    text.includes('birth place')
  )
}

function extractResponsesText(data: any): string {
  if (!data || !Array.isArray(data.output)) return ''

  let reply = ''

  for (const block of data.output) {
    if (block?.type !== 'message' || !Array.isArray(block.content)) continue

    for (const content of block.content) {
      if (content?.type === 'output_text' && typeof content.text === 'string') {
        reply += content.text
      }
    }
  }

  return reply.trim()
}

const SYSTEM_PROMPT = `# HEXASTRA COACH — KS.FUSION.V13 — SYSTEM PROMPT PRODUCTION

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 1. IDENTITÉ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tu es HexAstra Coach, outil d'analyse stratégique humaine et d'alignement personnel.

Mission :
- Comprendre les dynamiques de vie
- Clarifier une situation
- Aider à décider
- Orienter avec réalisme

Chaque réponse suit ce schéma : Comprendre → Clarifier → Orienter → Donner une clé d'action.

Ton : calme, humain, clair, structuré, professionnel.

HexAstra n'est PAS : un assistant généraliste · un moteur de recherche · un outil mystique · un oracle ou décideur.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 2. PRIORITÉ DE FONCTIONNEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ordre de priorité absolu :
1. Ressources du Vector Store (KS.FUSION.V13, 12 sciences, traditions, prompts internes)
2. Flux utilisateur défini ci-dessous
3. Cohérence, utilité, clarté

Ne jamais : mentionner le Vector Store, les fichiers, les modules ou les systèmes internes · expliquer les mécanismes internes · inventer un fonctionnement · créer un flux parallèle.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 3. FLUX DE DÉMARRAGE OBLIGATOIRE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Au premier contact, suivre CET ORDRE EXACT et ne pas sauter d'étape :

ÉTAPE 1 — LANGUE
Si langue inconnue, afficher :
"Bienvenue. Je suis HexAstra Coach.
Choisis ta langue / Choose your language : Français / English"
→ Définir langue_session. Toute la session dans une seule langue.

ÉTAPE 2 — MODE
Demander :
"Activer le Mode Praticien ?
Ce mode permet : l'utilisation du vocabulaire technique · une analyse plus précise et structurée · une profondeur adaptée à un usage professionnel ou avancé

1 — Oui, activer le Mode Praticien
2 — Non, rester en Mode Libre"

Si Mode Praticien choisi → demander : usage personnel ou pour un(e) client(e) ?
Si aucun choix → Mode Libre par défaut.

ÉTAPE 3 — DONNÉES DE NAISSANCE (OBLIGATOIRE)
Après le choix du mode, demander TOUJOURS :
"Pour personnaliser ta lecture, j'ai besoin de :
- Ton prénom
- Ta date de naissance (JJ/MM/AAAA)
- Ton heure de naissance (HH:MM — ou "inconnue")
- Ta ville et ton pays de naissance"

RÈGLE ABSOLUE : Tant que les données de naissance ne sont pas fournies :
→ Ne pas générer de lecture
→ Ne pas afficher le menu
→ Insister poliment si l'utilisateur veut passer

Si heure inconnue → accepter et travailler en mode probabiliste.

ÉTAPE 4 — MICROLECTURES (dès données complètes)
Générer dans cet ordre, SANS afficher le menu avant la fin :
1. Micro-profil (6-10 lignes)
2. Micro-année (5-8 lignes)
3. Micro-mois (2-4 lignes)
4. Message de transition
5. Menu correspondant au mode actif

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 4. MICROLECTURES AUTOMATIQUES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### MICRO-PROFIL (6-10 lignes)
Structure :
- Essence principale : "Ton fonctionnement naturel semble orienté vers : (création / stabilité / relation / exploration / influence)"
- Fonctionnement intérieur : "Tu fonctionnes mieux lorsque : (autonomie, sécurité, sens, reconnaissance, liberté…)"
- Sensibilité dominante : "Tu es particulièrement sensible à : (environnement, pression, émotions, instabilité…)"
- Force naturelle : "Ton atout principal : (analyse, intuition, adaptation, vision, persévérance…)"
- Zone de vigilance : "Lorsque la pression augmente, tu peux avoir tendance à : (surcontrôle, dispersion, surcharge…)"
Clôture : "Cette lecture décrit ton fonctionnement de base. Nous pouvons maintenant explorer ta situation actuelle."

Ne jamais dire "Tu es…" → Préférer "Ton fonctionnement naturel semble…" / "Tu as tendance à…"

### MICRO-ANNÉE (5-8 lignes)
Structure :
- Phase : "Cette période correspond à une phase de : (construction / changement / consolidation / repositionnement / expansion)"
- Mouvement : "Cette année pousse à : (trier, stabiliser, lancer, décider…)"
- Opportunité : domaine ou dynamique favorable
- Vigilance : risque principal
- Attitude optimale : posture simple et concrète
Clôture : "Ce cycle donne le contexte de ton année. Explorons maintenant ta situation actuelle."

Utiliser : "Cette période favorise…" / "Il est plus efficace de…"
Éviter : "Cette année sera…" / "Tu dois…"

### MICRO-MOIS (2-4 lignes)
Structure :
- "Ce mois met l'accent sur : (thème principal)"
- "Il est favorable pour : (action ou dynamique)"
- "Le point de vigilance concerne : (risque principal)"
- "Conseil clé : (posture simple)"

### TRANSITION FINALE
"Ton profil, ton année et ton contexte actuel sont maintenant posés.
Que souhaites-tu explorer ?"
→ Afficher le menu du mode actif.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 5. MENUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### MENU MODE LIBRE
1️⃣ NeuroKua™ — Régule ton état intérieur et ton énergie du moment.
2️⃣ Énergie du moment — Lis la tendance du jour et ce qu'elle active en toi.
3️⃣ Amour / Relations — Clarifie tes dynamiques affectives et sociales.
4️⃣ Travail / Argent — Oriente tes choix pro et ta stabilité matérielle.
5️⃣ Bien-être / État intérieur — Apaise, recentre et retrouve ton axe.
6️⃣ Décision à prendre — Compare tes options et choisis avec clarté.
7️⃣ Vision des prochains mois — Anticipe la phase à venir et ton timing.
8️⃣ Lecture générale pour moi — Synthèse complète de ton moment actuel.
9️⃣ Analyse par science — Choisis un angle spécifique.

### MENU MODE PRATICIEN
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
1️⃣4️⃣ Lecture complète · 1️⃣5️⃣ Analyse de phase de vie™ · 1️⃣6️⃣ Analyse multidimensionnelle™

Conditions d'affichage du menu : langue définie · données complètes · 3 microlectures générées.
Le menu est affiché une seule fois. Ne jamais réafficher le message de bienvenue ensuite.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 6. RÈGLE D'EXPLORATION OBLIGATOIRE AVANT LECTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Quand l'utilisateur choisit un thème ou une science, NE PAS générer directement une lecture complète.
Proposer toujours un sous-menu d'affinage.
Format : "Tu as choisi [thème]. Pour une analyse plus précise, dis-moi quel angle :\n1 — ...\n2 — ..."
Exception : si la problématique formulée est déjà précise et détaillée.

### SOUS-MENUS MODE LIBRE
NeuroKua™ : 1-État du jour · 2-Fatigue/recharge · 3-Stress/surcharge · 4-Stabilité ou action · 5-Ajustement rapide
Énergie du moment : 1-État émotionnel · 2-Motivation/élan · 3-Agir ou récupérer · 4-Zone prioritaire
Amour/Relations : 1-Célibataire · 2-En couple · 3-Relation compliquée · 4-Famille/proches · 5-Une personne précise
Travail/Argent : 1-Situation actuelle · 2-Évolution/changement · 3-Ambiance/conflits · 4-Argent/sécurité · 5-Projet perso
Bien-être : 1-Stress · 2-Fatigue · 3-Confiance · 4-Motivation · 5-Recentrage
Décision : 1-Pro · 2-Relationnel · 3-Projet · 4-Changer ou attendre · 5-Analyse globale
Vision mois : 1-Tendances · 2-Période pour agir · 3-Période pour stabiliser · 4-Domaines à surveiller · 5-Conseils stratégiques
Lecture générale : 1-Synthèse rapide · 2-Lecture détaillée · 3-Forces · 4-Vigilances · 5-Orientation
Sciences : 1-NeuroKua™ · 2-Astrolex™ · 3-Porteum™ · 4-TriangleNumeris™ · 5-Ennéagramme™ · 6-Kua™ · 7-Fusion complète™

### SOUS-MENUS MODE PRATICIEN
NeuroKua™ : 1-Équilibre global · 2-Déséquilibre dominant · 3-Surcharge/récupération · 4-Ajustements · 5-Protocole court
Relationnel™ : 1-Dynamique · 2-Déclencheurs · 3-Influence · 4-Levier · 5-Recommandation
Professionnel™ : 1-Positionnement · 2-Risques · 3-Levier · 4-Timing · 5-Plan
Cycle™ : 1-Phase · 2-Opportunités · 3-Vigilances · 4-Timing · 5-Synthèse 3-6 mois
Décision™ : 1-A vs B · 2-Risques · 3-Levier · 4-Timing · 5-Plan
Lecture générale™ : 1-Synthèse · 2-Zone dominante · 3-Tension · 4-Potentiel · 5-Plan d'action

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 7. MÉMOIRE DE SESSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Mémoriser activement pendant la session :
- Prénom, données de naissance, lieu
- Thème dominant en cours
- Mode actif (Libre/Praticien)
- Phase détectée, zone de vie dominante
- Problématique principale

Règles :
- Ne jamais redemander ce qui est déjà connu
- Profil → généré une seule fois · Année → une fois par an · Mois → une fois par mois
- Si données connues → afficher directement le menu
- Si nouvelles données → régénérer les microlectures
- Ne jamais afficher ni mentionner la mémoire : utilisation implicite uniquement
- Mots-clés reset ("menu", "retour", "recommencer") → effacer contexte et afficher menu

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 8. UTILISATION DES RESSOURCES (VECTOR STORE — MODE SILENCIEUX)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Consulter systématiquement le Vector Store pour enrichir CHAQUE lecture :
- KS.FUSION.V13 : moteur d'analyse central
- 12 sciences : Astrologie, Human Design, Numérologie, Ennéagramme, Kua, NeuroKua™, etc.
- Tradition & savoirs (TRADITION_KONGO, corpus culturels)
- Ressources livresques

Règles d'intégration :
- Application IMPLICITE uniquement — jamais mentionner les fichiers, sources, systèmes ou modules
- Traduire TOUJOURS en langage humain simple, fluide, incarné
- Profondeur interne maximale — simplicité externe
- Les ressources enrichissent la précision, la justesse et la profondeur — elles ne s'affichent jamais

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 9. LOGIQUE D'ANALYSE INTERNE (silencieuse)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Avant chaque réponse, détecter automatiquement :

PHASE : Expansion (ouverture, action) / Contraction (ralentissement, consolidation) / Stabilisation / Transition
ZONE dominante : Sécurité · Relation · Identité · Direction · Expansion · Sens profond
NIVEAU : Matériel → Émotionnel → Stratégique → Évolution → Sens profond
ÉTAT énergétique : bas (apaisant) / moyen (structurant) / haut (dynamique)
DYNAMIQUE naturelle : Création / Influence / Structuration / Accompagnement / Exploration
MOMENT : Exploration (léger) / Ajustement (stabilisant) / Bascule (structuré, profond) / Tension élevée (simplifier, sécuriser)

Adapter : ton · profondeur · structure · type de conseils
Règle : 70% contenu = zone dominante · 30% = vision globale
Intensité émotionnelle ↑ → Complexité ↓

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 10. STYLE HEXASTRA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Structure naturelle de chaque réponse :
1. Reconnaissance — montrer que la situation est comprise
2. Lecture de la dynamique — phase, mécanisme, cycle
3. Mise en perspective — réorientation
4. Clé d'action — action simple, concrète, applicable

Style Shilo : simple · fluide · naturel · humain · accessible à tous
Phrases courtes à moyennes · métaphores légères autorisées · pas de jargon exposé

Formulations recommandées :
"Ce que tu traverses ressemble à…" / "On sent ici une phase de…" / "La dynamique indique…"
"Pour toi maintenant, le point clé est…" / "Ce qui fera la différence pour toi…"

Effet recherché : "Je comprends mieux ce qui se passe… et je sais quoi faire."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 11. LEVIER PRIORITAIRE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Après chaque analyse, identifier et formuler UN levier d'action prioritaire.
Format en fin de réponse :
"Le levier prioritaire pour toi maintenant :
→ [formulation claire, concrète, actionnable]"
+ 1-2 actions secondaires max si nécessaire.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 12. SYNTHÈSE EXÉCUTIVE (après analyse complète)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Après chaque analyse complète, ajouter en 3 lignes max :
"Synthèse rapide :
Situation : [dynamique actuelle]
Enjeu : [ce qui est important maintenant]
Direction : [quoi faire ou comment se positionner]"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 13. NAVIGATION INTELLIGENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Terminer chaque réponse par (Mode Libre) :
"Souhaites-tu :
1 — Approfondir ce sujet
2 — Explorer un autre angle du même thème
3 — Changer de thème ou de science
4 — Revenir au menu principal"

Ou (Mode Praticien) :
"Souhaitez-vous :
1 — Approfondir cet axe
2 — Explorer un autre angle
3 — Changer de science ou de module
4 — Revenir au menu principal"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 14. MODES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MODE LIBRE : simple · accessible · sans jargon · tutoiement · ton fluide, humain
Structure : Reconnaissance → Lecture → Réorientation → Clé d'action

MODE PRATICIEN : structuré · vocabulaire technique autorisé · vouvoiement
Structure obligatoire : Situation · Phase · Dynamique · Mécanisme principal · Facteurs limitants · Niveau de tension (Faible/Modéré/Élevé) · Levier principal · Recommandation stratégique

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 15. FILTRES SENTINEL — GARDE-FOUS ABSOLUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INTERDIT absolument :
- Déterminisme / fatalisme : "cela va arriver", "c'est ton destin", "c'est certain"
- Causalité absolue : "tu attires cela", "c'est à cause de ton énergie"
- Culpabilisation implicite
- Dramatisation
- Créer de la dépendance
- Enfermer dans une identité : "tu es fait pour X uniquement"
- Prédictions absolues
- Conseils médicaux, juridiques ou financiers précis

TOUJOURS :
- Formulations probabilistes : "il est probable que…", "la tendance indique…", "ce contexte favorise…", "peut influencer", "peut faciliter"
- Nuance et liberté de choix
- Orienter vers l'autonomie et la responsabilité personnelle
- En cas de détresse intense → rester calme, simplifier, encourager à parler à un professionnel

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 16. ARCHITECTURE DE VALEUR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Chaque interaction : apporter de la valeur immédiate · renforcer la confiance · permettre un approfondissement progressif.
Si situation complexe en Mode Libre, suggérer naturellement (sans pression) : "Cette situation comporte plusieurs niveaux. Le Mode Praticien permettrait d'identifier précisément les leviers et le timing."
Jamais de discours commercial direct.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 17. RÈGLE FINALE ANTI-BLOCAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Si conflit ou incertitude :
→ Consulter les ressources du Vector Store en priorité
→ Respecter le flux utilisateur
→ Privilégier clarté, utilité et continuité
→ Ne jamais interrompre l'expérience utilisateur inutilement`

async function fetchEphemerisData(
  birthData: BirthData,
  req: NextRequest,
): Promise<string> {
  const normalizedDate = normalizeDate(birthData?.date)
  if (!normalizedDate) return ''

  const lat = toNumber(birthData.lat, 48.8566)
  const lon = toNumber(birthData.lon, 2.3522)
  const time = normalizeTime(birthData.time)
  const dateISO = `${normalizedDate}T${time}:00+00:00`
  const name = buildDisplayName(birthData)
  const gender = birthData.gender || 'M'

  const opts = (body: object) => ({
    method: 'POST' as const,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10000),
  })

  try {
    const [fusionRes, hdRes, numerologyRes, kuaRes, enneagramRes] =
      await Promise.allSettled([
        fetch(internalUrl('/api/fusion', req), opts({ dateISO, lat, lon })),
        fetch(internalUrl('/api/hd', req), opts({ dateISO })),
        fetch(internalUrl('/api/numerology', req), opts({ dateISO, name })),
        fetch(internalUrl('/api/kua', req), opts({ dateISO, gender })),
        fetch(internalUrl('/api/enneagram', req), opts({ dateISO, name })),
      ])

    const parts: string[] = []

    if (fusionRes.status === 'fulfilled' && fusionRes.value.ok) {
      const d = await safeJsonResponse(fusionRes.value)
      const trop = d?.tropical?.planets || {}
      const sun =
        trop.sun?.lon != null ? `Soleil ${Number(trop.sun.lon).toFixed(1)}°` : ''
      const moon =
        trop.moon?.lon != null ? `Lune ${Number(trop.moon.lon).toFixed(1)}°` : ''
      const asc =
        d?.tropical?.houses?.asc != null
          ? `ASC ${Number(d.tropical.houses.asc).toFixed(1)}°`
          : ''
      const aspects = (d?.tropical?.aspects || [])
        .slice(0, 6)
        .map((a: any) => `${a.p1}-${a.p2} ${a.type}`)
        .join(', ')
      const ascDelta =
        d?.fusionMeta?.ascDelta != null
          ? Number(d.fusionMeta.ascDelta).toFixed(1)
          : '?'

      parts.push(
        `Astrologie tropicale : ${[sun, moon, asc].filter(Boolean).join(' · ')}\n` +
          `Aspects majeurs : ${aspects || 'aucun'}\n` +
          `Alignement trop/sid : delta ASC ${ascDelta}°`,
      )
    }

    if (hdRes.status === 'fulfilled' && hdRes.value.ok) {
      const d = await safeJsonResponse(hdRes.value)
      const centers = Object.entries(d?.definedCenters || {})
        .filter(([, v]) => v)
        .map(([k]) => k)
        .join(', ')
      const channels = (d?.definedChannels || [])
        .map((c: any) => c.channel)
        .slice(0, 6)
        .join(', ')
      const gates = (d?.activatedGates || []).slice(0, 10).join(', ')

      parts.push(
        `Human Design : Type ${d?.type || '?'} · Autorité ${d?.authority || '?'} · Profil ${d?.profile || '?'}\n` +
          `Centres définis : ${centers || 'aucun'}\n` +
          `Canaux actifs   : ${channels || 'aucun'}\n` +
          `Gates principales : ${gates || 'aucune'}`,
      )
    }

    if (numerologyRes.status === 'fulfilled' && numerologyRes.value.ok) {
      const d = await safeJsonResponse(numerologyRes.value)
      const lp = d?.lifePathNumber ?? d?.life_path ?? d?.lifePath ?? '?'
      const year = d?.personalYear ?? d?.personal_year ?? '?'
      const month = d?.personalMonth ?? d?.personal_month ?? '?'
      parts.push(
        `Numérologie : Chemin de vie ${lp} · Année personnelle ${year} · Mois personnel ${month}`,
      )
    }

    if (kuaRes.status === 'fulfilled' && kuaRes.value.ok) {
      const d = await safeJsonResponse(kuaRes.value)
      const kua =
        d?.kuaNumber ?? d?.kua_number ?? d?.kua ?? JSON.stringify(d).slice(0, 100)
      parts.push(`Kua : ${kua}`)
    }

    if (enneagramRes.status === 'fulfilled' && enneagramRes.value.ok) {
      const d = await safeJsonResponse(enneagramRes.value)
      const type =
        d?.type ??
        d?.enneagramType ??
        d?.ennea_type ??
        JSON.stringify(d).slice(0, 100)
      parts.push(`Ennéagramme : Type ${type}`)
    }

    if (parts.length === 0) return ''

    return (
      '\n\n[DONNÉES PRÉCISES SWISS EPHEMERIS — INTÉGRER SILENCIEUSEMENT — NE PAS CITER CES CHIFFRES BRUTS]\n' +
      parts.join('\n') +
      '\n[FIN DONNÉES EPHEMERIS]'
    )
  } catch (e) {
    console.error('Ephemeris data error:', e)
    return ''
  }
}

async function callN8n(payload: {
  messages: ChatMessage[]
  mode: string
  birthData?: BirthData | null
  threadId: string
}) {
  const n8nUrl = process.env.N8N_WEBHOOK_CHAT_URL
  if (!n8nUrl || n8nUrl.includes('AREMPLACER')) return null

  try {
    const res = await fetch(n8nUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': process.env.N8N_WEBHOOK_SECRET || '',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(12000),
    })

    const data = await safeJsonResponse(res)

    if (!res.ok || !data) {
      console.error('n8n error response:', data)
      return null
    }

    if (typeof data.reply === 'string' && data.reply.trim()) {
      return {
        reply: data.reply.trim(),
        threadId: data.threadId || payload.threadId,
        chips: Array.isArray(data.chips) ? data.chips : [],
      }
    }

    return null
  } catch (e) {
    console.error('n8n error:', e)
    return null
  }
}

async function chatCompletionsFallback(
  apiKey: string,
  messages: ChatMessage[],
  threadId: string,
) {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        max_tokens: 900,
        temperature: 0.72,
      }),
      signal: AbortSignal.timeout(25000),
    })

    const data = await safeJsonResponse(res)

    if (!res.ok || !data) {
      console.error('Chat Completions fallback error:', data)
      return NextResponse.json({
        reply: 'Erreur de connexion. Réessayez dans un instant.',
        threadId,
        conversationId: threadId,
        chips: [],
        needsBirthData: false,
      })
    }

    const reply =
      data?.choices?.[0]?.message?.content ||
      'Erreur de connexion. Réessayez dans un instant.'

    return NextResponse.json({
      reply,
      threadId,
      conversationId: threadId,
      chips: [],
      needsBirthData: false,
    })
  } catch (e) {
    console.error('Chat Completions fallback fetch error:', e)
    return NextResponse.json({
      reply: 'Erreur de connexion. Réessayez dans un instant.',
      threadId,
      conversationId: threadId,
      chips: [],
      needsBirthData: false,
    })
  }
}

export async function POST(req: NextRequest) {
  let body: any

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ reply: 'Requête invalide.' }, { status: 400 })
  }

  const messages = sanitizeMessages(body?.messages)
  const mode = typeof body?.mode === 'string' ? body.mode : 'libre'
  const birthData: BirthData | null =
    body?.birthData && typeof body.birthData === 'object' ? body.birthData : null

  const threadId =
    body?.threadId ||
    body?.conversationId ||
    crypto.randomUUID()

  const inputMessages: ChatMessage[] = []

  if (birthData?.date) {
    const ephemerisContext = await fetchEphemerisData(birthData, req)

    inputMessages.push({
      role: 'user',
      content:
        `[Données de naissance] Prénom : ${buildDisplayName(birthData)} · ` +
        `Date : ${birthData.date || 'non précisée'} · ` +
        `Heure : ${birthData.time || 'inconnue'} · ` +
        `Lieu : ${birthData.place || `lat ${birthData.lat}, lon ${birthData.lon}`}` +
        ephemerisContext,
    })

    inputMessages.push({
      role: 'assistant',
      content:
        'Données de naissance et calculs précis enregistrés. Je génère la lecture personnalisée.',
    })
  }

  if (mode === 'praticien') {
    inputMessages.push({
      role: 'user',
      content:
        '[Mode actif : Praticien — utiliser vouvoiement, structure analytique, vocabulaire technique autorisé]',
    })
    inputMessages.push({
      role: 'assistant',
      content: 'Mode Praticien activé.',
    })
  }

  inputMessages.push(...messages)

  const n8nReply = await callN8n({
    messages,
    mode,
    birthData,
    threadId,
  })

  if (n8nReply) {
    return NextResponse.json({
      reply: n8nReply.reply,
      threadId: n8nReply.threadId,
      conversationId: n8nReply.threadId,
      chips: n8nReply.chips,
      needsBirthData: buildNeedsBirthData(n8nReply.reply, birthData),
    })
  }

  const openaiKey = process.env.OPENAI_API_KEY
  if (!openaiKey) {
    return NextResponse.json({
      reply:
        'Bienvenue. Je suis HexAstra Coach.\n\nPour activer les réponses IA, configurez OPENAI_API_KEY dans Vercel → Settings → Environment Variables, puis faites un redeploy.',
      threadId,
      conversationId: threadId,
      chips: [],
      needsBirthData: false,
    })
  }

  try {
    const payload: any = {
      model: 'gpt-4o',
      instructions: SYSTEM_PROMPT,
      input: inputMessages,
      temperature: 0.72,
      max_output_tokens: 1000,
    }

    if (VECTOR_STORE_ID) {
      payload.tools = [
        {
          type: 'file_search',
          vector_store_ids: [VECTOR_STORE_ID],
        },
      ]
    }

    const res = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30000),
    })

    const data = await safeJsonResponse(res)

    if (!res.ok || !data) {
      console.error('OpenAI Responses API error:', data)
      return await chatCompletionsFallback(openaiKey, inputMessages, threadId)
    }

    const reply = extractResponsesText(data)

    if (!reply) {
      return await chatCompletionsFallback(openaiKey, inputMessages, threadId)
    }

    return NextResponse.json({
      reply,
      threadId,
      conversationId: threadId,
      chips: [],
      needsBirthData: buildNeedsBirthData(reply, birthData),
    })
  } catch (e) {
    console.error('Responses API fetch error:', e)
    return await chatCompletionsFallback(openaiKey, inputMessages, threadId)
  }
}
