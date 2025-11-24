const express = require('express');
const router = express.Router();
const disciplinaController = require('../controllers/disciplinaController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Disciplina:
 *       type: object
 *       required:
 *         - cursoId
 *         - nome
 *         - cargaHoraria
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único da disciplina
 *         cursoId:
 *           type: string
 *           description: ID do curso (referência)
 *         nome:
 *           type: string
 *           description: Nome da disciplina
 *         cargaHoraria:
 *           type: integer
 *           minimum: 1
 *           description: Carga horária em horas (número positivo)
 *         professorId:
 *           type: string
 *           description: ID do professor responsável (opcional)
 *         status:
 *           type: string
 *           enum: [Ativo, Inativo]
 *           description: Status da disciplina
 *           default: Ativo
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v1/disciplinas:
 *   post:
 *     summary: Cria uma nova disciplina
 *     tags: [Disciplinas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cursoId
 *               - nome
 *               - cargaHoraria
 *             properties:
 *               cursoId:
 *                 type: string
 *                 description: ID do curso
 *               nome:
 *                 type: string
 *                 description: Nome da disciplina
 *               cargaHoraria:
 *                 type: integer
 *                 minimum: 1
 *                 description: Carga horária em horas
 *               professorId:
 *                 type: string
 *                 description: ID do professor (opcional)
 *               status:
 *                 type: string
 *                 enum: [Ativo, Inativo]
 *                 description: Status da disciplina
 *     responses:
 *       201:
 *         description: Disciplina criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Disciplina'
 *       404:
 *         description: Curso ou Professor não encontrado
 *       400:
 *         description: Dados inválidos
 */
router.post('/', disciplinaController.criarDisciplina);

/**
 * @swagger
 * /api/v1/disciplinas:
 *   get:
 *     summary: Lista disciplinas com filtros e paginação
 *     tags: [Disciplinas]
 *     parameters:
 *       - in: query
 *         name: cursoId
 *         schema:
 *           type: string
 *         description: Filtrar por curso específico
 *       - in: query
 *         name: professorId
 *         schema:
 *           type: string
 *         description: Filtrar por professor específico
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtrar por nome (contém, case-insensitive)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Ativo, Inativo]
 *         description: Filtrar por status
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
 *         description: Lista de disciplinas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 disciplinas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Disciplina'
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
router.get('/', disciplinaController.listarDisciplinas);

/**
 * @swagger
 * /api/v1/disciplinas/{id}:
 *   put:
 *     summary: Atualiza uma disciplina
 *     tags: [Disciplinas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da disciplina
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cursoId:
 *                 type: string
 *                 description: ID do curso
 *               nome:
 *                 type: string
 *                 description: Nome da disciplina
 *               cargaHoraria:
 *                 type: integer
 *                 minimum: 1
 *                 description: Carga horária em horas
 *               professorId:
 *                 type: string
 *                 description: ID do professor
 *               status:
 *                 type: string
 *                 enum: [Ativo, Inativo]
 *                 description: Status da disciplina
 *     responses:
 *       200:
 *         description: Disciplina atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Disciplina'
 *       404:
 *         description: Disciplina, Curso ou Professor não encontrado
 *       400:
 *         description: Dados inválidos
 */
router.put('/:id', disciplinaController.atualizarDisciplina);

/**
 * @swagger
 * /api/v1/disciplinas/{id}:
 *   delete:
 *     summary: Remove uma disciplina
 *     tags: [Disciplinas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da disciplina
 *     responses:
 *       204:
 *         description: Disciplina removida com sucesso
 *       404:
 *         description: Disciplina não encontrada
 */
router.delete('/:id', disciplinaController.removerDisciplina);

module.exports = router;