const express = require('express');
const router = express.Router();
const professorController = require('../controllers/professorController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Professor:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único do professor
 *         nome:
 *           type: string
 *           description: Nome do professor
 *         email:
 *           type: string
 *           description: Email do professor (único)
 *         telefone:
 *           type: string
 *           description: Telefone do professor
 *         status:
 *           type: string
 *           enum: [Ativo, Inativo]
 *           description: Status do professor
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
 * /api/v1/professores:
 *   post:
 *     summary: Cria um novo professor
 *     tags: [Professores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               telefone:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Ativo, Inativo]
 *     responses:
 *       201:
 *         description: Professor criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professor'
 *       409:
 *         description: Email já cadastrado
 *       400:
 *         description: Dados inválidos
 */
router.post('/', professorController.criarProfessor);

/**
 * @swagger
 * /api/v1/professores:
 *   get:
 *     summary: Lista professores com filtros e paginação
 *     tags: [Professores]
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtrar por nome (contém)
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filtrar por email (contém)
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
 *         description: Lista de professores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 professores:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Professor'
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
router.get('/', professorController.listarProfessores);

/**
 * @swagger
 * /api/v1/professores/{id}:
 *   put:
 *     summary: Atualiza um professor
 *     tags: [Professores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do professor
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               telefone:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Ativo, Inativo]
 *     responses:
 *       200:
 *         description: Professor atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professor'
 *       404:
 *         description: Professor não encontrado
 *       409:
 *         description: Email já cadastrado
 */
router.put('/:id', professorController.atualizarProfessor);

/**
 * @swagger
 * /api/v1/professores/{id}:
 *   delete:
 *     summary: Remove um professor
 *     tags: [Professores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do professor
 *     responses:
 *       204:
 *         description: Professor removido com sucesso
 *       404:
 *         description: Professor não encontrado
 */
router.delete('/:id', professorController.removerProfessor);

module.exports = router;