const express = require('express');
const {
  criarLaboratorio,
  listarLaboratorios,
  atualizarLaboratorio,
  removerLaboratorio
} = require('../controllers/laboratorioController');

/**
 * @fileoverview Rotas para operações de Laboratórios
 * @description Define todas as rotas relacionadas aos laboratórios
 */

const router = express.Router();

// Rota de teste
router.get('/test', (req, res) => {
  res.json({ message: 'Rota de laboratórios funcionando!' });
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Laboratorio:
 *       type: object
 *       required:
 *         - nome
 *         - capacidade
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único do laboratório
 *         nome:
 *           type: string
 *           description: Nome do laboratório
 *           maxLength: 100
 *         capacidade:
 *           type: integer
 *           minimum: 1
 *           description: Capacidade máxima do laboratório
 *         local:
 *           type: string
 *           description: Localização do laboratório
 *           maxLength: 200
 *         status:
 *           type: string
 *           enum: [Ativo, Inativo]
 *           default: Ativo
 *           description: Status do laboratório
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 *       example:
 *         _id: "507f1f77bcf86cd799439011"
 *         nome: "Lab Informática 1"
 *         capacidade: 30
 *         local: "Bloco A - Sala 101"
 *         status: "Ativo"
 *         createdAt: "2024-01-15T10:30:00.000Z"
 *         updatedAt: "2024-01-15T10:30:00.000Z"
 */

/**
 * @swagger
 * /api/v1/laboratorios:
 *   post:
 *     summary: Criar um novo laboratório
 *     tags: [Laboratórios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - capacidade
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do laboratório
 *               capacidade:
 *                 type: integer
 *                 minimum: 1
 *                 description: Capacidade máxima
 *               local:
 *                 type: string
 *                 description: Localização do laboratório
 *               status:
 *                 type: string
 *                 enum: [Ativo, Inativo]
 *                 description: Status do laboratório
 *     responses:
 *       201:
 *         description: Laboratório criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Laboratorio'
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Laboratório já existe no local especificado
 */
router.post('/', criarLaboratorio);

/**
 * @swagger
 * /api/v1/laboratorios:
 *   get:
 *     summary: Listar laboratórios com filtros e paginação
 *     tags: [Laboratórios]
 *     parameters:
 *       - in: query
 *         name: local
 *         schema:
 *           type: string
 *         description: Filtro por local (parcial, case-insensitive)
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtro por nome (parcial, case-insensitive)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Ativo, Inativo]
 *         description: Filtro por status
 *       - in: query
 *         name: minCapacidade
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Capacidade mínima do laboratório
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Itens por página
 *     responses:
 *       200:
 *         description: Lista de laboratórios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 laboratorios:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Laboratorio'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 */
router.get('/', listarLaboratorios);

/**
 * @swagger
 * /api/v1/laboratorios/{id}:
 *   put:
 *     summary: Atualizar um laboratório
 *     tags: [Laboratórios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do laboratório
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               capacidade:
 *                 type: integer
 *                 minimum: 1
 *               local:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Ativo, Inativo]
 *     responses:
 *       200:
 *         description: Laboratório atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Laboratorio'
 *       400:
 *         description: Dados inválidos ou ID inválido
 *       404:
 *         description: Laboratório não encontrado
 */
router.put('/:id', atualizarLaboratorio);

/**
 * @swagger
 * /api/v1/laboratorios/{id}:
 *   delete:
 *     summary: Remover um laboratório
 *     tags: [Laboratórios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do laboratório
 *     responses:
 *       204:
 *         description: Laboratório removido com sucesso
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Laboratório não encontrado
 */
router.delete('/:id', removerLaboratorio);

module.exports = router;