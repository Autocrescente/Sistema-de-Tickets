const request = require('supertest');
const jwt     = require('jsonwebtoken');
const app     = require('../app');
const db      = require('./helpers/db');

// Impede envio de emails reais durante os testes
jest.mock('../src/services/emailService', () => ({
  sendTicketCreatedToRequester: jest.fn().mockResolvedValue(undefined),
  sendTicketCreatedToRecipient: jest.fn().mockResolvedValue(undefined),
  sendStatusUpdate:             jest.fn().mockResolvedValue(undefined),
}));

const emailService = require('../src/services/emailService');

const makeToken = () =>
  jwt.sign({ id: 'user-test', name: 'Técnico Teste' }, process.env.JWT_SECRET);

const BASE_TICKET = {
  firstName:   'João',
  lastName:    'Silva',
  email:       'joao@empresa.com',
  subject:     'Problema com impressora',
  description: 'A impressora do 2º andar não funciona.',
  priority:    'normal',
};

const auth = () => ({ Authorization: `Bearer ${makeToken()}` });

beforeAll(() => db.connect());
afterAll(() => db.disconnect());
afterEach(async () => { await db.clearAll(); jest.clearAllMocks(); });

// ─── POST /api/tickets ────────────────────────────────────────────────────────

describe('POST /api/tickets', () => {
  it('cria ticket com dados válidos e devolve 201', async () => {
    const res = await request(app).post('/api/tickets').field(BASE_TICKET);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      firstName:   'João',
      lastName:    'Silva',
      email:       'joao@empresa.com',
      status:      'aberto',
      priority:    'normal',
    });
    expect(res.body.ticketNumber).toMatch(/^TKT-\d{8}-\d{4}$/);
    expect(res.body._id).toBeDefined();
  });

  it('gera números de ticket sequenciais no mesmo dia', async () => {
    const r1 = await request(app).post('/api/tickets').field(BASE_TICKET);
    const r2 = await request(app).post('/api/tickets').field(BASE_TICKET);
    const seq1 = parseInt(r1.body.ticketNumber.split('-')[2]);
    const seq2 = parseInt(r2.body.ticketNumber.split('-')[2]);
    expect(seq2).toBe(seq1 + 1);
  });

  it('chama o emailService após criar ticket', async () => {
    await request(app).post('/api/tickets').field(BASE_TICKET);
    expect(emailService.sendTicketCreatedToRequester).toHaveBeenCalledTimes(1);
  });

  it('retorna 400 quando firstName está em falta', async () => {
    const { firstName, ...body } = BASE_TICKET;
    const res = await request(app).post('/api/tickets').field(body);
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('retorna 400 quando email é inválido', async () => {
    const res = await request(app).post('/api/tickets').field({ ...BASE_TICKET, email: 'nao-e-email' });
    expect(res.status).toBe(400);
  });

  it('retorna 400 com prioridade inválida', async () => {
    const res = await request(app).post('/api/tickets').field({ ...BASE_TICKET, priority: 'maxima' });
    expect(res.status).toBe(400);
  });

  it('usa prioridade "normal" por omissão quando não enviada', async () => {
    const { priority, ...body } = BASE_TICKET;
    const res = await request(app).post('/api/tickets').field(body);
    expect(res.status).toBe(201);
    expect(res.body.priority).toBe('normal');
  });
});

// ─── GET /api/tickets ─────────────────────────────────────────────────────────

