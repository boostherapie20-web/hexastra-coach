'use client'

import type { HexastraMenuItem } from '@/lib/hexastra/types'

type Props = {
  items: HexastraMenuItem[]
  title?: string
  onSelect: (item: HexastraMenuItem, parent?: HexastraMenuItem) => void
}

export default function MenuDock({ items, title = 'Parcours HexAstra', onSelect }: Props) {
  return (
    <div className="hx-menu-dock">
      <div className="hx-menu-dock-head">
        <strong>{title}</strong>
        <span>Choisis un angle pour guider réellement l’analyse.</span>
      </div>
      <div className="hx-menu-dock-grid">
        {items.map((item) => (
          <div key={item.key} className="hx-menu-dock-card">
            <button type="button" className="hx-menu-dock-button" onClick={() => onSelect(item)}>
              <span className="hx-menu-dock-title">{item.label}</span>
              <span className="hx-menu-dock-desc">{item.description}</span>
            </button>
            {item.submenu?.length ? (
              <div className="hx-menu-dock-subgrid">
                {item.submenu.map((sub) => (
                  <button key={sub.key} type="button" className="hx-menu-dock-subbutton" onClick={() => onSelect(sub, item)}>
                    <span>{sub.label}</span>
                    <small>{sub.description}</small>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
