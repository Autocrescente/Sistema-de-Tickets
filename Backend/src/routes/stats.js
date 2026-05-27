const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/statsController');

/**
 * @openapi
 * tags:
 *   name: Estatísticas
 *   description: Métricas e totais do sistema
 */

/**
 * @openapi
 * /api/stats:
 *   get:
 *     summary: Obter estatísticas gerais dos tickets
 *     tags: [Estatísticas]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Estatísticas calculadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:      { type: integer, example: 120 }
 *                 today:      { type: integer, example: 5 }
 *                 thisWeek:   { type: integer, example: 23 }
 *                 thisMonth:  { type: integer, example: 67 }
 *                 byStatus:
 *                   type: object
 *                   example: { aberto: 12, em_progresso: 5, resolvido: 80 }
 *                 byPriority:
 *                   type: object
 *                   example: { urgente: 3, alta: 10, normal: 70, baixa: 37 }
 *       401:
 *         description: Não autorizado
 */
router.get('/', protect, ctrl.getStats);

module.exports = router;
