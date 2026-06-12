const express = require('express');
const { body } = require('express-validator');
const router  = express.Router();
const { protect } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/recipientController');

/**
 * @openapi
 * tags:
 *   name: Destinatários
 *   description: Lista de destinatários para autocomplete
 */

/**
 * @openapi
 * /recipients:
 *   get:
 *     summary: Listar destinatários (autocomplete)
 *     tags: [Destinatários]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Filtrar por nome, email ou departamento
 *     responses:
 *       200:
 *         description: Lista de destinatários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Recipient' }
 */
router.get('/', ctrl.getRecipients);

/**
 * @openapi
 * /recipients:
 *   post:
 *     summary: Criar destinatário
 *     tags: [Destinatários]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name:       { type: string, example: João Silva }
 *               email:      { type: string, format: email, example: joao@empresa.com }
 *               department: { type: string, example: Informática }
 *     responses:
 *       201:
 *         description: Destinatário criado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Recipient' }
 *       409:
 *         description: Email já existe
 */
router.post(
  '/',
  protect,
  [
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
  ],
  ctrl.createRecipient
);

/**
 * @openapi
 * /recipients/{id}:
 *   patch:
 *     summary: Atualizar destinatário
 *     tags: [Destinatários]
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
 *               name:       { type: string }
 *               email:      { type: string, format: email }
 *               department: { type: string }
 *     responses:
 *       200:
 *         description: Destinatário atualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Recipient' }
 *       404:
 *         description: Não encontrado
 */
router.patch(
  '/:id',
  protect,
  [body('email').optional().isEmail().withMessage('Email inválido')],
  ctrl.updateRecipient
);

/**
 * @openapi
 * /recipients/{id}:
 *   delete:
 *     summary: Eliminar destinatário
 *     tags: [Destinatários]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Eliminado com sucesso
 *       404:
 *         description: Não encontrado
 */
router.delete('/:id', protect, ctrl.deleteRecipient);

module.exports = router;
