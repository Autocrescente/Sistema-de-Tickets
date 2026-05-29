import { useEffect, useState } from 'react'
import { Search, RefreshCw, X, Send, Pencil, Trash2, Check, Plus, Ticket, Clock, Users, BarChart2 } from 'lucide-react'
import { getTickets, getTicket, updateTicket, deleteTicket, addComment } from '../services/api'
import TicketForm from './TicketForm'
import Historico from './Historico'
import './Backoffice.css'

const DESTINATARIOS = [
  { nome: 'João Pedro',     departamento: 'Informática'        },
  { nome: 'João Ferreira',  departamento: 'Comercial'          },
  { nome: 'Ana Costa',      departamento: 'Recursos Humanos'   },
  { nome: 'Carlos Mota',    departamento: 'Contabilidade'      },
  { nome: 'Sofia Lima',     departamento: 'Receção'            },
  { nome: 'Marta Santos',   departamento: 'Peças e Acessórios' },
  { nome: 'Rui Oliveira',   departamento: 'Oficina'            },
  { nome: 'Inês Rodrigues', departamento: 'Administração'      },
]

const MOCK_TICKETS = [
  { _id: '1', ticketNumber: 'TKT-20260528-0001', firstName: 'Ana',    lastName: 'Costa',    subject: 'Problema com impressora',        priority: 'urgente', status: 'aberto',       createdAt: '2026-05-28T09:00:00Z' },
  { _id: '2', ticketNumber: 'TKT-20260528-0002', firstName: 'Carlos', lastName: 'Mota',     subject: 'Acesso ao sistema ERP',           priority: 'alta',    status: 'em_progresso', createdAt: '2026-05-28T10:00:00Z' },
  { _id: '3', ticketNumber: 'TKT-20260527-0005', firstName: 'Sofia',  lastName: 'Lima',     subject: 'Pedido de material de escritório', priority: 'normal',  status: 'aguarda',      createdAt: '2026-05-27T14:00:00Z' },
  { _id: '4', ticketNumber: 'TKT-20260527-0003', firstName: 'João',   lastName: 'Ferreira', subject: 'Email corporativo bloqueado',     priority: 'alta',    status: 'resolvido',    createdAt: '2026-05-27T08:00:00Z' },
  { _id: '5', ticketNumber: 'TKT-20260526-0008', firstName: 'Marta',  lastName: 'Santos',   subject: 'Atualização de software',         priority: 'baixa',   status: 'fechado',      createdAt: '2026-05-26T16:00:00Z' },
]

const STATUS_TABS = [
  { value: '',             label: 'Todos'        },
  { value: 'aberto',       label: 'Aberto'       },
  { value: 'em_progresso', label: 'Em Progresso' },
  { value: 'aguarda',      label: 'Aguarda'      },
  { value: 'resolvido',    label: 'Resolvido'    },
  { value: 'fechado',      label: 'Fechado'      },
]

const PRIORITY_OPTS = [
  { value: '',        label: 'Todas prioridades' },
  { value: 'urgente', label: 'Urgente'           },
  { value: 'alta',    label: 'Alta'              },
  { value: 'normal',  label: 'Normal'            },
  { value: 'baixa',   label: 'Baixa'             },
]

const statusColor   = { aberto: '#6366f1', em_progresso: '#ea580c', aguarda: '#d97706', resolvido: '#16a34a', fechado: '#6b7280' }
const statusBg      = { aberto: '#eef2ff', em_progresso: '#fff7ed', aguarda: '#fffbeb', resolvido: '#f0fdf4', fechado: '#f9fafb' }
const priorityColor = { urgente: '#dc2626', alta: '#ea580c', normal: '#6366f1', baixa: '#16a34a' }
const priorityBg    = { urgente: '#fef2f2', alta: '#fff7ed', normal: '#eef2ff', baixa: '#f0fdf4' }

const NAV_ITEMS = [
  { key: 'tickets',   label: 'Tickets',        icon: Ticket   },
  { key: 'history',   label: 'Histórico',      icon: Clock    },
  { key: 'users',     label: 'Utilizadores',   icon: Users    },
  { key: 'dashboard', label: 'Dashboard',      icon: BarChart2},
]

function ComingSoon({ title }) {
  return (
    <div className="bo-coming-soon">
      <p className="bo-coming-title">{title}</p>
      <p className="bo-coming-sub">Em desenvolvimento — em breve disponível.</p>
    </div>
  )
}

