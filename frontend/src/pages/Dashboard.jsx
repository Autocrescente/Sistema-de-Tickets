import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Ticket, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'
import './Dashboard.css'

const statsData = [
  { label: 'Abertos',      value: 12, icon: <Ticket size={20} />,       bg: 'linear-gradient(135deg, #6366f1, #8b5cf6)', trend: +3, up: true  },
  { label: 'Em Progresso', value: 5,  icon: <Clock size={20} />,        bg: 'linear-gradient(135deg, #ea580c, #f97316)', trend: -1, up: false },
  { label: 'Aguarda',      value: 3,  icon: <AlertCircle size={20} />,  bg: 'linear-gradient(135deg, #d97706, #fbbf24)', trend: +1, up: true  },
  { label: 'Resolvidos',   value: 28, icon: <CheckCircle size={20} />,  bg: 'linear-gradient(135deg, #16a34a, #22c55e)', trend: +5, up: true  },
  { label: 'Fechados',     value: 41, icon: <XCircle size={20} />,      bg: 'linear-gradient(135deg, #6b7280, #9ca3af)', trend: +2, up: true  },
]

const weekData = [
  { label: 'Seg', abertos: 4, fechados: 2 },
  { label: 'Ter', abertos: 7, fechados: 5 },
  { label: 'Qua', abertos: 3, fechados: 4 },
  { label: 'Qui', abertos: 9, fechados: 6 },
  { label: 'Sex', abertos: 5, fechados: 7 },
  { label: 'Sáb', abertos: 2, fechados: 3 },
  { label: 'Dom', abertos: 1, fechados: 1 },
]

const monthData = [
  { label: 'Semana 1', abertos: 18, fechados: 12 },
  { label: 'Semana 2', abertos: 22, fechados: 19 },
  { label: 'Semana 3', abertos: 15, fechados: 20 },
  { label: 'Semana 4', abertos: 27, fechados: 24 },
]

