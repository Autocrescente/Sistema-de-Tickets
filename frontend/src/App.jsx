import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import TicketForm from './pages/TicketForm'
import SuccessPage from './pages/SuccessPage'
import Backoffice from './pages/Backoffice'
import Portal from './pages/Portal'

function App() {
  const [page, setPage] = useState('home')
  const [portalSection, setPortalSection] = useState(null)
  const [ticketNumber, setTicketNumber] = useState('')

  const handleNavigate = (destPage, section = null) => {
    setPortalSection(section)
    setPage(destPage)
  }

  const handleSuccess = (number) => {
    setTicketNumber(number)
    setPage('success')
  }

  const handleBack = () => {
    setPage('home')
    setTicketNumber('')
    setPortalSection(null)
  }

  return (
    <div className="app">
      {page === 'home'       && <Home onNavigate={handleNavigate} />}
      {page === 'form'       && <TicketForm onSuccess={handleSuccess} />}
      {page === 'success'    && <SuccessPage ticketNumber={ticketNumber} onBack={handleBack} />}
      {page === 'backoffice' && <Backoffice />}
      {page === 'portal'     && <Portal onBack={() => setPage('home')} initialSection={portalSection} />}
    </div>
  )
}

export default App
