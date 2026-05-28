import { useEffect, useState } from 'react'
import { Search, RefreshCw } from 'lucide-react'
import { getTickets } from '../services/api'
import './Historico.css'


const statusColor = { aberto: '#6366f1', em_progresso: '#ea580c', aguarda: '#d97706', resolvido: '#16a34a', fechado: '#6b7280' }
const statusBg    = { aberto: '#eef2ff', em_progresso: '#fff7ed', aguarda: '#fffbeb', resolvido: '#f0fdf4', fechado: '#f9fafb' }
const statusLabel = { aberto: 'Aberto', em_progresso: 'Em Progresso', aguarda: 'Aguarda', resolvido: 'Resolvido', fechado: 'Fechado' }
const priorityColor = { urgente: '#dc2626', alta: '#ea580c', normal: '#6366f1', baixa: '#16a34a' }
const priorityBg    = { urgente: '#fef2f2', alta: '#fff7ed', normal: '#eef2ff', baixa: '#f0fdf4' }

function Historico({ onTicketClick }) {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')

  const load = () => {
    setLoading(true)
    getTickets({ limit: 200 })
      .then(data => setTickets(data.tickets || []))
      .catch(() => setTickets([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSearch = (e) => { e.preventDefault(); load() }

  return (
    <div className="hi-page">

      <div className="hi-header">
        <div>
          <h1>Histórico</h1>
          <p>Todos os tickets, incluindo resolvidos e fechados</p>
        </div>
        <button className="hi-refresh" onClick={load}><RefreshCw size={15} /></button>
      </div>


      {/* SEARCH */}
      <form className="hi-search" onSubmit={handleSearch}>
        <Search size={15} color="#9ca3af" />
        <input
          type="text"
          placeholder="Pesquisar por número, nome ou assunto..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </form>

      {/* TABELA */}
      <div className="hi-card">
        <table className="hi-table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Requerente</th>
              <th>Assunto</th>
              <th>Prioridade</th>
              <th>Estado</th>
              <th>Criado em</th>
              <th>Última alteração</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} className="hi-center">A carregar...</td></tr>
            )}
            {!loading && tickets.length === 0 && (
              <tr><td colSpan={7} className="hi-center">Nenhum ticket encontrado.</td></tr>
            )}
            {!loading && tickets
              .filter(t =>
                !search ||
                t.ticketNumber?.toLowerCase().includes(search.toLowerCase()) ||
                t.firstName?.toLowerCase().includes(search.toLowerCase()) ||
                t.lastName?.toLowerCase().includes(search.toLowerCase()) ||
                t.subject?.toLowerCase().includes(search.toLowerCase()) ||
                t.email?.toLowerCase().includes(search.toLowerCase())
              )
              .map(t => (
                <tr key={t._id} className="hi-row" onClick={() => onTicketClick?.(t)}>
                  <td className="hi-num">{t.ticketNumber}</td>
                  <td>{t.firstName} {t.lastName}</td>
                  <td className="hi-subject">{t.subject}</td>
                  <td>
                    <span className="hi-badge" style={{ color: priorityColor[t.priority], background: priorityBg[t.priority] }}>
                      {t.priority?.charAt(0).toUpperCase() + t.priority?.slice(1)}
                    </span>
                  </td>
                  <td>
                    <span className="hi-badge" style={{ color: statusColor[t.status], background: statusBg[t.status] }}>
                      {statusLabel[t.status] || t.status}
                    </span>
                  </td>
                  <td className="hi-date">{new Date(t.createdAt).toLocaleString('pt-PT')}</td>
                  <td className="hi-date">{new Date(t.updatedAt).toLocaleString('pt-PT')}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default Historico
