const BASE_URL = 'https://app.autocrescente.com/sistemaTickets/Api'

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTE4MGJlMTM5ZWEwMzViNjJmZTEwNGEiLCJpYXQiOjE3Nzk5NzY5OTAsImV4cCI6MTc4MDAxMjk5MH0.czTcu3htmUpbnNFXiEjra2uRcTJKqL-S-1qjWJ7Ytc0'

function getToken() {
  return TOKEN
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

export async function getTickets(params = {}) {
  const query = new URLSearchParams(params).toString()
  const response = await fetch(`${BASE_URL}/tickets${query ? '?' + query : ''}`, {
    headers: { 'Authorization': `Bearer ${getToken()}` },
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || 'Erro ao carregar tickets')
  }
  return response.json()
}

export async function getTicket(id) {
  const response = await fetch(`${BASE_URL}/tickets/${id}`, {
    headers: { 'Authorization': `Bearer ${getToken()}` },
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || 'Erro ao carregar ticket')
  }
  return response.json()
}

export async function addComment(id, data) {
  const response = await fetch(`${BASE_URL}/tickets/${id}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || 'Erro ao adicionar comentário')
  }
  return response.json()
}

export async function deleteTicket(id) {
  const response = await fetch(`${BASE_URL}/tickets/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` },
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || 'Erro ao apagar ticket')
  }
  return response.json()
}

export async function updateTicket(id, data) {
  const response = await fetch(`${BASE_URL}/tickets/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || 'Erro ao atualizar ticket')
  }
  return response.json()
}
