import { useState } from 'react'
import { Newspaper, Users, AppWindow, Ticket } from 'lucide-react'
import Diretorio from './Diretorio'
import Aplicacoes from './Aplicacoes'
import Comunicados from './Comunicados'
import './Portal.css'

const SECTIONS = [
  { key: 'tickets',   icon: Ticket,    title: 'Sistema de Tickets',   desc: 'Abrir e acompanhar pedidos de suporte'    },
  { key: 'comunicados', icon: Newspaper, title: 'Comunicados',         desc: 'Notícias e avisos internos da empresa'    },
  { key: 'diretorio', icon: Users,     title: 'Diretório Corporativo', desc: 'Contactos e departamentos'                },
  { key: 'apps',      icon: AppWindow,  title: 'Aplicações',            desc: 'Ferramentas e apps da empresa'            },
]

function Portal({ onBack, initialSection = null }) {
  const [section, setSection] = useState(initialSection)

  if (section === 'diretorio')   return <Diretorio onBack={() => setSection(null)} />
  if (section === 'apps')        return <Aplicacoes onBack={() => setSection(null)} />
  if (section === 'comunicados') return <Comunicados onBack={() => setSection(null)} />

  return (
    <div className="portal-page">
      <div className="portal-content">

        <div className="portal-header">
          <img src="/logo.png" alt="Autocrescente" className="portal-logo" />
          <p className="portal-sub">Portal Interno </p>
        </div>

        <div className="portal-grid">
          {SECTIONS.map((s) => (
            <div key={s.key} className="portal-card" onClick={() => setSection(s.key)}>
              <div className="portal-card-icon">
                <s.icon size={28} strokeWidth={1.5} />
              </div>
              <span className="portal-card-title">{s.title}</span>
              <span className="portal-card-desc">{s.desc}</span>
            </div>
          ))}
        </div>

        <button className="portal-back" onClick={onBack}>← Voltar</button>
      </div>
    </div>
  )
}

export default Portal
