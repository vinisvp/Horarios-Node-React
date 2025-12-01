const express = require('express');
const aulaController = require('../controllers/aulaController');

/**
 * @fileoverview Rotas para operações de Aulas/Agendamentos
 * @description Define todas as rotas relacionadas ao agendamento de aulas
 */

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Aula:
 *       type: object
 *       required:
 *         - semestre
 *         - cursoId
 *         - disciplinaId
 *         - professorId
 *         - laboratorioId
 *         - diaSemana
 *         - blocos
 *         - dataInicio
 *         - dataFim
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único da aula
 *         semestre:
 *           type: string
 *           description: Semestre da aula
 *           example: "2024.1"
 *         cursoId:
 *           type: string
 *           description: ID do curso
 *         disciplinaId:
 *           type: string
 *           description: ID da disciplina
 *         professorId:
 *           type: string
 *           description: ID do professor
 *         laboratorioId:
 *           type: string
 *           description: ID do laboratório
 *         diaSemana:
 *           type: string
 *           enum: [Segunda, Terça, Quarta, Quinta, Sexta, Sábado, Domingo]
 *           description: Dia da semana da aula
 *         blocos:
 *           type: array
 *           items:
 *             type: string
 *           description: Array de IDs dos blocos de horário
 *         dataInicio:
 *           type: string
 *           format: date
 *           description: Data de início do período da aula
 *         dataFim:
 *           type: string
 *           format: date
 *           description: Data de fim do período da aula
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
 *         semestre: "2024.1"
 *         cursoId: "507f1f77bcf86cd799439012"
 *         disciplinaId: "507f1f77bcf86cd799439013"
 *         professorId: "507f1f77bcf86cd799439014"
 *         laboratorioId: "507f1f77bcf86cd799439015"
 *         diaSemana: "Segunda"
 *         blocos: ["507f1f77bcf86cd799439016"]
 *         dataInicio: "2024-02-01"
 *         dataFim: "2024-06-30"
 */

/**
 * @swagger
 * /api/v1/aulas:
 *   post:
 *     summary: Criar uma nova aula/agendamento
 *     tags: [Aulas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - semestre
 *               - cursoId
 *               - disciplinaId
 *               - professorId
 *               - laboratorioId
 *               - diaSemana
 *               - blocos
 *               - dataInicio
 *               - dataFim
 *             properties:
 *               semestre:
 *                 type: string
 *                 description: Semestre da aula
 *                 example: "2024.1"
 *               cursoId:
 *                 type: string
 *                 description: ID do curso
 *               disciplinaId:
 *                 type: string
 *                 description: ID da disciplina
 *               professorId:
 *                 type: string
 *                 description: ID do professor
 *               laboratorioId:
 *                 type: string
 *                 description: ID do laboratório
 *               diaSemana:
 *                 type: string
 *                 enum: [Segunda, Terça, Quarta, Quinta, Sexta, Sábado, Domingo]
 *                 description: Dia da semana
 *               blocos:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array de IDs dos blocos de horário
 *               dataInicio:
 *                 type: string
 *                 format: date
 *                 description: Data de início
 *               dataFim:
 *                 type: string
 *                 format: date
 *                 description: Data de fim
 *     responses:
 *       201:
 *         description: Aula criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Aula'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Referência não encontrada (curso, disciplina, professor, laboratório ou bloco)
 *       409:
 *         description: Conflito de agendamento (laboratório ou professor já agendado)
 */
router.post('/', aulaController.criarAula);

/**
 * @swagger
 * /api/v1/aulas:
 *   get:
 *     summary: Listar aulas/agendamentos
 *     tags: [Aulas]
 *     parameters:
 *       - in: query
 *         name: semestre
 *         schema:
 *           type: string
 *         description: Filtrar por semestre
 *       - in: query
 *         name: cursoId
 *         schema:
 *           type: string
 *         description: Filtrar por curso
 *       - in: query
 *         name: disciplinaId
 *         schema:
 *           type: string
 *         description: Filtrar por disciplina
 *       - in: query
 *         name: professorId
 *         schema:
 *           type: string
 *         description: Filtrar por professor
 *       - in: query
 *         name: laboratorioId
 *         schema:
 *           type: string
 *         description: Filtrar por laboratório
 *       - in: query
 *         name: diaSemana
 *         schema:
 *           type: string
 *           enum: [Segunda, Terça, Quarta, Quinta, Sexta, Sábado, Domingo]
 *         description: Filtrar por dia da semana
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Itens por página
 *     responses:
 *       200:
 *         description: Lista de aulas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Aula'
 */
router.get('/', aulaController.listarAulas);

/**
 * @swagger
 * /api/v1/aulas/{id}:
 *   put:
 *     summary: Atualizar uma aula/agendamento
 *     tags: [Aulas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da aula
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               semestre:
 *                 type: string
 *               cursoId:
 *                 type: string
 *               disciplinaId:
 *                 type: string
 *               professorId:
 *                 type: string
 *               laboratorioId:
 *                 type: string
 *               diaSemana:
 *                 type: string
 *                 enum: [Segunda, Terça, Quarta, Quinta, Sexta, Sábado, Domingo]
 *               blocos:
 *                 type: array
 *                 items:
 *                   type: string
 *               dataInicio:
 *                 type: string
 *                 format: date
 *               dataFim:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Aula atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Aula'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Aula não encontrada
 *       409:
 *         description: Conflito de agendamento
 *   delete:
 *     summary: Remover uma aula/agendamento
 *     tags: [Aulas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da aula
 *     responses:
 *       200:
 *         description: Aula removida com sucesso
 *       404:
 *         description: Aula não encontrada
 */
router.put('/:id', aulaController.atualizarAula);
router.delete('/:id', aulaController.removerAula);

module.exports = router;