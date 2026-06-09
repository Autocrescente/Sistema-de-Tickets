import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import './Comunicados.css'

const COMUNICADOS = [
  {
    id: 1,
    titulo: 'Atualização da política de férias 2026',
    categoria: 'Recursos Humanos',
    data: '2026-05-30',
    resumo: 'A partir de junho de 2026, os pedidos de férias devem ser submetidos com um mínimo de 15 dias de antecedência através do Portal RH.',
    corpo: 'A partir de junho de 2026, os pedidos de férias devem ser submetidos com um mínimo de 15 dias de antecedência através do Portal RH. Esta medida visa melhorar o planeamento das equipas e garantir uma melhor gestão dos recursos humanos. Para mais informações contacte o departamento de RH.',
  },
  {
    id: 2,
    titulo: 'Manutenção do sistema ERP — 7 de junho',
    categoria: 'Tecnologia',
    data: '2026-05-28',
    resumo: 'O sistema ERP estará indisponível no dia 7 de junho das 22h às 02h para manutenção programada.',
    corpo: 'O sistema ERP estará indisponível no dia 7 de junho das 22h às 02h para manutenção programada. Durante este período não será possível aceder a faturas, stocks ou relatórios. Planeie as suas tarefas em conformidade. Em caso de urgência contacte o departamento de Tecnologia.',
  },
  {
    id: 3,
    titulo: 'Novo colaborador — Bem-vindo, Miguel!',
    categoria: 'Geral',
    data: '2026-05-25',
    resumo: 'Damos as boas-vindas ao Miguel Ferreira que se juntou à equipa de Vendas esta semana.',
    corpo: 'Damos as boas-vindas ao Miguel Ferreira que se juntou à equipa de Vendas esta semana. O Miguel tem experiência na área automóvel e virá reforçar a equipa comercial. Podem encontrá-lo no piso 1. Sejam simpáticos!',
  },
  {
    id: 4,
    titulo: 'Encerramento — feriado 10 de junho',
    categoria: 'Geral',
    data: '2026-05-20',
    resumo: 'Recordamos que no dia 10 de junho, Dia de Portugal, as instalações estarão encerradas.',
    corpo: 'Recordamos que no dia 10 de junho, Dia de Portugal, as instalações estarão encerradas. O serviço de urgências estará disponível através do número habitual. Bom feriado a todos!',
  },
]

const CATEGORIA_COR = {
  'Recursos Humanos':         { bg: '#eef2ff', color: '#6366f1' },
  'Tecnologia': { bg: '#fff7ed', color: '#ea580c' },
  'Geral':      { bg: '#f0fdf4', color: '#16a34a' },
}

function formatData(str) {
  return new Date(str).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })
}

function Comunicados({ onBack }) {
  const [aberto, setAberto] = useState(null)

  if (aberto) {
    const c = COMUNICADOS.find(x => x.id === aberto)
    const cat = CATEGORIA_COR[c.categoria] || { bg: '#f4f6f8', color: '#6b7280' }
    return (
      <div className="com-page">
        <div className="com-content">
          <button className="com-back" onClick={() => setAberto(null)}><ChevronLeft size={18} /> Voltar</button>
          <div className="com-detalhe">
            <span className="com-badge" style={{ background: cat.bg, color: cat.color }}>{c.categoria}</span>
            <h1 className="com-detalhe-titulo">{c.titulo}</h1>
            <p className="com-detalhe-data">{formatData(c.data)}</p>
            <p className="com-detalhe-corpo">{c.corpo}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="com-page">
      <div className="com-content">

        <div className="com-header">
          <button className="com-back" onClick={onBack}><ChevronLeft size={18} /> Voltar</button>
          <h1 className="com-title">Comunicados</h1>
          <p className="com-sub">{COMUNICADOS.length} comunicados recentes</p>
        </div>

        <div className="com-list">
          {COMUNICADOS.map(c => {
            const cat = CATEGORIA_COR[c.categoria] || { bg: '#f4f6f8', color: '#6b7280' }
            return (
              <div key={c.id} className="com-card" onClick={() => setAberto(c.id)}>
                <div className="com-card-top">
                  <span className="com-badge" style={{ background: cat.bg, color: cat.color }}>{c.categoria}</span>
                  <span className="com-data">{formatData(c.data)}</span>
                </div>
                <p className="com-card-titulo">{c.titulo}</p>
                <p className="com-card-resumo">{c.resumo}</p>
                <div className="com-card-footer">
                  <span>Ler mais</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}

export default Comunicados
