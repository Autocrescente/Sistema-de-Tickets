const request = require('supertest');
const jwt     = require('jsonwebtoken');
const app     = require('../app');
const db      = require('./helpers/db');

jest.mock('../src/services/emailService', () => ({
  sendTicketCreatedToRequester: jest.fn().mockResolvedValue(undefined),
  sendTicketCreatedToRecipient: jest.fn().mockResolvedValue(undefined),
  sendStatusUpdate:             jest.fn().mockResolvedValue(undefined),
}));

const makeToken = () => jwt.sign({ id: 'user-test' }, process.env.JWT_SECRET);
const auth = () => ({ Authorization: `Bearer ${makeToken()}` });

const BASE_TICKET = {
  firstName: 'Ana', lastName: 'Costa', email: 'ana@empresa.com',
  subject: 'Teste stats', description: 'Descrição de teste.',
};

beforeAll(() => db.connect());
afterAll(() => db.disconnect());
afterEach(async () => { await db.clearAll(); jest.clearAllMocks(); });

describe('GET /api/stats', () => {
  it('retorna 401 sem token', async () => {
    const res = await request(app).get('/api/stats');
    expect(res.status).toBe(401);
  });

  it('devolve estrutura correta com base de dados vazia', async () => {
    const res = await request(app).get('/api/stats').set(auth());
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      total:      0,
      today:      0,
      thisWeek:   0,
      thisMonth:  0,
      byStatus:   {},
      byPriority: {},
    });
  });

  it('contabiliza o total de tickets', async () => {
    await request(app).post('/api/tickets').field(BASE_TICKET);
    await request(app).post('/api/tickets').field(BASE_TICKET);

    const res = await request(app).get('/api/stats').set(auth());
    expect(res.body.total).toBe(2);
    expect(res.body.today).toBe(2);
    expect(res.body.thisWeek).toBe(2);
    expect(res.body.thisMonth).toBe(2);
  });

  it('agrupa corretamente por status', async () => {
    const t1 = await request(app).post('/api/tickets').field(BASE_TICKET);
    const t2 = await request(app).post('/api/tickets').field(BASE_TICKET);
    await request(app).patch(`/api/tickets/${t1.body._id}`).set(auth()).send({ status: 'resolvido' });

    const res = await request(app).get('/api/stats').set(auth());
    expect(res.body.byStatus.aberto).toBe(1);
    expect(res.body.byStatus.resolvido).toBe(1);
  });

  it('agrupa corretamente por prioridade', async () => {
    await request(app).post('/api/tickets').field({ ...BASE_TICKET, priority: 'urgente' });
    await request(app).post('/api/tickets').field({ ...BASE_TICKET, priority: 'urgente' });
    await request(app).post('/api/tickets').field({ ...BASE_TICKET, priority: 'baixa' });

    const res = await request(app).get('/api/stats').set(auth());
    expect(res.body.byPriority.urgente).toBe(2);
    expect(res.body.byPriority.baixa).toBe(1);
  });
});
