'use client'

import { DS, cardStyle, type Project, type Reading } from '../_lib/chat'

type Props = {
  projects: Project[]
  readings: Reading[]
  onNewChat: () => void
  onCreateProject: () => void
  onOpenReading: (reading: Reading) => void
}

export default function LeftSidebar({
  projects,
  readings,
  onNewChat,
  onCreateProject,
  onOpenReading,
}: Props) {
  const groupedProjects = [...projects].reverse().slice(0, 5)
  const recentReadings = readings.slice(0, 6)

  return (
    <aside
      style={{
        width: 278,
        minWidth: 278,
        height: '100vh',
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        background: 'linear-gradient(180deg, rgba(10,7,5,0.78), rgba(10,7,5,0.60))',
        borderRight: `1px solid ${DS.line}`,
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
      }}
    >
      <div style={cardStyle({ padding: 18 })}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 24,
              height: 24,
              background: DS.gradient,
              clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
              boxShadow: '0 0 28px rgba(212,165,116,0.18)',
              flexShrink: 0,
            }}
          />
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontFamily: DS.titleFont,
              }}
            >
              HexAstra
            </div>
            <div style={{ fontSize: 11, color: DS.textMute }}>Cockpit conversationnel</div>
          </div>
        </div>

        <button
          type="button"
          onClick={onNewChat}
          style={{
            marginTop: 16,
            width: '100%',
            minHeight: 44,
            borderRadius: 14,
            border: 'none',
            background: DS.gradient,
            color: '#fff',
            fontWeight: 700,
            boxShadow: '0 14px 34px rgba(212,165,116,0.22)',
          }}
        >
          + Nouvelle lecture
        </button>
      </div>

      <div style={cardStyle({ padding: 14 })}>
        <SectionLabel>Navigation</SectionLabel>
        <NavButton label="Coach IA" active />
        <NavButton label="Historique" />
        <NavButton label="Vos projets" />
        <NavButton label="Abonnements" />
      </div>

      <div style={cardStyle({ padding: 14 })}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <SectionLabel>Projets</SectionLabel>
          <button
            type="button"
            onClick={onCreateProject}
            style={{ color: DS.amber, fontSize: 20, lineHeight: 1 }}
          >
            ＋
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {groupedProjects.length > 0 ? (
            groupedProjects.map((project) => {
              const count = readings.filter((reading) => reading.projectId === project.id).length
              return (
                <div
                  key={project.id}
                  style={{
                    padding: '10px 11px',
                    borderRadius: 16,
                    border: `1px solid ${DS.line}`,
                    background: 'rgba(255,255,255,0.02)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: DS.amber }}>◈</span>
                    <span
                      style={{
                        flex: 1,
                        fontSize: 12,
                        color: DS.textSoft,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {project.name}
                    </span>
                    <span style={{ fontSize: 10, color: DS.textFaint, fontFamily: DS.monoFont }}>{count}</span>
                  </div>
                </div>
              )
            })
          ) : (
            <EmptyText>Aucun projet pour le moment</EmptyText>
          )}
        </div>
      </div>

      <div style={cardStyle({ padding: 14, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' })}>
        <SectionLabel>Lectures récentes</SectionLabel>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', paddingRight: 2 }}>
          {recentReadings.length > 0 ? (
            recentReadings.map((reading) => (
              <button
                key={reading.id}
                type="button"
                onClick={() => onOpenReading(reading)}
                style={{
                  textAlign: 'left',
                  padding: '11px 12px',
                  borderRadius: 16,
                  border: `1px solid ${DS.line}`,
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                <div style={{ fontSize: 12, color: DS.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {reading.title}
                </div>
                <div
                  style={{
                    marginTop: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 10, color: DS.amber, fontFamily: DS.monoFont }}>
                    {reading.science}
                  </span>
                  <span style={{ fontSize: 10, color: DS.textFaint, fontFamily: DS.monoFont }}>
                    {new Date(reading.date).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </button>
            ))
          ) : (
            <EmptyText>Les réponses sauvegardées apparaîtront ici</EmptyText>
          )}
        </div>
      </div>
    </aside>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        marginBottom: 10,
        fontSize: 10,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: DS.textFaint,
        fontFamily: DS.monoFont,
      }}
    >
      {children}
    </div>
  )
}

function NavButton({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <button
      type="button"
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        borderRadius: 14,
        background: active
          ? 'linear-gradient(180deg, rgba(212,165,116,0.14), rgba(212,165,116,0.07))'
          : 'transparent',
        border: active ? `1px solid ${DS.lineWarm}` : '1px solid transparent',
        color: active ? DS.text : DS.textMute,
        fontSize: 13,
      }}
    >
      <span style={{ color: active ? DS.amber : DS.textFaint }}>◈</span>
      {label}
    </button>
  )
}

function EmptyText({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: '10px 4px', fontSize: 12, color: DS.textFaint }}>{children}</div>
}
