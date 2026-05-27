const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title:       'Sistema de Tickets — API',
      version:     '1.0.0',
      description: 'API REST para gestão de tickets de suporte interno.\n\nRotas protegidas requerem um JWT no header `Authorization: Bearer <token>`, emitido pelo serviço de autenticação externo.',
    },
    servers: [
      { url: `http://localhost:${process.env.PORT || 5000}`, description: 'Desenvolvimento' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type:         'http',
          scheme:       'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Attachment: {
          type: 'object',
          properties: {
            _id:          { type: 'string' },
            originalName: { type: 'string', example: 'fatura.pdf' },
            filename:     { type: 'string', example: 'a1b2c3d4.pdf' },
            mimetype:     { type: 'string', example: 'application/pdf' },
            size:         { type: 'integer', example: 204800, description: 'Tamanho em bytes' },
            createdAt:    { type: 'string', format: 'date-time' },
          },
        },
        Comment: {
          type: 'object',
          properties: {
            _id:       { type: 'string' },
            author:    { type: 'string', example: 'Técnico João' },
            text:      { type: 'string', example: 'Problema identificado e resolvido.' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Ticket: {
          type: 'object',
          properties: {
            _id:          { type: 'string' },
            ticketNumber: { type: 'string', example: 'TKT-20250526-0001' },
            firstName:    { type: 'string', example: 'João' },
            lastName:     { type: 'string', example: 'Silva' },
            email:        { type: 'string', example: 'joao@empresa.com' },
            recipient:    { type: 'string', example: 'suporte@empresa.com' },
            subject:      { type: 'string', example: 'Problema com impressora' },
            description:  { type: 'string', example: 'A impressora do 2º andar não imprime.' },
            priority: {
              type: 'string',
              enum: ['urgente', 'alta', 'normal', 'baixa'],
              example: 'normal',
            },
            status: {
              type: 'string',
              enum: ['aberto', 'em_progresso', 'aguarda', 'resolvido', 'fechado'],
              example: 'aberto',
            },
            attachments: { type: 'array', items: { $ref: '#/components/schemas/Attachment' } },
            comments:    { type: 'array', items: { $ref: '#/components/schemas/Comment' } },
            createdAt:   { type: 'string', format: 'date-time' },
            updatedAt:   { type: 'string', format: 'date-time' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Dados inválidos.' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field:   { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
