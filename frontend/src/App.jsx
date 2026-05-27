import { useState } from 'react'
import './App.css'
import TicketForm from './pages/TicketForm'
import SuccessPage from './pages/SuccessPage'
import Dashboard from './pages/Dashboard'

function App() {
  const [page, setPage] = useState('form')
  const [ticketNumber, setTicketNumber] = useState('')

  const handleSuccess = (number) => {
    setTicketNumber(number)
    setPage('success')
  }

  const handleBack = () => {
    setPage('form')
    setTicketNumber('')
  }

  return (
    <div className="app">
      <nav className="dev-nav">
        <button onClick={() => setPage('form')}>Formulário</button>
        <button onClick={() => setPage('success')}>Confirmação</button>
        <button onClick={() => setPage('dashboard')}>Dashboard</button>
      </nav>
      {page === 'form'      && <TicketForm onSuccess={handleSuccess} />}
      {page === 'success'   && <SuccessPage ticketNumber={ticketNumber} onBack={handleBack} />}
      {page === 'dashboard' && <Dashboard />}
    </div>
  )
}

export default App