describe('GET /api/tickets', () => {
  it('retorna 401 sem token', async () => {
    const res = await request(app).get('/api/tickets');
    expect(res.status).toBe(401);
  });

  it('retorna 401 com token inválido', async () => {
    const res = await request(app).get('/api/tickets').set('Authorization', 'Bearer token-falso');
    expect(res.status).toBe(401);
  });

  it('retorna lista paginada com token válido', async () => {
    await request(app).post('/api/tickets').field(BASE_TICKET);
    await request(app).post('/api/tickets').field(BASE_TICKET);

    const res = await request(app).get('/api/tickets').set(auth());
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(2);
    expect(res.body.page).toBe(1);
    expect(res.body.tickets).toHaveLength(2);
  });

  it('respeita paginação (limit e page)', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app).post('/api/tickets').field(BASE_TICKET);
    }
    const res = await request(app).get('/api/tickets?limit=2&page=2').set(auth());
    expect(res.status).toBe(200);
    expect(res.body.tickets).toHaveLength(2);
    expect(res.body.page).toBe(2);
    expect(res.body.pages).toBe(3);
  });

  it('filtra por status', async () => {
    const created = await request(app).post('/api/tickets').field(BASE_TICKET);
    await request(app).patch(`/api/tickets/${created.body._id}`).set(auth()).send({ status: 'resolvido' });
    await request(app).post('/api/tickets').field(BASE_TICKET); // fica 'aberto'

    const res = await request(app).get('/api/tickets?status=resolvido').set(auth());
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.tickets[0].status).toBe('resolvido');
  });

  it('filtra por prioridade', async () => {
    await request(app).post('/api/tickets').field({ ...BASE_TICKET, priority: 'urgente' });
    await request(app).post('/api/tickets').field({ ...BASE_TICKET, priority: 'baixa' });

    const res = await request(app).get('/api/tickets?priority=urgente').set(auth());
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
  });

  it('pesquisa por assunto', async () => {
    await request(app).post('/api/tickets').field(BASE_TICKET);
    await request(app).post('/api/tickets').field({ ...BASE_TICKET, subject: 'Outro problema qualquer' });

    const res = await request(app).get('/api/tickets?search=impressora').set(auth());
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.tickets[0].subject).toContain('impressora');
  });

  it('pesquisa é insensível a maiúsculas', async () => {
    await request(app).post('/api/tickets').field(BASE_TICKET);
    const res = await request(app).get('/api/tickets?search=IMPRESSORA').set(auth());
    expect(res.body.total).toBe(1);
  });
});

// ─── GET /api/tickets/:id ────────────────────────────────────────────────────

describe('GET /api/tickets/:id', () => {
  it('devolve o ticket correto', async () => {
    const created = await request(app).post('/api/tickets').field(BASE_TICKET);
    const res = await request(app).get(`/api/tickets/${created.body._id}`).set(auth());
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(created.body._id);
    expect(res.body.subject).toBe(BASE_TICKET.subject);
  });

  it('retorna 404 para ID inexistente', async () => {
    const res = await request(app).get('/api/tickets/000000000000000000000000').set(auth());
    expect(res.status).toBe(404);
  });

  it('retorna 401 sem token', async () => {
    const res = await request(app).get('/api/tickets/000000000000000000000000');
    expect(res.status).toBe(401);
  });
});

// ─── PATCH /api/tickets/:id ──────────────────────────────────────────────────

