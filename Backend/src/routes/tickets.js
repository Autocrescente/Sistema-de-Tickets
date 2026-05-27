const express = require('express');
const { body } = require('express-validator');
const router  = express.Router();
const upload  = require('../config/upload');
const { protect }       = require('../middleware/authMiddleware');
const { publicLimiter } = require('../middleware/rateLimiter');
const ctrl = require('../controllers/ticketController');

/**
 * @openapi
 * tags:
 *   name: Tickets
 *   description: Gestão de tickets de suporte
 */

/**
 * @openapi
 * /api/tickets:
 *   post:
 *     summary: Criar novo ticket (público)
 *     tags: [Tickets]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, subject, description]
 *             properties:
 *               firstName:   { type: string, example: João }
 *               lastName:    { type: string, example: Silva }
 *               email:       { type: string, format: email, example: joao@empresa.com }
 *               recipient:   { type: string, example: suporte@empresa.com }
 *               subject:     { type: string, example: Problema com impressora }
 *               description: { type: string, example: A impressora do 2º andar não funciona. }
 *               priority:
 *                 type: string
 *                 enum: [urgente, alta, normal, baixa]
 *                 default: normal
 *               attachments:
 *                 type: array
 *                 items: { type: string, format: binary }
 *                 description: PDFs ou imagens (máx. 5 ficheiros, 10 MB cada)
 *     responses:
 *       201:
 *         description: Ticket criado com sucesso
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Ticket' }
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       429:
 *         description: Rate limit excedido
 */
router.post(
  '/',
  publicLimiter,
  upload.array('attachments', 5),
  [
    body('firstName').notEmpty().withMessage('Nome é obrigatório'),
    body('lastName').notEmpty().withMessage('Apelido é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('subject').notEmpty().withMessage('Assunto é obrigatório'),
    body('description').notEmpty().withMessage('Descrição é obrigatória'),
    body('priority').optional().isIn(['urgente', 'alta', 'normal', 'baixa']).withMessage('Prioridade inválida'),
  ],
  ctrl.createTicket
);

/**
 * @openapi
 * /api/tickets:
 *   get:
 *     summary: Listar tickets com filtros e paginação
 *     tags: [Tickets]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [aberto, em_progresso, aguarda, resolvido, fechado]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [urgente, alta, normal, baixa]
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Pesquisa por número, assunto, nome ou email
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Lista paginada de tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:   { type: integer }
 *                 page:    { type: integer }
 *                 pages:   { type: integer }
 *                 tickets:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Ticket' }
 *       401:
 *         description: Não autorizado
 */
router.get('/', protect, ctrl.getTickets);

/**
 * @openapi
 * /api/tickets/{id}:
 *   get:
 *     summary: Obter detalhes de um ticket
 *     tags: [Tickets]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Ticket encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Ticket' }
 *       404:
 *         description: Ticket não encontrado
 */
router.get('/:id', protect, ctrl.getTicket);

/**
 * @openapi
 * /api/tickets/{id}:
 *   patch:
 *     summary: Atualizar estado ou dados de um ticket
 *     tags: [Tickets]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [aberto, em_progresso, aguarda, resolvido, fechado]
 *               priority:
 *                 type: string
 *                 enum: [urgente, alta, normal, baixa]
 *               recipient:   { type: string }
 *               subject:     { type: string }
 *               description: { type: string }
 *     responses:
 *       200:
 *         description: Ticket atualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Ticket' }
 *       404:
 *         description: Ticket não encontrado
 */
router.patch(
  '/:id',
  protect,
  [
    body('status').optional().isIn(['aberto', 'em_progresso', 'aguarda', 'resolvido', 'fechado']),
    body('priority').optional().isIn(['urgente', 'alta', 'normal', 'baixa']),
  ],
  ctrl.updateTicket
);

/**
 * @openapi
 * /api/tickets/{id}:
 *   delete:
 *     summary: Eliminar ticket e os seus anexos
 *     tags: [Tickets]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Ticket eliminado
 *       404:
 *         description: Ticket não encontrado
 */
router.delete('/:id', protect, ctrl.deleteTicket);

/**
 * @openapi
 * /api/tickets/{id}/comments:
 *   post:
 *     summary: Adicionar comentário interno a um ticket
 *     tags: [Tickets]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [author, text]
 *             properties:
 *               author: { type: string, example: Técnico João }
 *               text:   { type: string, example: A impressora foi substituída. }
 *     responses:
 *       201:
 *         description: Comentário adicionado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Comment' }
 *       404:
 *         description: Ticket não encontrado
 */
router.post(
  '/:id/comments',
  protect,
  [
    body('author').notEmpty().withMessage('Autor é obrigatório'),
    body('text').notEmpty().withMessage('Texto é obrigatório'),
  ],
  ctrl.addComment
);

module.exports = router;
