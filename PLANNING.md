# Sistema de Tickets — Plano de Backend

## Contexto
Substituição do sistema atual (chamadas + mensagens) por uma plataforma centralizada de gestão de pedidos de suporte interno. Este ficheiro serve de referência para o desenvolvimento do backend.

---

## Stack Tecnológica

| Camada        | Tecnologia              |
|---------------|-------------------------|
| Runtime       | Node.js                 |
| Framework     | Express.js              |
| Base de Dados | MongoDB (Mongoose)      |
| Autenticação  | JWT (jsonwebtoken)      |
| E-mail        | Nodemailer / SendGrid   |
| Variáveis Env | dotenv                  |

> **Frontend:** À escolha do programador (React, Vue, Angular, etc.). Consome a API REST deste backend.

---

## Estrutura de Pastas Recomendada

```
ticket-system/
├── src/
│   ├── config/
│   │   ├── db.js              # Ligação MongoDB
│   │   └── email.js           # Configuração Nodemailer
│   ├── models/
│   │   ├── Ticket.js
│   │   └── User.js
│   ├── controllers/
│   │   ├── ticketController.js
│   │   ├── authController.js
│   │   └── statsController.js
│   ├── routes/
│   │   ├── tickets.js
│   │   ├── auth.js
│   │   └── stats.js
│   ├── middleware/
│   │   ├── authMiddleware.js  # Verificação JWT
│   │   ├── rateLimiter.js
│   │   └── errorHandler.js
│   ├── services/
│   │   └── emailService.js    # Lógica de envio de emails
│   └── utils/
│       └── ticketNumber.js    # Gerador de número de ticket
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

---

## Modelo de Dados

### Coleção: `tickets`

```js
{
  ticketNumber: String,       // "TKT-20250526-0001" — único, gerado automaticamente
  firstName:    String,       // obrigatório
  lastName:     String,       // obrigatório
  email:        String,       // obrigatório — para notificações
  recipient:    String,       // departamento ou nome da pessoa de suporte
  subject:      String,       // obrigatório
  description:  String,       // obrigatório
  priority:     String,       // enum: "urgente" | "alta" | "normal" | "baixa"
  status:       String,       // enum: "aberto" | "em_progresso" | "aguarda" | "resolvido" | "fechado"
  comments: [{
    author:    String,
    text:      String,
    createdAt: Date
  }],
  createdAt: Date,            // automático
  updatedAt: Date             // automático
}
```

### Coleção: `users` (backoffice)

```js
{
  name:      String,
  email:     String,          // único
  password:  String,          // hash bcrypt
  role:      String,          // enum: "admin" | "tecnico" | "visualizador"
  createdAt: Date
}
```

---

## Numeração de Tickets

Formato: `TKT-YYYYMMDD-XXXX`
Exemplo: `TKT-20250526-0001`

Lógica:
1. Obter a data atual no formato `YYYYMMDD`
2. Contar tickets criados nesse dia e incrementar
3. Formatar com zero-padding de 4 dígitos (`0001`, `0042`, etc.)

---

## Endpoints da API

### Tickets (público + admin)

| Método | Endpoint                    | Auth? | Descrição                              |
|--------|-----------------------------|-------|----------------------------------------|
| POST   | /api/tickets                | Não   | Criar novo ticket                      |
| GET    | /api/tickets                | Sim   | Listar todos os tickets (com filtros)  |
| GET    | /api/tickets/:id            | Sim   | Obter detalhes de um ticket            |
| PATCH  | /api/tickets/:id            | Sim   | Atualizar estado / dados               |
| DELETE | /api/tickets/:id            | Sim   | Arquivar ticket                        |
| POST   | /api/tickets/:id/comments   | Sim   | Adicionar comentário interno           |

### Autenticação (backoffice)

| Método | Endpoint          | Auth? | Descrição              |
|--------|-------------------|-------|------------------------|
| POST   | /api/auth/login   | Não   | Login — devolve JWT    |
| POST   | /api/auth/logout  | Sim   | Terminar sessão        |

### Estatísticas

| Método | Endpoint    | Auth? | Descrição                          |
|--------|-------------|-------|------------------------------------|
| GET    | /api/stats  | Sim   | Métricas: totais, tempos, gráficos |

---

## Lógica de Emails

Disparar email automático em dois momentos:

**1. Criação de ticket:**
- Para o **requerente** (`ticket.email`): confirmação com número do ticket, assunto e prioridade
- Para o **destinatário** (`ticket.recipient`): notificação com dados completos e prioridade

**2. Atualização de estado:**
- Para o **requerente**: notificação com novo estado do ticket

---

## Níveis de Prioridade

| Valor    | Tempo de Resposta | Cor sugerida |
|----------|-------------------|--------------|
| urgente  | ~1 hora           | Vermelho     |
| alta     | ~4 horas          | Laranja      |
| normal   | ~24 horas         | Azul         |
| baixa    | ~72 horas         | Verde        |

---

## Estados do Ticket

```
aberto → em_progresso → aguarda → resolvido → fechado
```

---

## Segurança

- Autenticação com **JWT** (expiração: 8h recomendado)
- Passwords com **bcrypt** (salt rounds: 12)
- **Rate limiting** nas rotas públicas (ex.: 10 req/15min por IP)
- Validação de inputs com **express-validator** ou **Zod**
- Variáveis sensíveis **sempre em `.env`**, nunca no código
- HTTPS obrigatório em produção

---

## Variáveis de Ambiente (`.env.example`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ticket-system
JWT_SECRET=
JWT_EXPIRES_IN=8h

EMAIL_HOST=
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM=noreply@empresa.com

# Ou SendGrid:
SENDGRID_API_KEY=
```

> Os valores reais serão fornecidos assim que possível.

---

## Dependências Sugeridas

```json
{
  "dependencies": {
    "express": "^4.x",
    "mongoose": "^8.x",
    "jsonwebtoken": "^9.x",
    "bcryptjs": "^2.x",
    "nodemailer": "^6.x",
    "dotenv": "^16.x",
    "express-rate-limit": "^7.x",
    "express-validator": "^7.x",
    "cors": "^2.x",
    "helmet": "^7.x"
  },
  "devDependencies": {
    "nodemon": "^3.x"
  }
}
```

---

## Plano de Fases

| Fase   | Descrição                      | Duração     |
|--------|--------------------------------|-------------|
| Fase 1 | Setup, DB, estrutura base      | 1 semana    |
| Fase 2 | API REST + emails + auth JWT   | 2 semanas   |
| Fase 3 | Frontend — formulário público  | 1–2 semanas |
| Fase 4 | Frontend — backoffice          | 2 semanas   |
| Fase 5 | Testes e QA                    | 1 semana    |
| Fase 6 | Deploy e Go-Live               | 1 semana    |

---

## Como Começar

```bash
# 1. Instalar dependências
npm install

# 2. Copiar e preencher variáveis de ambiente
cp .env.example .env

# 3. Iniciar em desenvolvimento
npm run dev
```
