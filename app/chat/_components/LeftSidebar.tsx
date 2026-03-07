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
    opacity: active ? 1 : 0.55,
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
      }}
    >
      <section
        style={cardStyle({
          padding: 18,
          borderRadius: 28,
          minHeight: 236,
        })}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: DS.textMuted,
            marginBottom: 16,
            fontFamily: DS.monoFont,
          }}
        >
          Progression
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={progressItemStyle(true)}>
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                border: '1px solid rgba(212,165,116,0.72)',
                boxShadow: '0 0 0 3px rgba(212,165,116,0.10)',
                display: 'grid',
                placeItems: 'center',
                marginTop: 2,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: DS.gold,
                }}
              />
            </div>

            <div>
              <div style={{ color: DS.text, fontSize: 15, fontWeight: 600 }}>
                Mode Essentiel actif
              </div>
              <div style={{ color: DS.textMuted, fontSize: 13, marginTop: 4 }}>
                Langue + mode configuré
              </div>
            </div>
          </div>

          <div style={progressItemStyle()}>
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.14)',
                marginTop: 2,
              }}
            />
            <div>
              <div style={{ color: DS.textSoft, fontSize: 15, fontWeight: 500 }}>
                Données naissance
              </div>
              <div style={{ color: DS.textFaint, fontSize: 13, marginTop: 4 }}>
                Date · Heure · Lieu · Pays
              </div>
            </div>
          </div>

          <div style={progressItemStyle()}>
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.14)',
                marginTop: 2,
              }}
            />
            <div>
              <div style={{ color: DS.textSoft, fontSize: 15, fontWeight: 500 }}>
                Microlectures
              </div>
              <div style={{ color: DS.textFaint, fontSize: 13, marginTop: 4 }}>
                Profil · Année · Mois générés
              </div>
            </div>
          </div>

          <div style={progressItemStyle()}>
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.14)',
                marginTop: 2,
              }}
            />
            <div>
              <div style={{ color: DS.textSoft, fontSize: 15, fontWeight: 500 }}>
                Exploration active
              </div>
              <div style={{ color: DS.textFaint, fontSize: 13, marginTop: 4 }}>
                {readings.length} lecture{readings.length > 1 ? 's' : ''} disponible
                {readings.length ? 's' : ''}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        style={cardStyle({
          padding: 14,
          borderRadius: 24,
        })}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={onNewChat}
            style={{
              border: '1px solid rgba(212,165,116,0.16)',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
              color: DS.text,
              borderRadius: 18,
              padding: '13px 14px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            Nouveau chat
          </button>

          <button
            onClick={onCreateProject}
            style={{
              border: '1px solid rgba(255,255,255,0.10)',
              background: 'rgba(255,255,255,0.02)',
              color: DS.textSoft,
              borderRadius: 18,
              padding: '13px 14px',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            Nouveau projet
          </button>
        </div>
      </section>

      <section
        style={cardStyle({
          padding: 18,
          borderRadius: 28,
          flex: 1,
        })}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: DS.textMuted,
            marginBottom: 14,
            fontFamily: DS.monoFont,
          }}
        >
          Projets / Lectures
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {projects.length > 0 ? (
            projects.map((project) => (
              <div
                key={project.id}
                style={{
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 18,
                  padding: '12px 14px',
                  color: DS.textSoft,
                  background: 'rgba(255,255,255,0.02)',
                  fontSize: 14,
                }}
              >
                {project.name}
              </div>
            ))
          ) : (
            <div
              style={{
                color: DS.textFaint,
                fontSize: 14,
                lineHeight: 1.7,
                padding: '8px 2px 4px',
              }}
            >
              Aucun projet créé pour le moment.
            </div>
          )}

          {latestReading && (
            <button
              onClick={() => onOpenReading(latestReading)}
              style={{
                marginTop: 6,
                border: '1px solid rgba(212,165,116,0.14)',
                background: 'rgba(212,165,116,0.05)',
                color: DS.text,
                borderRadius: 18,
                padding: '14px 14px',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: 13, color: DS.textMuted, marginBottom: 4 }}>
                Dernière lecture
              </div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{latestReading.title}</div>
            </button>
          )}
        </div>
      </section>
    </aside>
  )
}
