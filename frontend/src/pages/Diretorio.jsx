import { useState } from 'react'
import { Search, Phone, Mail, ChevronLeft, X } from 'lucide-react'
import './Diretorio.css'

const FUNCIONARIOS = [
  { nome: 'Ana Costa',      cargo: 'Recursos Humanos',  departamento: 'Recursos Humanos',          telefone: '+351 910 000 001', email: 'ana.costa@autocrescente.pt' },
  { nome: 'Carlos Mota',    cargo: 'Técnico Informático', departamento: 'Tecnologia',  telefone: '+351 910 000 002', email: 'carlos.mota@autocrescente.pt' },
  { nome: 'Sofia Lima',     cargo: 'Gestora de Vendas',  departamento: 'Comercial',   telefone: '+351 910 000 003', email: 'sofia.lima@autocrescente.pt' },
  { nome: 'João Ferreira',  cargo: 'Contabilista',       departamento: 'Financeiro',  telefone: '+351 910 000 004', email: 'joao.ferreira@autocrescente.pt' },
  { nome: 'Marta Santos',   cargo: 'Rececionista',       departamento: 'Geral',       telefone: '+351 910 000 005', email: 'marta.santos@autocrescente.pt' },
  { nome: 'Pedro Jardim',   cargo: 'Técnico Informático', departamento: 'Tecnologia',  telefone: '+351 910 000 006', email: 'pedro.jardim@autocrescente.pt' },
  { nome: 'Filipa Rocha',   cargo: 'Marketing Digital',  departamento: 'Marketing',   telefone: '+351 910 000 007', email: 'filipa.rocha@autocrescente.pt' },
  { nome: 'Bruno Alves',    cargo: 'Vendedor',           departamento: 'Comercial',   telefone: '+351 910 000 008', email: 'bruno.alves@autocrescente.pt' },
]

function getIniciais(nome) {
  const partes = nome.split(' ')
  return (partes[0][0] + (partes[1]?.[0] || '')).toUpperCase()
}

const CORES = ['#6366f1', '#ea580c', '#16a34a', '#d97706', '#0891b2', '#9333ea', '#dc2626', '#0d9488']

function Diretorio({ onBack }) {
  const [search, setSearch] = useState('')
  const [perfil, setPerfil] = useState(null)

  const filtrados = FUNCIONARIOS.filter(f =>
    f.nome.toLowerCase().includes(search.toLowerCase()) ||
    f.departamento.toLowerCase().includes(search.toLowerCase()) ||
    f.cargo.toLowerCase().includes(search.toLowerCase())
  )

  const idxPerfil = perfil ? FUNCIONARIOS.indexOf(perfil) : 0

  return (
    <div className="dir-page">
      <div className="dir-content">

        <div className="dir-header">
          <button className="dir-back" onClick={onBack}><ChevronLeft size={18} /> Voltar</button>
          <h1 className="dir-title">Diretório Corporativo</h1>
          <p className="dir-sub">{FUNCIONARIOS.length} colaboradores</p>
        </div>

        <div className="dir-search">
          <Search size={16} color="#9ca3af" />
          <input
            type="text"
            placeholder="Pesquisar por nome, cargo ou departamento..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="dir-list">
          {filtrados.map((f, i) => (
            <div key={i} className="dir-card" onClick={() => setPerfil(f)}>
              <div className="dir-avatar" style={{ background: CORES[i % CORES.length] }}>
                {getIniciais(f.nome)}
              </div>
              <div className="dir-info">
                <span className="dir-nome">{f.nome}</span>
                <span className="dir-cargo">{f.cargo}</span>
                <span className="dir-dept">{f.departamento}</span>
              </div>
              <div className="dir-contacts" onClick={e => e.stopPropagation()}>
                <a href={`tel:${f.telefone}`} className="dir-contact-btn" title={f.telefone}>
                  <Phone size={15} />
                </a>
                <a href={`mailto:${f.email}`} className="dir-contact-btn" title={f.email}>
                  <Mail size={15} />
                </a>
              </div>
            </div>
          ))}
          {filtrados.length === 0 && (
            <p className="dir-empty">Nenhum colaborador encontrado.</p>
          )}
        </div>

      </div>

      {/* MINI PERFIL */}
      {perfil && (
        <div className="dir-overlay" onClick={() => setPerfil(null)}>
          <div className="dir-perfil" onClick={e => e.stopPropagation()}>
            <button className="dir-perfil-close" onClick={() => setPerfil(null)}><X size={18} /></button>
            <div className="dir-perfil-avatar" style={{ background: CORES[idxPerfil % CORES.length] }}>
              {getIniciais(perfil.nome)}
            </div>
            <h2 className="dir-perfil-nome">{perfil.nome}</h2>
            <p className="dir-perfil-cargo">{perfil.cargo}</p>
            <span className="dir-perfil-dept">{perfil.departamento}</span>
            <div className="dir-perfil-rows">
              <div className="dir-perfil-row">
                <Phone size={15} />
                <a href={`tel:${perfil.telefone}`}>{perfil.telefone}</a>
              </div>
              <div className="dir-perfil-row">
                <Mail size={15} />
                <a href={`mailto:${perfil.email}`}>{perfil.email}</a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Diretorio
