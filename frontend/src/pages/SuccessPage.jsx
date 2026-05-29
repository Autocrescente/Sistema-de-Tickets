import { CheckCircle } from 'lucide-react'
import './SuccessPage.css'

function SuccessPage({ ticketNumber, onBack }) {
  return (
    <div className="success-page">

      <div className="success-card">

        <div className="success-icon">
          <CheckCircle size={56} color="#16a34a" strokeWidth={1.5} />
        </div>

        <h1>Pedido Enviado!</h1>
        <p className="success-sub">O seu ticket foi registado com sucesso.</p>

        <div className="ticket-number-box">
          <span className="ticket-label">Número do seu ticket</span>
          <span className="ticket-number">{ticketNumber || 'TKT-20250527-0001'}</span>
        </div>

        <p className="success-info">
          Irá receber um email de confirmação com os detalhes do seu pedido.
          Será notificado assim que o estado for atualizado.
        </p>

        <button className="back-btn" onClick={onBack}>
          Submeter novo pedido
        </button>

      </div>

    </div>
  )
}

export default SuccessPage
