'use client'

import { DS, cardStyle, type Project, type Reading } from '../_lib/chat'

type LeftSidebarProps = {
  projects: Project[]
  readings: Reading[]
  onNewChat: () => void
  onCreateProject: () => void
  onOpenReading: (reading: Reading) => void
}

function progressItemStyle(active = false): React.CSSProperties {
  return {
    display: 'grid',
    gridTemplateColumns: '18px 1fr',
    gap: 12,
    alignItems: 'start',
    opacity: active ? 1 : 0.72,
  }
}

export default function LeftSidebar({
  projects,
  readings,
  onNewChat,
  onCreateProject,
  onOpenReading,
}: LeftSidebarProps) {
  const latestReading = readings[0]

  return (
    <aside
      style={{
        width: '100%',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        minHeight: '100%',
      }}
    >
      <section
        style={cardStyle({
          padding: 20,
          borderRadius: 30,
        })}
      >
        <SectionLabel>Progression</SectionLabel>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={progressItemStyle(true)}>
            <Dot active />
            <div>
              <div style={titleStyle}>Mode actif</div>
              <div style={subStyle}>Essentiel, Premium ou Praticien selon ton usage.</div>
            </div>
          </div>

          <div style={progressItemStyle(readings.length > 0)}>
            <Dot active={readings.length > 0} />
            <div>
              <div style={titleStyle}>Données personnelles</div>
              <div style={subStyle}>Date, heure, lieu et pays quand tu veux aller plus loin.</div>
            </div>
          </div>

          <div style={progressItemStyle(readings.length > 0)}>
            <Dot active={readings.length > 0} />
            <div>
              <div style={titleStyle}>Lectures générées</div>
              <div style={subStyle}>{readings.length} lecture{readings.length > 1 ? 's' : ''} enregistrée{readings.length > 1 ? 's' : ''}.</div>
            </div>
          </div>
        </div>
      </section>

      <section style={cardStyle({ padding: 14, borderRadius: 24 })}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={onNewChat} style={primaryBtn}>
            Nouveau chat
          </button>
          <button onClick={onCreateProject} style={secondaryBtn}>
            Nouveau projet
          </button>
        </div>
      </section>

      <section style={cardStyle({ padding: 18, borderRadius: 30, flex: 1 })}>
        <SectionLabel>Projets / Lectures</SectionLabel>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {projects.length > 0 ? (
            projects.map((project) => (
              <div
                key={project.id}
                style={{
                  border: `1px solid ${DS.line}`,
                  borderRadius: 18,
                  padding: '13px 14px',
                  color: DS.textSoft,
                  background: '#ffffff',
                  boxShadow: '0 6px 16px rgba(16,24,20,0.04)',
                  fontSize: 14,
                }}
              >
                {project.name}
              </div>
            ))
          ) : (
            <div style={{ color: DS.textFaint, fontSize: 14, lineHeight: 1.7, padding: '8px 2px 4px' }}>
              Aucun projet créé pour le moment.
            </div>
          )}

          {latestReading && (
            <button onClick={() => onOpenReading(latestReading)} style={readingBtn}>
              <div style={{ fontSize: 12, color: DS.textFaint, marginBottom: 5 }}>Dernière lecture</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: DS.text }}>{latestReading.title}</div>
            </button>
          )}
        </div>
      </section>
    </aside>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: DS.textFaint,
        marginBottom: 16,
        fontFamily: DS.monoFont,
      }}
    >
      {children}
    </div>
  )
}

function Dot({ active = false }: { active?: boolean }) {
  return (
    <div
      style={{
        width: 18,
        height: 18,
        borderRadius: 999,
        border: `1px solid ${active ? 'rgba(25,195,125,0.46)' : DS.lineStrong}`,
        boxShadow: active ? '0 0 0 4px rgba(25,195,125,0.10)' : 'none',
        display: 'grid',
        placeItems: 'center',
        marginTop: 2,
        background: '#fff',
      }}
    >
      {active && <div style={{ width: 7, height: 7, borderRadius: 999, background: DS.emerald }} />}
    </div>
  )
}

const titleStyle: React.CSSProperties = { color: DS.text, fontSize: 15, fontWeight: 700 }
const subStyle: React.CSSProperties = { color: DS.textMuted, fontSize: 13, marginTop: 4, lineHeight: 1.6 }
const primaryBtn: React.CSSProperties = {
  border: 'none',
  background: DS.gradient,
  color: '#fff',
  borderRadius: 18,
  padding: '13px 14px',
  fontSize: 14,
  fontWeight: 700,
  textAlign: 'left',
  boxShadow: '0 12px 28px rgba(25,195,125,0.20)',
}
const secondaryBtn: React.CSSProperties = {
  border: `1px solid ${DS.line}`,
  background: 'rgba(255,255,255,0.84)',
  color: DS.textSoft,
  borderRadius: 18,
  padding: '13px 14px',
  fontSize: 14,
  fontWeight: 600,
  textAlign: 'left',
}
const readingBtn: React.CSSProperties = {
  marginTop: 6,
  border: '1px solid rgba(25,195,125,0.14)',
  background: 'rgba(25,195,125,0.06)',
  borderRadius: 18,
  padding: '14px 14px',
  textAlign: 'left',
  cursor: 'pointer',
  boxShadow: '0 6px 18px rgba(25,195,125,0.06)',
}
