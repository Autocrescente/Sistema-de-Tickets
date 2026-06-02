import { Ticket, Settings } from 'lucide-react'
import './Home.css'

function Home({ onNavigate }) {
  return (
    <div className="home-page">
      <div className="home-content">

        <div className="home-header">
          <img src="/logo.png" alt="Autocrescente" className="home-logo" />
          <p className="home-sub"></p>
        </div>

        <div className="home-cards">
          <button className="home-card home-card-ticket" onClick={() => onNavigate('form')}>
            <div className="home-card-icon">
              <Ticket size={32} strokeWidth={1.5} />
            </div>
            <div className="home-card-text">
              <span className="home-card-title">Abrir Ticket</span>
              <span className="home-card-desc">Submete um pedido de suporte</span>
            </div>
          </button>

          <button className="home-card home-card-backoffice" onClick={() => onNavigate('backoffice')}>
            <div className="home-card-icon">
              <Settings size={32} strokeWidth={1.5} />
            </div>
            <div className="home-card-text">
              <span className="home-card-title">Backoffice</span>
              <span className="home-card-desc">Gestão de tickets de suporte</span>
            </div>
          </button>
        </div>

      </div>
    </div>
  )
}

export default Home