function Backoffice() {
  const [page, setPage]           = useState('tickets')
  const [tickets, setTickets]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [search, setSearch]       = useState('')
  const [statusTab, setStatusTab] = useState('')
  const [priority, setPriority]   = useState('')

  const [drawer, setDrawer]             = useState(null)
  const [drawerLoading, setDrawerLoading] = useState(false)
  const [newComment, setNewComment]     = useState('')
  const [commentAuthor, setCommentAuthor] = useState('')
  const [reassignTo, setReassignTo]     = useState('')
  const [savingComment, setSavingComment] = useState(false)
  const [savingReassign, setSavingReassign] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState({})
  const [newTicketModal, setNewTicketModal] = useState(false)

  const load = () => {
    setLoading(true)
    setError('')
    const params = {}
    if (statusTab) params.status   = statusTab
    if (priority)  params.priority = priority
    if (search)    params.search   = search
    getTickets(params)
      .then(data => setTickets(data.tickets || []))
      .catch(() => setTickets(MOCK_TICKETS))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [statusTab, priority])

  const handleSearch = (e) => { e.preventDefault(); load() }

  const handleStatus = async (id, newStatus) => {
    try {
      const updated = await updateTicket(id, { status: newStatus })
      setTickets(prev => prev.map(t => t._id === id ? { ...t, status: updated.status } : t))
      if (drawer?._id === id) setDrawer(prev => ({ ...prev, status: updated.status }))
    } catch {
      alert('Erro ao atualizar estado')
    }
  }

  const openDrawer = async (ticket) => {
    setDrawer(ticket)
    setReassignTo(ticket.recipient || '')
    setNewComment('')
    setCommentAuthor('')
    setDrawerLoading(true)
    try {
      const full = await getTicket(ticket._id)
      setDrawer(full)
      setReassignTo(full.recipient || '')
    } catch {
      // mantém dados parciais
    } finally {
      setDrawerLoading(false)
    }
  }

  const closeDrawer = () => {
    setDrawer(null)
    setNewComment('')
    setCommentAuthor('')
    setReassignTo('')
    setEditMode(false)
    setEditData({})
  }

  const startEdit = () => {
    setEditData({
      subject:     drawer.subject     || '',
      description: drawer.description || '',
      priority:    drawer.priority    || 'normal',
    })
    setEditMode(true)
  }

  const handleSaveEdit = async () => {
    try {
      const updated = await updateTicket(drawer._id, editData)
      setDrawer(prev => ({ ...prev, ...updated }))
      setTickets(prev => prev.map(t => t._id === drawer._id ? { ...t, ...updated } : t))
      setEditMode(false)
    } catch {
      alert('Erro ao guardar alterações')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Tens a certeza que queres apagar este ticket?')) return
    try {
      await deleteTicket(drawer._id)
      setTickets(prev => prev.filter(t => t._id !== drawer._id))
      closeDrawer()
    } catch {
      alert('Erro ao apagar ticket')
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim() || !commentAuthor.trim()) return
    setSavingComment(true)
    try {
      const comment = await addComment(drawer._id, { author: commentAuthor, text: newComment })
      setDrawer(prev => ({ ...prev, comments: [...(prev.comments || []), comment] }))
      setNewComment('')
    } catch {
      alert('Erro ao adicionar comentário')
    } finally {
      setSavingComment(false)
    }
  }

  const openNewTicket = () => setNewTicketModal(true)

  const handleNewTicketSuccess = () => {
    setNewTicketModal(false)
    load()
  }

  const handleReassign = async () => {
    if (!reassignTo.trim()) return
    setSavingReassign(true)
    try {
      await updateTicket(drawer._id, { recipient: reassignTo })
      setDrawer(prev => ({ ...prev, recipient: reassignTo }))
      setTickets(prev => prev.map(t => t._id === drawer._id ? { ...t, recipient: reassignTo } : t))
    } catch {
      alert('Erro ao reatribuir ticket')
    } finally {
      setSavingReassign(false)
    }
  }

  return (
    <div className="bo-layout">

      {/* SIDEBAR */}
      <aside className="bo-sidebar">
        <div className="bo-sidebar-brand">
          <img src="/logo.png" alt="Autocrescente" className="bo-sidebar-logo" />
        </div>
        <nav className="bo-nav">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`bo-nav-item ${page === key ? 'active' : ''}`}
              onClick={() => setPage(key)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* CONTEÚDO */}
      <main className="bo-main">

      {page === 'history'   && <Historico onTicketClick={openDrawer} />}
      {page === 'users'     && <ComingSoon title="Gestão de Utilizadores" />}
      {page === 'dashboard' && <ComingSoon title="Dashboard e Métricas" />}

      {page === 'tickets' && (
      <div className="bo-page">

      <div className="bo-header">
        <div>
          <h1>Backoffice</h1>
          <p>Gestão de tickets de suporte</p>
        </div>
        <div className="bo-header-btns">
          <button className="bo-new-btn" onClick={openNewTicket}><Plus size={15} /> Novo Ticket</button>
          <button className="bo-refresh" onClick={load}><RefreshCw size={15} /></button>
        </div>
      </div>

      <div className="bo-toolbar">
        <form className="bo-search" onSubmit={handleSearch}>
          <Search size={15} color="#9ca3af" />
          <input
            type="text"
            placeholder="Pesquisar por número, nome, email ou assunto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </form>
        <select className="bo-select" value={priority} onChange={e => setPriority(e.target.value)}>
          {PRIORITY_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div className="bo-tabs">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.value}
            className={`bo-tab ${statusTab === tab.value ? 'active' : ''}`}
            onClick={() => setStatusTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && <p className="bo-error">{error}</p>}

      <div className="bo-card">
        <table className="bo-table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Requerente</th>
              <th>Assunto</th>
              <th>Prioridade</th>
              <th>Estado</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="bo-center">A carregar...</td></tr>
            )}
            {!loading && tickets.length === 0 && (
              <tr><td colSpan={6} className="bo-center">Nenhum ticket encontrado.</td></tr>
            )}
            {!loading && tickets.map(t => (
              <tr key={t._id} className="bo-row-clickable" onClick={() => openDrawer(t)}>
                <td className="bo-num">{t.ticketNumber}</td>
                <td>{t.firstName} {t.lastName}</td>
                <td className="bo-subject">{t.subject}</td>
                <td>
                  <span className="bo-badge" style={{ color: priorityColor[t.priority], background: priorityBg[t.priority] }}>
                    {t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}
                  </span>
                </td>
                <td onClick={e => e.stopPropagation()}>
                  <select
                    className="bo-status-select"
                    value={t.status}
                    style={{ color: statusColor[t.status], background: statusBg[t.status] }}
                    onChange={e => handleStatus(t._id, e.target.value)}
                  >
                    <option value="aberto">Aberto</option>
                    <option value="em_progresso">Em Progresso</option>
                    <option value="aguarda">Aguarda</option>
                    <option value="resolvido">Resolvido</option>
                    <option value="fechado">Fechado</option>
                  </select>
                </td>
                <td className="bo-date">{new Date(t.createdAt).toLocaleDateString('pt-PT')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {drawer && (
        <div className="bo-overlay" onClick={closeDrawer}>
          <div className="bo-modal" onClick={e => e.stopPropagation()}>

            <div className="mo-header">
              <div className="mo-header-top">
                <span className="mo-num">{drawer.ticketNumber}</span>
                <div className="mo-badges">
                  <span className="bo-badge" style={{ color: priorityColor[drawer.priority], background: priorityBg[drawer.priority] }}>
                    {drawer.priority?.charAt(0).toUpperCase() + drawer.priority?.slice(1)}
                  </span>
                  <span className="bo-badge" style={{ color: statusColor[drawer.status], background: statusBg[drawer.status] }}>
                    {STATUS_TABS.find(s => s.value === drawer.status)?.label || drawer.status}
                  </span>
                </div>
                <div className="mo-header-actions">
                  {editMode
                    ? <button className="mo-icon-btn mo-icon-save" onClick={handleSaveEdit} title="Guardar"><Check size={16} /></button>
                    : <button className="mo-icon-btn" onClick={startEdit} title="Editar"><Pencil size={15} /></button>
                  }
                  <button className="mo-icon-btn mo-icon-delete" onClick={handleDelete} title="Apagar"><Trash2 size={15} /></button>
                  <button className="dr-close" onClick={closeDrawer}><X size={18} /></button>
                </div>
              </div>
              <h2 className="mo-subject">{editMode
                ? <input className="mo-edit-title" value={editData.subject} onChange={e => setEditData(p => ({ ...p, subject: e.target.value }))} />
                : drawer.subject
              }</h2>
            </div>

            {drawerLoading ? (
              <p className="bo-center" style={{ padding: '40px' }}>A carregar...</p>
            ) : (
              <div className="mo-body">

                <div className="mo-info-card">
                  <div className="mo-info-row">
                    <span className="mo-info-label">Requerente</span>
                    <span className="mo-info-value">{drawer.firstName} {drawer.lastName}</span>
                  </div>
                  <div className="mo-info-row">
                    <span className="mo-info-label">Email</span>
                    <span className="mo-info-value">{drawer.email}</span>
                  </div>
                  {drawer.recipient && (
                    <div className="mo-info-row">
                      <span className="mo-info-label">Destinatário</span>
                      <span className="mo-info-value">{drawer.recipient}</span>
                    </div>
                  )}
                  <div className="mo-info-row mo-info-desc">
                    <span className="mo-info-label">Descrição</span>
                    {editMode
                      ? <textarea className="mo-edit-field" value={editData.description} onChange={e => setEditData(p => ({ ...p, description: e.target.value }))} />
                      : <span className="mo-info-value">{drawer.description || '—'}</span>
                    }
                  </div>
                  {editMode && (
                    <div className="mo-info-row">
                      <span className="mo-info-label">Prioridade</span>
                      <select className="mo-edit-select" value={editData.priority} onChange={e => setEditData(p => ({ ...p, priority: e.target.value }))}>
                        <option value="urgente">Urgente</option>
                        <option value="alta">Alta</option>
                        <option value="normal">Normal</option>
                        <option value="baixa">Baixa</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="mo-actions">
                  <div className="mo-action-block">
                    <p className="mo-action-title">Estado</p>
                    <select
                      className="mo-select"
                      value={drawer.status}
                      style={{ color: statusColor[drawer.status], background: statusBg[drawer.status] }}
                      onChange={e => handleStatus(drawer._id, e.target.value)}
                    >
                      <option value="aberto">Aberto</option>
                      <option value="em_progresso">Em Progresso</option>
                      <option value="aguarda">Aguarda</option>
                      <option value="resolvido">Resolvido</option>
                      <option value="fechado">Fechado</option>
                    </select>
                  </div>
                  <div className="mo-action-block">
                    <p className="mo-action-title">Reatribuir a</p>
                    <div className="mo-reassign-row">
                      <select
                        className="mo-select"
                        value={reassignTo}
                        onChange={e => setReassignTo(e.target.value)}
                      >
                        <option value="">Selecionar...</option>
                        {DESTINATARIOS.map((d, i) => (
                          <option key={i} value={`${d.nome} — ${d.departamento}`}>
                            {d.nome} — {d.departamento}
                          </option>
                        ))}
                      </select>
                      <button
                        className="mo-save-btn"
                        onClick={handleReassign}
                        disabled={savingReassign || !reassignTo.trim()}
                      >
                        {savingReassign ? '...' : 'Guardar'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mo-comments-section">
                  <p className="mo-action-title">Notas Internas</p>
                  <div className="mo-comments-list">
                    {(drawer.comments || []).length === 0 && (
                      <p className="mo-no-comments">Sem notas ainda.</p>
                    )}
                    {(drawer.comments || []).map((c, i) => (
                      <div key={i} className="mo-comment">
                        <div className="mo-comment-header">
                          <span className="mo-comment-author">{c.author}</span>
                          <span className="mo-comment-date">{new Date(c.createdAt).toLocaleString('pt-PT')}</span>
                        </div>
                        <p className="mo-comment-text">{c.text}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mo-add-comment">
                    <input
                      className="mo-input"
                      type="text"
                      placeholder="O teu nome"
                      value={commentAuthor}
                      onChange={e => setCommentAuthor(e.target.value)}
                    />
                    <textarea
                      className="mo-textarea"
                      placeholder="Escreve uma nota interna..."
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                    />
                    <button
                      className="mo-submit-btn"
                      onClick={handleAddComment}
                      disabled={savingComment || !newComment.trim() || !commentAuthor.trim()}
                    >
                      <Send size={14} />
                      {savingComment ? 'A enviar...' : 'Adicionar Nota'}
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {/* NOVO TICKET — formulário público por cima */}
      {newTicketModal && (
        <div className="bo-form-overlay">
          <button className="bo-form-back" onClick={() => setNewTicketModal(false)}>
            <X size={16} /> Fechar
          </button>
          <TicketForm onSuccess={handleNewTicketSuccess} />
        </div>
      )}

      </div>
      )}  {/* fecha bo-page e condicional tickets */}

      </main>
    </div>
  )
}

export default Backoffice
