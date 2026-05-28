const BASE_URL = 'https://app.autocrescente.com/sistemaTickets/Api'

function getToken() {
  return localStorage.getItem('token') || ''
}

export async function createTicket(formData, attachment) {
  const body = new FormData()

  body.append('firstName',   formData.firstName)
  body.append('lastName',    formData.lastName)
  body.append('email',       formData.email)
  body.append('subject',     formData.subject)
  body.append('description', formData.description)
  body.append('priority',    formData.priority || 'normal')

  if (formData.recipient) {
    body.append('recipient', formData.recipient)
  }

  if (attachment) {
    body.append('attachments', attachment)
  }

  const response = await fetch(`${BASE_URL}/tickets`, {
    method: 'POST',
    body,
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || 'Erro ao enviar ticket')
  }

  return response.json()
}
