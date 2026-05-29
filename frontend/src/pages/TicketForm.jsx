import { useState, useEffect } from 'react'
import { User, Mail, Send, FileText, PenLine, Paperclip, UploadCloud, X, Loader } from 'lucide-react'
import { createTicket, getRecipients } from '../services/api'
import './TicketForm.css'

function TicketForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    cc: '',
    recipient: '',
    subject: '',
    description: '',
    priority: 'normal',
  })
  const [attachment, setAttachment] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [destinatarios, setDestinatarios] = useState([])
  const [recipientDisplay, setRecipientDisplay] = useState('')

  useEffect(() => {
    getRecipients()
      .then(data => setDestinatarios(data.map(d => ({ nome: d.name, departamento: d.department, email: d.email }))))
      .catch(() => {})
  }, [])

  const suggestions = destinatarios.filter(d =>
    recipientDisplay.length > 0 &&
    (d.nome.toLowerCase().includes(recipientDisplay.toLowerCase()) ||
     d.departamento.toLowerCase().includes(recipientDisplay.toLowerCase()))
  )

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFile = (e) => {
    setAttachment(e.target.files[0] || null)
  }

  const removeFile = () => {
    setAttachment(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const ticket = await createTicket(formData, attachment)
      onSuccess(ticket.ticketNumber)
    } catch (err) {
      setError(err.message || 'Erro ao enviar. Tenta novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-page">

      <div className="form-content">
      <div className="company-header">
        <img src="/logo.png" alt="Autocrescente" className="company-logo" />
      </div>

      <div className="form-header">
        <h1>Abrir Ticket de Suporte</h1>
        <p>Preencha o formulário abaixo para submeter o seu pedido</p>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>

          <div className="form-row">
            <div className="form-group">
              <label>Primeiro Nome *</label>
              <div className="input-icon">
                <span><User size={17} /></span>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="João"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Apelido *</label>
              <div className="input-icon">
                <span><User size={17} /></span>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Silva"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Email *</label>
            <div className="input-icon">
              <span><Mail size={17} /></span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="joao@empresa.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Destinatário</label>
            <div className="recipient-wrapper">
              <div className="input-icon">
                <span><Send size={17} /></span>
                <input
                  type="text"
                  value={recipientDisplay}
                  onChange={e => { setRecipientDisplay(e.target.value); setFormData({ ...formData, recipient: '' }) }}
                  placeholder="Departamento ou nome da pessoa"
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  autoComplete="off"
                />
              </div>
              {showSuggestions && suggestions.length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map((d, i) => (
                    <li key={i} onMouseDown={() => {
                      setRecipientDisplay(`${d.nome} — ${d.departamento}`)
                      setFormData(prev => ({ ...prev, recipient: d.email }))
                    }}>
                      <span className="sug-nome">{d.nome}</span>
                      <span className="sug-dept">{d.departamento}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>CC </label>
            <div className="input-icon">
              <span><Mail size={17} /></span>
              <input
                type="email"
                name="cc"
                value={formData.cc}
                onChange={handleChange}
                placeholder="Com conhecimento "
              />
            </div>
          </div>

          <div className="form-group">
            <label>Assunto *</label>
            <div className="input-icon">
              <span><FileText size={17} /></span>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Título resumido do pedido"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Descrição *</label>
            <div className="input-icon textarea-icon">
              <span><PenLine size={17} /></span>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descreva o seu pedido em detalhe..."
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Prioridade</label>
            <div className="priority-options">
              <div className="priority-option priority-urgente">
                <input type="radio" id="urgente" name="priority" value="urgente" onChange={handleChange} checked={formData.priority === 'urgente'} />
                <label htmlFor="urgente">Urgente</label>
              </div>
              <div className="priority-option priority-alta">
                <input type="radio" id="alta" name="priority" value="alta" onChange={handleChange} checked={formData.priority === 'alta'} />
                <label htmlFor="alta">Alta</label>
              </div>
              <div className="priority-option priority-normal">
                <input type="radio" id="normal" name="priority" value="normal" onChange={handleChange} checked={formData.priority === 'normal'} />
                <label htmlFor="normal">Normal</label>
              </div>
              <div className="priority-option priority-baixa">
                <input type="radio" id="baixa" name="priority" value="baixa" onChange={handleChange} checked={formData.priority === 'baixa'} />
                <label htmlFor="baixa">Baixa</label>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Anexo (opcional)</label>
            <label className="upload-area" htmlFor="file-upload">
              {attachment ? (
                <div className="upload-file-selected">
                  <Paperclip size={16} />
                  <span>{attachment.name}</span>
                  <button type="button" className="remove-file" onClick={(e) => { e.preventDefault(); removeFile(); }}>
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <UploadCloud size={28} strokeWidth={1.5} />
                  <span>Clica para escolher um ficheiro</span>
                  <small>PNG, JPG, JPEG ou PDF</small>
                </div>
              )}
              <input
                id="file-upload"
                type="file"
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={handleFile}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading
              ? <><Loader size={17} className="spin" /> A enviar...</>
              : <><Send size={17} color="#fff" strokeWidth={2.5} /> Enviar Pedido</>
            }
          </button>

        </form>
      </div>

      </div>
    </div>
  )
}

export default TicketForm
