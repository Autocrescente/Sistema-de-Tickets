import { useState, useEffect } from 'react'
import { Ticket, Settings, LayoutGrid, Users, AppWindow, ChevronRight, Search, Phone, Mail, X, ExternalLink, MessageSquare, Hash } from 'lucide-react'
import { getTickets } from '../services/api'
import './Home.css'

/* ── DADOS ── */
const COMUNICADOS = [
  { titulo: 'Atualização da política de férias 2026', categoria: 'Recursos Humanos', data: '30 Mai 2026', resumo: 'A partir de junho de 2026, os pedidos de férias devem ser submetidos com um mínimo de 15 dias de antecedência.', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoDpdJi9PU08VX9fL1R46SbE66UPdTBjJb6Q&s', corpo: 'A partir de junho de 2026, os pedidos de férias devem ser submetidos com um mínimo de 15 dias de antecedência através do Portal RH. Esta medida visa melhorar o planeamento das equipas e garantir uma melhor gestão dos recursos humanos. Para mais informações contacte o departamento de Recursos Humanos.' },
  { titulo: 'Manutenção do sistema ERP — 7 de junho', categoria: 'Tecnologia',       data: '28 Mai 2026', resumo: 'O sistema ERP estará indisponível no dia 7 de junho das 22h às 02h para manutenção programada.',              img: 'https://thumbs.dreamstime.com/b/feche-acima-do-reparo-computador-e-preste-servi%C3%A7os-de-manuten%C3%A7%C3%A3o-%C3%A0-117236155.jpg', corpo: 'O sistema ERP estará indisponível no dia 7 de junho das 22h às 02h para manutenção programada. Durante este período não será possível aceder a faturas, stocks ou relatórios. Planeie as suas tarefas em conformidade. Em caso de urgência contacte o departamento de Tecnologia.' },
  { titulo: 'Novo colaborador — Bem-vindo, Miguel!', categoria: 'Geral',             data: '25 Mai 2026', resumo: 'Damos as boas-vindas ao Miguel Ferreira que se juntou à equipa de Vendas esta semana.',                    img: null, corpo: 'Damos as boas-vindas ao Miguel Ferreira que se juntou à equipa de Vendas esta semana. O Miguel tem experiência na área automóvel e virá reforçar a equipa comercial. Podem encontrá-lo no piso 1. Sejam simpáticos!' },
  { titulo: 'Encerramento — feriado 10 de junho',    categoria: 'Geral',             data: '20 Mai 2026', resumo: 'Recordamos que no dia 10 de junho as instalações estarão encerradas.',                                     img: null, corpo: 'Recordamos que no dia 10 de junho, Dia de Portugal, as instalações estarão encerradas. O serviço de urgências estará disponível através do número habitual. Bom feriado a todos!' },
]

const FUNCIONARIOS = [
  { nome: 'Ana Costa',     cargo: 'Recursos Humanos',   departamento: 'Recursos Humanos', telefone: '+351 910 000 001', extensao: '101', email: 'ana.costa@autocrescente.pt' },
  { nome: 'Carlos Mota',   cargo: 'Técnico Informático', departamento: 'Tecnologia',       telefone: '+351 910 000 002', extensao: '201', email: 'carlos.mota@autocrescente.pt' },
  { nome: 'Sofia Lima',    cargo: 'Gestora de Vendas',   departamento: 'Comercial',        telefone: '+351 910 000 003', extensao: '301', email: 'sofia.lima@autocrescente.pt' },
  { nome: 'João Ferreira', cargo: 'Contabilista',        departamento: 'Financeiro',       telefone: '+351 910 000 004', extensao: '401', email: 'joao.ferreira@autocrescente.pt' },
  { nome: 'Marta Santos',  cargo: 'Rececionista',        departamento: 'Geral',            telefone: '+351 910 000 005', extensao: '100', email: 'marta.santos@autocrescente.pt' },
  { nome: 'Pedro Jardim',  cargo: 'Técnico Informático', departamento: 'Tecnologia',       telefone: '+351 910 000 006', extensao: '202', email: 'pedro.jardim@autocrescente.pt' },
  { nome: 'Filipa Rocha',  cargo: 'Marketing Digital',   departamento: 'Marketing',        telefone: '+351 910 000 007', extensao: '501', email: 'filipa.rocha@autocrescente.pt' },
  { nome: 'Bruno Alves',   cargo: 'Vendedor',            departamento: 'Comercial',        telefone: '+351 910 000 008', extensao: '302', email: 'bruno.alves@autocrescente.pt' },
]

const APPS = [
  { nome: 'Sistema de Tickets', desc: 'Pedidos de suporte interno',          cor: '#6366f1', inicial: 'T', url: '#' },
  { nome: 'Email Corporativo',  desc: 'Webmail da empresa',                   cor: '#ea580c', inicial: 'E', url: '#' },
  { nome: 'ERP Autocrescente',  desc: 'Sistema de gestão empresarial',        cor: '#0891b2', inicial: 'E', url: '#' },
  { nome: 'Drive Partilhado',   desc: 'Documentos e ficheiros da empresa',    cor: '#16a34a', inicial: 'D', url: '#' },
  { nome: 'Ponto Eletrónico',   desc: 'Registo de entradas e saídas',         cor: '#d97706', inicial: 'P', url: '#' },
  { nome: 'Portal RH',          desc: 'Férias, faltas e documentos pessoais', cor: '#9333ea', inicial: 'R', url: '#' },
]

const CATEGORIA_COR = {
  'Recursos Humanos': { bg: '#eef2ff', color: '#6366f1' },
  'Tecnologia':       { bg: '#fff7ed', color: '#ea580c' },
  'Geral':            { bg: '#f0fdf4', color: '#16a34a' },
}

const CORES = ['#6366f1', '#ea580c', '#16a34a', '#d97706', '#0891b2', '#9333ea', '#dc2626', '#0d9488']

function getIniciais(nome) {
  const p = nome.split(' ')
  return (p[0][0] + (p[1]?.[0] || '')).toUpperCase()
}

/* ── SECÇÕES ── */
function SecaoComunicados() {
  const [aberto, setAberto] = useState(null)
  const filtrados = COMUNICADOS

  return (
    <div className="home-main">
      <h2 className="home-section-title">Comunicados Recentes</h2>
      {filtrados.length === 0 && (
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>Sem comunicados nesta categoria.</p>
      )}

      {filtrados.length > 0 && (
        <>
          <div className="home-destaque" onClick={() => setAberto(filtrados[0])}>
            {filtrados[0].img && <img className="home-destaque-img" src={filtrados[0].img} alt="" />}
            <div className="home-destaque-body">
              <div className="home-destaque-badges">
                <span className="home-badge" style={{ background: CATEGORIA_COR[filtrados[0].categoria].bg, color: CATEGORIA_COR[filtrados[0].categoria].color }}>
                  {filtrados[0].categoria}
                </span>
                <span className="home-badge-novo">Novo</span>
              </div>
              <h3 className="home-destaque-titulo">{filtrados[0].titulo}</h3>
              <p className="home-destaque-resumo">{filtrados[0].resumo}</p>
              <span className="home-destaque-data">{filtrados[0].data}</span>
            </div>
          </div>
          <div className="home-noticias">
            {filtrados.slice(1).map((c, i) => {
              const cat = CATEGORIA_COR[c.categoria]
              return (
                <div key={i} className="home-noticia" onClick={() => setAberto(c)}>
                  {c.img && <img className="home-noticia-img" src={c.img} alt="" />}
                  <div className="home-noticia-body">
                    <div className="home-noticia-meta">
                      <span className="home-badge" style={{ background: cat.bg, color: cat.color }}>{c.categoria}</span>
                      <span className="home-noticia-data">{c.data}</span>
                    </div>
                    <p className="home-noticia-titulo">{c.titulo}</p>
                    <p className="home-noticia-resumo">{c.resumo}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {aberto && (
        <div className="home-overlay" onClick={() => setAberto(null)}>
          <div className="home-artigo" onClick={e => e.stopPropagation()}>
            <button className="home-perfil-close" onClick={() => setAberto(null)}><X size={17} /></button>
            {aberto.img && <img className="home-artigo-img" src={aberto.img} alt="" />}
            <div className="home-artigo-body">
              <div className="home-noticia-meta">
                <span className="home-badge" style={{ background: CATEGORIA_COR[aberto.categoria].bg, color: CATEGORIA_COR[aberto.categoria].color }}>{aberto.categoria}</span>
                <span className="home-noticia-data">{aberto.data}</span>
              </div>
              <h2 className="home-artigo-titulo">{aberto.titulo}</h2>
              <p className="home-artigo-corpo">{aberto.corpo || aberto.resumo}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SecaoDiretorio() {
  const [search, setSearch] = useState('')
  const [perfil, setPerfil] = useState(null)

  const filtrados = FUNCIONARIOS.filter(f =>
    !search ||
    f.nome.toLowerCase().includes(search.toLowerCase()) ||
    f.cargo.toLowerCase().includes(search.toLowerCase()) ||
    f.departamento.toLowerCase().includes(search.toLowerCase())
  )

  const grupos = filtrados.reduce((acc, f) => {
    if (!acc[f.departamento]) acc[f.departamento] = []
    acc[f.departamento].push(f)
    return acc
  }, {})

  return (
    <div className="home-main">
      <h2 className="home-section-title">Diretório Corporativo</h2>
      <div className="home-search-bar">
        <Search size={15} color="#9ca3af" />
        <input placeholder="Pesquisar por nome ou cargo..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="home-dir-list">
        {Object.entries(grupos).map(([dept, pessoas]) => (
          <div key={dept}>
            <p className="home-dir-group-label">{dept}</p>
            {pessoas.map((f, i) => (
              <div key={i} className="home-dir-card">
                <div className="home-dir-avatar" style={{ background: CORES[FUNCIONARIOS.indexOf(f) % CORES.length] }}>{getIniciais(f.nome)}</div>
                <div className="home-dir-info">
                  <span className="home-dir-nome">{f.nome}</span>
                  <span className="home-dir-cargo">{f.cargo}</span>
                  <div className="home-dir-contacts">
                    <div className="home-dir-contact-row">
                      <span className="home-dir-contact-text"><Phone size={12} />{f.telefone}</span>
                      <div className="home-dir-action-btns">
                        <a href={`tel:${f.telefone}`} className="home-dir-action" title="Ligar"><Phone size={12} /></a>
                        <a href={`sms:${f.telefone}`} className="home-dir-action" title="SMS"><MessageSquare size={12} /></a>
                      </div>
                    </div>
                    {f.extensao && (
                      <span className="home-dir-contact-text"><Hash size={12} />Extensão {f.extensao}</span>
                    )}
                    <a href={`mailto:${f.email}`} className="home-dir-contact"><Mail size={12} />{f.email}</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {perfil && (
        <div className="home-overlay" onClick={() => setPerfil(null)}>
          <div className="home-perfil" onClick={e => e.stopPropagation()}>
            <button className="home-perfil-close" onClick={() => setPerfil(null)}><X size={17} /></button>
            <div className="home-perfil-avatar" style={{ background: CORES[FUNCIONARIOS.indexOf(perfil) % CORES.length] }}>{getIniciais(perfil.nome)}</div>
            <h3 className="home-perfil-nome">{perfil.nome}</h3>
            <p className="home-perfil-cargo">{perfil.cargo}</p>
            <span className="home-perfil-dept">{perfil.departamento}</span>
            <div className="home-perfil-rows">
              <div className="home-perfil-row"><Phone size={14} /><a href={`tel:${perfil.telefone}`}>{perfil.telefone}</a></div>
              <div className="home-perfil-row"><Mail size={14} /><a href={`mailto:${perfil.email}`}>{perfil.email}</a></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SecaoApps() {
  return (
    <div className="home-main">
      <h2 className="home-section-title">Aplicações</h2>
      <div className="home-apps-list">
        {APPS.map((app, i) => (
          <a key={i} href={app.url} className="home-app-card" target="_blank" rel="noreferrer">
            <div className="home-app-icon" style={{ background: app.cor }}>{app.inicial}</div>
            <div className="home-app-info">
              <span className="home-app-nome">{app.nome}</span>
              <span className="home-app-desc">{app.desc}</span>
            </div>
            <ExternalLink size={14} className="home-app-arrow" />
          </a>
        ))}
      </div>
    </div>
  )
}

/* ── HOME ── */
function Home({ onNavigate }) {
  const [section, setSection] = useState('comunicados')
  const [ticketsPendentes, setTicketsPendentes] = useState(null)

  useEffect(() => {
    getTickets({ status: 'aberto' })
      .then(data => setTicketsPendentes((data.tickets || []).length))
      .catch(() => setTicketsPendentes(null))
  }, [])

  const navItems = [
    { key: 'comunicados', icon: LayoutGrid, label: 'Comunicados' },
    { key: 'diretorio',   icon: Users,      label: 'Diretório'   },
    { key: 'apps',        icon: AppWindow,  label: 'Aplicações'  },
  ]

  return (
    <div className="home-page">
      <header className="home-top">
        <img src="/logo.png" alt="Autocrescente" className="home-logo" />
        <span className="home-top-label">Portal Interno</span>
      </header>

      <div className="home-body">

        <div key={section} className="home-section-anim">
          {section === 'comunicados' && <SecaoComunicados />}
          {section === 'diretorio'   && <SecaoDiretorio />}
          {section === 'apps'        && <SecaoApps />}
        </div>

        <aside className="home-sidebar">
          <div className="home-sidebar-card">
            <p className="home-sidebar-title">Acesso Rápido</p>
            <button className="home-sidebar-btn home-btn-ticket" onClick={() => onNavigate('form')}>
              <Ticket size={17} strokeWidth={1.5} />
              <span>Abrir Ticket</span>
              {ticketsPendentes > 0 && (
                <span className="home-ticket-badge">{ticketsPendentes}</span>
              )}
            </button>

            <div className="home-sidebar-divider" />

            {navItems.map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                className={`home-sidebar-btn ${section === key ? 'home-btn-active' : ''}`}
                onClick={() => setSection(key)}
              >
                <Icon size={17} strokeWidth={1.5} />
                <span>{label}</span>
                <ChevronRight size={14} className="home-btn-arrow" />
              </button>
            ))}

            <div className="home-sidebar-divider" />

            <button className="home-sidebar-btn home-btn-muted" onClick={() => onNavigate('backoffice')}>
              <Settings size={17} strokeWidth={1.5} />
              <span>Backoffice</span>
              <ChevronRight size={14} className="home-btn-arrow" />
            </button>
          </div>
        </aside>

      </div>
    </div>
  )
}

export default Home
