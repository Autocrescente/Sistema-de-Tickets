import { useState } from 'react'
import './App.css'
import TicketForm from './pages/TicketForm'
import SuccessPage from './pages/SuccessPage'

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
      </nav>
      {page === 'form'    && <TicketForm onSuccess={handleSuccess} />}
      {page === 'success' && <SuccessPage ticketNumber={ticketNumber} onBack={handleBack} />}
    </div>
  )
}

export default App
