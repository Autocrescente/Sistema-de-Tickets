import { ChevronLeft, ExternalLink } from 'lucide-react'
import './Aplicacoes.css'

const APPS = [
  { nome: 'Sistema de Tickets',  desc: 'Pedidos de suporte interno',         cor: '#6366f1', inicial: 'T', url: '#' },
  { nome: 'Email Corporativo',   desc: 'Webmail da empresa',                  cor: '#ea580c', inicial: 'E', url: '#' },
  { nome: 'ERP Autocrescente',   desc: 'Sistema de gestão empresarial',       cor: '#0891b2', inicial: 'E', url: '#' },
  { nome: 'Drive Partilhado',    desc: 'Documentos e ficheiros da empresa',   cor: '#16a34a', inicial: 'D', url: '#' },
  { nome: 'Ponto Eletrónico',    desc: 'Registo de entradas e saídas',        cor: '#d97706', inicial: 'P', url: '#' },
  { nome: 'Portal RH',           desc: 'Férias, faltas e documentos pessoais',cor: '#9333ea', inicial: 'R', url: '#' },
]

function Aplicacoes({ onBack }) {
  return (
    <div className="apps-page">
      <div className="apps-content">

        <div className="apps-header">
          <button className="apps-back" onClick={onBack}><ChevronLeft size={18} /> Voltar</button>
          <h1 className="apps-title">Aplicações</h1>
          <p className="apps-sub">Ferramentas e apps da empresa</p>
        </div>

        <div className="apps-grid">
          {APPS.map((app, i) => (
            <a key={i} href={app.url} className="app-card" target="_blank" rel="noreferrer">
              <div className="app-icon" style={{ background: app.cor }}>
                {app.inicial}
              </div>
              <div className="app-info">
                <span className="app-nome">{app.nome}</span>
                <span className="app-desc">{app.desc}</span>
              </div>
              <ExternalLink size={15} className="app-link-icon" />
            </a>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Aplicacoes
