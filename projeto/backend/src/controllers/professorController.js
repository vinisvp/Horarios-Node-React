const { Professor } = require('../models');
const mongoose = require('mongoose');

/**
 * Controller para gerenciamento de professores
 * @module ProfessorController
 */

/**
 * Cria um novo professor
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<void>}
 */
const criarProfessor = async (req, res) => {
  try {
    const { nome, email, telefone, status } = req.body;

    // Verificar se email já existe
    const professorExistente = await Professor.findOne({ email: email.toLowerCase() });
    if (professorExistente) {
      return res.status(409).json({ message: 'Email já cadastrado para outro professor' });
    }

    const professor = new Professor({
      nome,
      email,
      telefone,
      status: status || 'Ativo'
    });

    const professorSalvo = await professor.save();
    res.status(201).json(professorSalvo);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar professor', details: error.message });
  }
};

/**
 * Lista professores com filtros e paginação
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<void>}
 */
const listarProfessores = async (req, res) => {
  try {
    const { nome, email, status, page = 1, limit = 20 } = req.query;
    
    const filtros = {};
    
    if (nome) {
      filtros.nome = { $regex: nome, $options: 'i' };
    }
    
    if (email) {
      filtros.email = { $regex: email, $options: 'i' };
    }
    
    if (status) {
      filtros.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const professores = await Professor.find(filtros)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ nome: 1 });

    const total = await Professor.countDocuments(filtros);

    res.json({
      professores,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar professores', details: error.message });
  }
};

/**
 * Atualiza um professor por ID
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<void>}
 */
const atualizarProfessor = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, telefone, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID do professor inválido' });
    }

    // Se email está sendo atualizado, verificar duplicidade
    if (email) {
      const professorExistente = await Professor.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: id }
      });
      if (professorExistente) {
        return res.status(409).json({ message: 'Email já cadastrado para outro professor' });
      }
    }

    const dadosAtualizacao = {};
    if (nome !== undefined) dadosAtualizacao.nome = nome;
    if (email !== undefined) dadosAtualizacao.email = email;
    if (telefone !== undefined) dadosAtualizacao.telefone = telefone;
    if (status !== undefined) dadosAtualizacao.status = status;

    const professor = await Professor.findByIdAndUpdate(
      id,
      dadosAtualizacao,
      { new: true, runValidators: true }
    );

    if (!professor) {
      return res.status(404).json({ message: 'Professor não encontrado' });
    }

    res.json(professor);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar professor', details: error.message });
  }
};

/**
 * Remove um professor por ID
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<void>}
 */
const removerProfessor = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID do professor inválido' });
    }

    const professor = await Professor.findByIdAndDelete(id);

    if (!professor) {
      return res.status(404).json({ message: 'Professor não encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover professor', details: error.message });
  }
};

module.exports = {
  criarProfessor,
  listarProfessores,
  atualizarProfessor,
  removerProfessor
};