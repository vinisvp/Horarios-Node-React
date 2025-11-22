const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Curso:
 *       type: object
 *       required:
 *         - instituicaoId
 *         - nome
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único do curso
 *         instituicaoId:
 *           type: string
 *           description: ID da instituição à qual o curso pertence
 *         nome:
 *           type: string
 *           description: Nome do curso
 *         turnos:
 *           type: array
 *           items:
 *             type: string
 *             enum: [Manhã, Tarde, Noite, Integral]
 *           description: Turnos disponíveis para o curso
 *         ativo:
 *           type: boolean
 *           description: Status ativo/inativo do curso
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v1/cursos:
 *   post:
 *     summary: Cria um novo curso
 *     tags: [Cursos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - instituicaoId
 *               - nome
 *             properties:
 *               instituicaoId:
 *                 type: string
 *               nome:
 *                 type: string
 *               turnos:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [Ativo, Inativo]
 *     responses:
 *       201:
 *         description: Curso criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Curso'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Instituição não encontrada
 */
router.post('/', cursoController.criarCurso);

/**
 * @swagger
 * /api/v1/cursos:
 *   get:
 *     summary: Lista cursos com filtros e paginação
 *     tags: [Cursos]
 *     parameters:
 *       - in: query
 *         name: instituicaoId
 *         schema:
 *           type: string
 *         description: Filtrar por ID da instituição
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtrar por nome (contém)
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
 *         description: Lista de cursos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cursos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Curso'
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
router.get('/', cursoController.listarCursos);

/**
 * @swagger
 * /api/v1/cursos/{id}:
 *   put:
 *     summary: Atualiza um curso
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do curso
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               instituicaoId:
 *                 type: string
 *               nome:
 *                 type: string
 *               turnos:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [Ativo, Inativo]
 *     responses:
 *       200:
 *         description: Curso atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Curso'
 *       404:
 *         description: Curso não encontrado
 */
router.put('/:id', cursoController.atualizarCurso);

/**
 * @swagger
 * /api/v1/cursos/{id}:
 *   delete:
 *     summary: Remove um curso
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do curso
 *     responses:
 *       204:
 *         description: Curso removido com sucesso
 *       404:
 *         description: Curso não encontrado
 */
router.delete('/:id', cursoController.removerCurso);

module.exports = router;