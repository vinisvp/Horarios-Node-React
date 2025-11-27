const express = require('express');
const {
  criarBloco,
  listarBlocos,
  atualizarBloco,
  removerBloco
} = require('../controllers/blocoController');

/**
 * @fileoverview Rotas para operações de Blocos de Horários
 * @description Define todas as rotas relacionadas aos blocos de horários
 */

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Bloco:
 *       type: object
 *       required:
 *         - turno
 *         - diaSemana
 *         - inicio
 *         - fim
 *         - ordem
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único do bloco
 *         turno:
 *           type: string
 *           enum: [Manhã, Tarde, Noite, Integral]
 *           description: Turno do bloco
 *         diaSemana:
 *           type: string
 *           enum: [Segunda, Terça, Quarta, Quinta, Sexta, Sábado, Domingo]
 *           description: Dia da semana do bloco
 *         inicio:
 *           type: string
 *           pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$'
 *           description: Horário de início (formato HH:mm)
 *         fim:
 *           type: string
 *           pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$'
 *           description: Horário de fim (formato HH:mm)
 *         ordem:
 *           type: integer
 *           minimum: 1
 *           description: Ordem do bloco no turno/dia
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
 *         turno: "Manhã"
 *         diaSemana: "Segunda"
 *         inicio: "07:30"
 *         fim: "08:20"
 *         ordem: 1
 *         createdAt: "2024-01-15T10:30:00.000Z"
 *         updatedAt: "2024-01-15T10:30:00.000Z"
 */

/**
 * @swagger
 * /api/v1/blocos:
 *   post:
 *     summary: Criar um novo bloco de horário
 *     tags: [Blocos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - turno
 *               - diaSemana
 *               - inicio
 *               - fim
 *               - ordem
 *             properties:
 *               turno:
 *                 type: string
 *                 enum: [Manhã, Tarde, Noite, Integral]
 *                 description: Turno do bloco
 *               diaSemana:
 *                 type: string
 *                 enum: [Segunda, Terça, Quarta, Quinta, Sexta, Sábado, Domingo]
 *                 description: Dia da semana
 *               inicio:
 *                 type: string
 *                 pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$'
 *                 description: Horário de início (HH:mm)
 *               fim:
 *                 type: string
 *                 pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$'
 *                 description: Horário de fim (HH:mm)
 *               ordem:
 *                 type: integer
 *                 minimum: 1
 *                 description: Ordem do bloco
 *     responses:
 *       201:
 *         description: Bloco criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bloco'
 *       400:
 *         description: Dados inválidos ou horário início >= fim
 *       409:
 *         description: Bloco já existe (turno, dia e ordem duplicados)
 */
router.post('/', criarBloco);

/**
 * @swagger
 * /api/v1/blocos:
 *   get:
 *     summary: Listar blocos com filtros e paginação
 *     tags: [Blocos]
 *     parameters:
 *       - in: query
 *         name: turno
 *         schema:
 *           type: string
 *           enum: [Manhã, Tarde, Noite, Integral]
 *         description: Filtro por turno
 *       - in: query
 *         name: diaSemana
 *         schema:
 *           type: string
 *           enum: [Segunda, Terça, Quarta, Quinta, Sexta, Sábado, Domingo]
 *         description: Filtro por dia da semana
 *       - in: query
 *         name: ordem
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Filtro por ordem do bloco
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
 *         description: Lista de blocos ordenada por ordem crescente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 blocos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Bloco'
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
router.get('/', listarBlocos);

/**
 * @swagger
 * /api/v1/blocos/{id}:
 *   put:
 *     summary: Atualizar um bloco de horário
 *     tags: [Blocos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do bloco
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               turno:
 *                 type: string
 *                 enum: [Manhã, Tarde, Noite, Integral]
 *               diaSemana:
 *                 type: string
 *                 enum: [Segunda, Terça, Quarta, Quinta, Sexta, Sábado, Domingo]
 *               inicio:
 *                 type: string
 *                 pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$'
 *               fim:
 *                 type: string
 *                 pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$'
 *               ordem:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Bloco atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bloco'
 *       400:
 *         description: Dados inválidos ou ID inválido
 *       404:
 *         description: Bloco não encontrado
 *       409:
 *         description: Conflito com bloco existente
 */
router.put('/:id', atualizarBloco);

/**
 * @swagger
 * /api/v1/blocos/{id}:
 *   delete:
 *     summary: Remover um bloco de horário
 *     tags: [Blocos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do bloco
 *     responses:
 *       204:
 *         description: Bloco removido com sucesso
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Bloco não encontrado
 */
router.delete('/:id', removerBloco);

module.exports = router;