describe('PATCH /api/tickets/:id', () => {
  it('atualiza o status', async () => {
    const created = await request(app).post('/api/tickets').field(BASE_TICKET);
    const res = await request(app)
      .patch(`/api/tickets/${created.body._id}`)
      .set(auth())
      .send({ status: 'em_progresso' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('em_progresso');
  });

  it('dispara email ao requerente quando status muda', async () => {
    const created = await request(app).post('/api/tickets').field(BASE_TICKET);
    jest.clearAllMocks();
    await request(app).patch(`/api/tickets/${created.body._id}`).set(auth()).send({ status: 'resolvido' });
    expect(emailService.sendStatusUpdate).toHaveBeenCalledTimes(1);
  });

  it('não dispara email quando status não muda', async () => {
    const created = await request(app).post('/api/tickets').field(BASE_TICKET);
    jest.clearAllMocks();
    await request(app).patch(`/api/tickets/${created.body._id}`).set(auth()).send({ subject: 'Novo assunto' });
    expect(emailService.sendStatusUpdate).not.toHaveBeenCalled();
  });

  it('atualiza múltiplos campos de uma vez', async () => {
    const created = await request(app).post('/api/tickets').field(BASE_TICKET);
    const res = await request(app)
      .patch(`/api/tickets/${created.body._id}`)
      .set(auth())
      .send({ status: 'aguarda', priority: 'alta', subject: 'Assunto atualizado' });
    expect(res.body.status).toBe('aguarda');
    expect(res.body.priority).toBe('alta');
    expect(res.body.subject).toBe('Assunto atualizado');
  });

  it('retorna 400 com status inválido', async () => {
    const created = await request(app).post('/api/tickets').field(BASE_TICKET);
    const res = await request(app)
      .patch(`/api/tickets/${created.body._id}`)
      .set(auth())
      .send({ status: 'invalido' });
    expect(res.status).toBe(400);
  });

  it('retorna 404 para ID inexistente', async () => {
    const res = await request(app)
      .patch('/api/tickets/000000000000000000000000')
      .set(auth())
      .send({ status: 'resolvido' });
    expect(res.status).toBe(404);
  });
});

// ─── DELETE /api/tickets/:id ─────────────────────────────────────────────────

describe('DELETE /api/tickets/:id', () => {
  it('elimina o ticket', async () => {
    const created = await request(app).post('/api/tickets').field(BASE_TICKET);
    const del = await request(app).delete(`/api/tickets/${created.body._id}`).set(auth());
    expect(del.status).toBe(200);

    const get = await request(app).get(`/api/tickets/${created.body._id}`).set(auth());
    expect(get.status).toBe(404);
  });

  it('retorna 404 para ID inexistente', async () => {
    const res = await request(app).delete('/api/tickets/000000000000000000000000').set(auth());
    expect(res.status).toBe(404);
  });
});

// ─── POST /api/tickets/:id/comments ─────────────────────────────────────────

describe('POST /api/tickets/:id/comments', () => {
  it('adiciona comentário ao ticket', async () => {
    const created = await request(app).post('/api/tickets').field(BASE_TICKET);
    const res = await request(app)
      .post(`/api/tickets/${created.body._id}/comments`)
      .set(auth())
      .send({ author: 'Técnico João', text: 'A analisar o problema.' });
    expect(res.status).toBe(201);
    expect(res.body.text).toBe('A analisar o problema.');
    expect(res.body.author).toBe('Técnico João');
    expect(res.body._id).toBeDefined();
  });

  it('retorna 400 sem texto', async () => {
    const created = await request(app).post('/api/tickets').field(BASE_TICKET);
    const res = await request(app)
      .post(`/api/tickets/${created.body._id}/comments`)
      .set(auth())
      .send({ author: 'Técnico João' });
    expect(res.status).toBe(400);
  });

  it('retorna 400 sem autor', async () => {
    const created = await request(app).post('/api/tickets').field(BASE_TICKET);
    const res = await request(app)
      .post(`/api/tickets/${created.body._id}/comments`)
      .set(auth())
      .send({ text: 'Sem autor' });
    expect(res.status).toBe(400);
  });

  it('retorna 404 para ticket inexistente', async () => {
    const res = await request(app)
      .post('/api/tickets/000000000000000000000000/comments')
      .set(auth())
      .send({ author: 'Técnico', text: 'Texto' });
    expect(res.status).toBe(404);
  });

  it('acumula múltiplos comentários no mesmo ticket', async () => {
    const created = await request(app).post('/api/tickets').field(BASE_TICKET);
    const id = created.body._id;
    await request(app).post(`/api/tickets/${id}/comments`).set(auth()).send({ author: 'A', text: '1º comentário' });
    await request(app).post(`/api/tickets/${id}/comments`).set(auth()).send({ author: 'B', text: '2º comentário' });

    const ticket = await request(app).get(`/api/tickets/${id}`).set(auth());
    expect(ticket.body.comments).toHaveLength(2);
  });
});
