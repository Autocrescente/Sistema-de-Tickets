import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import TicketForm from './pages/TicketForm'
import SuccessPage from './pages/SuccessPage'
import Backoffice from './pages/Backoffice'

function App() {
  const [page, setPage] = useState('home')
  const [ticketNumber, setTicketNumber] = useState('')

  const handleSuccess = (number) => {
    setTicketNumber(number)
    setPage('success')
  }

  const handleBack = () => {
    setPage('home')
    setTicketNumber('')
  }

  return (
    <div className="app">
      {page === 'home'       && <Home onNavigate={setPage} />}
      {page === 'form'       && <TicketForm onSuccess={handleSuccess} />}
      {page === 'success'    && <SuccessPage ticketNumber={ticketNumber} onBack={handleBack} />}
      {page === 'backoffice' && <Backoffice />}
    </div>
  )
}

export default App
