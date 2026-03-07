'use client'

import { DS, MENU_BY_MODE, cardStyle, type Mode, type Reading } from '../_lib/chat'

type Props = {
  mode: Mode
  readings: Reading[]
  collapsed: boolean
  onToggleCollapse: () => void
  onPrompt: (value: string) => void
  onOpenReading: (reading: Reading) => void
}

export default function RightPanel({
  mode,
  readings,
  collapsed,
  onToggleCollapse,
  onPrompt,
  onOpenReading,
}: Props) {
  const items = MENU_BY_MODE[mode]
  const looseReadings = readings.filter((item) => !item.projectId).slice(0, 5)

  return (
    <aside
      style={{
        width: collapsed ? 82 : 252,
        minWidth: collapsed ? 82 : 252,
        height: '100vh',
        padding: collapsed ? 14 : 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        background: 'linear-gradient(180deg, rgba(10,7,5,0.58), rgba(10,7,5,0.78))',
        borderLeft: `1px solid ${DS.line}`,
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        transition: 'width 0.26s ease, min-width 0.26s ease, padding 0.26s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: collapsed ? 'center' : 'space-between', alignItems: 'center' }}>
        {!collapsed && (
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: DS.textFaint, fontFamily: DS.monoFont }}>
              Outils
            </div>
            <div style={{ marginTop: 4, fontFamily: DS.titleFont, fontSize: 15, fontWeight: 600 }}>
              Accès rapide
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Ouvrir le rail' : 'Réduire le rail'}
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            display: 'grid',
            placeItems: 'center',
            border: `1px solid ${DS.line}`,
            background: 'rgba(255,255,255,0.03)',
            color: DS.textSoft,
          }}
        >
          {collapsed ? '‹' : '›'}
        </button>
      </div>

      {!collapsed && (
        <div style={cardStyle({ padding: 14 })}>
          <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: DS.textFaint, fontFamily: DS.monoFont, marginBottom: 10 }}>
            Lectures libres
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {looseReadings.length > 0 ? (
              looseReadings.map((reading) => (
                <button
                  key={reading.id}
                  type="button"
                  onClick={() => onOpenReading(reading)}
                  style={{
                    textAlign: 'left',
                    padding: '10px 11px',
                    borderRadius: 15,
                    border: `1px solid ${DS.line}`,
                    background: 'rgba(255,255,255,0.02)',
                  }}
                >
                  <div style={{ fontSize: 12, color: DS.textSoft, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {reading.title}
                  </div>
                  <div style={{ marginTop: 4, fontSize: 10, color: DS.amber, fontFamily: DS.monoFont }}>
                    {reading.science}
                  </div>
                </button>
              ))
            ) : (
              <div style={{ fontSize: 12, color: DS.textFaint }}>Aucune lecture détachée</div>
            )}
          </div>
        </div>
      )}

      <div style={cardStyle({ padding: collapsed ? 10 : 14, flex: 1, minHeight: 0 })}>
        {!collapsed && (
          <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: DS.textFaint, fontFamily: DS.monoFont, marginBottom: 10 }}>
            Catégories
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: collapsed ? 8 : 6, overflowY: 'auto' }}>
          {items.map((item) =>
            collapsed ? (
              <button
                key={item.id}
                type="button"
                title={item.label}
                onClick={() => onPrompt(item.label)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  border: `1px solid ${DS.line}`,
                  background: 'rgba(255,255,255,0.03)',
                  color: DS.amber,
                  fontSize: 13,
                  alignSelf: 'center',
                }}
              >
                {item.icon}
              </button>
            ) : (
              <button
                key={item.id}
                type="button"
                onClick={() => onPrompt(`${item.label} — ${item.sub}`)}
                style={{
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: '11px 11px',
                  borderRadius: 16,
                  border: `1px solid ${DS.line}`,
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                <span style={{ color: DS.amber, marginTop: 1 }}>{item.icon}</span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: 'block', fontSize: 12, color: DS.text }}>{item.label}</span>
                  <span style={{ display: 'block', marginTop: 3, fontSize: 10, color: DS.textFaint }}>{item.sub}</span>
                </span>
              </button>
            ),
          )}
        </div>
      </div>
    </aside>
  )
}