const priorityList = [
  { name: 'Urgente', value: 5,  color: '#dc2626', bg: '#fef2f2', gradient: 'linear-gradient(135deg, #dc2626, #ef4444)' },
  { name: 'Alta',    value: 10, color: '#ea580c', bg: '#fff7ed', gradient: 'linear-gradient(135deg, #ea580c, #f97316)' },
  { name: 'Normal',  value: 22, color: '#6366f1', bg: '#eef2ff', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
  { name: 'Baixa',   value: 7,  color: '#16a34a', bg: '#f0fdf4', gradient: 'linear-gradient(135deg, #16a34a, #22c55e)' },
]
const priorityTotal = priorityList.reduce((s, i) => s + i.value, 0)

const deptData = [
  { dept: 'Informática', tickets: 18 },
  { dept: 'Recursos Hum.', tickets: 12 },
  { dept: 'Comercial', tickets: 9 },
  { dept: 'Armazém', tickets: 7 },
  { dept: 'Contabilidade', tickets: 5 },
]

const deptAvgData = [
  { label: 'Informática',   time: '3h 20min', color: '#6366f1', pct: 27  },
  { label: 'Recursos Hum.', time: '8h 45min', color: '#8b5cf6', pct: 70  },
  { label: 'Comercial',     time: '5h 10min', color: '#ea580c', pct: 41  },
  { label: 'Armazém',       time: '12h 30min',color: '#d97706', pct: 100 },
  { label: 'Contabilidade', time: '6h 00min', color: '#16a34a', pct: 48  },
]

const recentTickets = [
  { number: 'TKT-20250527-0009', name: 'Ana Costa',     subject: 'Problema com impressora',       priority: 'urgente', status: 'aberto'       },
  { number: 'TKT-20250527-0008', name: 'Carlos Mota',   subject: 'Acesso ao sistema ERP',         priority: 'alta',    status: 'em_progresso' },
  { number: 'TKT-20250527-0007', name: 'Sofia Lima',    subject: 'Pedido de material escritório', priority: 'normal',  status: 'aguarda'      },
  { number: 'TKT-20250526-0012', name: 'João Ferreira', subject: 'Email corporativo bloqueado',   priority: 'alta',    status: 'resolvido'    },
  { number: 'TKT-20250526-0010', name: 'Marta Santos',  subject: 'Atualização de software',       priority: 'baixa',   status: 'fechado'      },
]

const priorityColors = { urgente: '#dc2626', alta: '#ea580c', normal: '#6366f1', baixa: '#16a34a' }
const priorityBg     = { urgente: '#fef2f2', alta: '#fff7ed', normal: '#eef2ff', baixa: '#f0fdf4' }
const statusLabel    = { aberto: 'Aberto', em_progresso: 'Em Progresso', aguarda: 'Aguarda', resolvido: 'Resolvido', fechado: 'Fechado' }
const statusColor    = { aberto: '#6366f1', em_progresso: '#ea580c', aguarda: '#d97706', resolvido: '#16a34a', fechado: '#6b7280' }
const statusBg       = { aberto: '#eef2ff', em_progresso: '#fff7ed', aguarda: '#fffbeb', resolvido: '#f0fdf4', fechado: '#f9fafb' }

const RESOLUTION_RATE = 73
const R = 30
const CIRCUMFERENCE = 2 * Math.PI * R

function Dashboard() {
  const [period, setPeriod] = useState('semana')
  const chartData = period === 'semana' ? weekData : monthData

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Visão geral dos pedidos de suporte</p>
        </div>
        <span className="dashboard-date">27 de maio de 2025</span>
      </div>

      {/* STAT CARDS */}
      <div className="stats-grid">
        {statsData.map((stat) => (
          <div className="stat-card" key={stat.label} style={{ background: stat.bg }}>
            <div className="stat-top">
              <div className="stat-icon">{stat.icon}</div>
              <div className={`stat-trend ${stat.up ? 'up' : 'down'}`}>
                {stat.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {Math.abs(stat.trend)}
              </div>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div className="charts-row">

        {/* FLOW CARD */}
        <div className="flow-card">
          <div className="flow-toggle-row">
            <span className="flow-title">Fluxo de Tickets</span>
            <div className="period-toggle period-toggle-light">
              <button className={period === 'semana' ? 'active' : ''} onClick={() => setPeriod('semana')}>Semana</button>
              <button className={period === 'mes' ? 'active' : ''} onClick={() => setPeriod('mes')}>Mês</button>
            </div>
          </div>
          <div className="flow-panels">
            <div className="flow-panel" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <div className="flow-panel-icon"><Ticket size={18} color="rgba(255,255,255,0.7)" /></div>
              <div className="flow-panel-num">{chartData.reduce((s, d) => s + d.abertos, 0)}</div>
              <div className="flow-panel-lbl">Abertos</div>
              <div className="flow-panel-trend"><TrendingUp size={11} /> +3 vs anterior</div>
            </div>
            <div className="flow-panel" style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)' }}>
              <div className="flow-panel-icon"><CheckCircle size={18} color="rgba(255,255,255,0.7)" /></div>
              <div className="flow-panel-num">{chartData.reduce((s, d) => s + d.fechados, 0)}</div>
              <div className="flow-panel-lbl">Fechados</div>
              <div className="flow-panel-trend"><TrendingUp size={11} /> +5 vs anterior</div>
            </div>
          </div>
          <div className="flow-ratio-wrap">
            <span className="flow-ratio-lbl">Taxa de fecho</span>
            <span className="flow-ratio-val">
              {Math.round((chartData.reduce((s,d) => s+d.fechados, 0) / chartData.reduce((s,d) => s+d.abertos, 0)) * 100)}%
            </span>
          </div>
          <div className="flow-ratio-bar-bg">
            <div className="flow-ratio-bar-fill" style={{
              width: `${Math.round((chartData.reduce((s,d) => s+d.fechados,0) / chartData.reduce((s,d) => s+d.abertos,0)) * 100)}%`
            }} />
          </div>
        </div>

        {/* PRIORITY GRADIENT CARDS */}
        <div className="priority-card-wrap">
          <div className="priority-card-title">Por Prioridade</div>
          <div className="priority-grad-grid">
            {priorityList.map(item => (
              <div className="priority-grad-box" key={item.name} style={{ background: item.gradient }}>
                <div className="priority-grad-num">{item.value}</div>
                <div className="priority-grad-name">{item.name}</div>
                <div className="priority-grad-pct">{Math.round((item.value / priorityTotal) * 100)}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* RESOLUTION RATE + DEPT AVG TIMES */}
        <div className="avg-card">
          <div className="resolution-wrap">
            <svg width="90" height="90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r={R} fill="none" stroke="#f3f4f6" strokeWidth="8" />
              <circle
                cx="40" cy="40" r={R}
                fill="none"
                stroke="#6366f1"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(RESOLUTION_RATE / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                transform="rotate(-90 40 40)"
              />
            </svg>
            <div className="resolution-center">
              <span className="resolution-pct">{RESOLUTION_RATE}%</span>
            </div>
          </div>
          <p className="resolution-label">Taxa de resolução</p>
          <p className="resolution-sub">Este mês</p>

          <div className="avg-divider" />

          <p className="avg-dept-title">Tempo médio por departamento</p>
          {deptAvgData.map(item => (
            <div className="avg-bar-row" key={item.label}>
              <div className="avg-bar-header">
                <span className="avg-bar-label">{item.label}</span>
                <span className="avg-bar-time" style={{ color: item.color }}>{item.time}</span>
              </div>
              <div className="avg-bar-bg">
                <div className="avg-bar-fill" style={{ width: `${item.pct}%`, background: item.color }} />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* BOTTOM ROW */}
      <div className="bottom-row">

        <div className="chart-card dept-card">
          <h2>Tickets por Departamento</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={deptData} layout="vertical" barSize={14}>
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <YAxis type="category" dataKey="dept" axisLine={false} tickLine={false} tick={{ fill: '#374151', fontSize: 12 }} width={95} />
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="tickets" fill="#8b5cf6" radius={[0,6,6,0]} name="Tickets" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="recent-card">
          <div className="recent-header">
            <h2>Tickets Recentes</h2>
            <button className="see-all">Ver todos <ArrowRight size={13} /></button>
          </div>
          <table className="recent-table">
            <thead>
              <tr>
                <th>Número</th>
                <th>Requerente</th>
                <th>Assunto</th>
                <th>Prioridade</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {recentTickets.map((t) => (
                <tr key={t.number}>
                  <td className="ticket-num">{t.number}</td>
                  <td>{t.name}</td>
                  <td className="ticket-subject">{t.subject}</td>
                  <td>
                    <span className="badge" style={{ color: priorityColors[t.priority], background: priorityBg[t.priority] }}>
                      {t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}
                    </span>
                  </td>
                  <td>
                    <span className="badge" style={{ color: statusColor[t.status], background: statusBg[t.status] }}>
                      {statusLabel[t.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  )
}

export default Dashboard
