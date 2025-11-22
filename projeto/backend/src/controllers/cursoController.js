const { Curso, Instituicao } = require('../models');
const mongoose = require('mongoose');

/**
 * Controller para gerenciamento de cursos
 * @module CursoController
 */

/**
 * Cria um novo curso
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<void>}
 */
const criarCurso = async (req, res) => {
  try {
    const { instituicaoId, nome, turnos, status } = req.body;

    // Verificar se a instituição existe pelo ID
    const instituicao = await Instituicao.findOne({ _id: instituicaoId }).catch(() => null);
    if (!instituicao) {
      return res.status(404).json({ message: 'Instituição não encontrada' });
    }

    const curso = new Curso({
      instituicaoId,
      nome,
      turnos: turnos || [],
      ativo: status !== undefined ? status === 'Ativo' : true
    });

    const cursoSalvo = await curso.save();
    res.status(201).json(cursoSalvo);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar curso', details: error.message });
  }
};

/**
 * Lista cursos com filtros e paginação
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<void>}
 */
const listarCursos = async (req, res) => {
  try {
    const { instituicaoId, nome, status, page = 1, limit = 20 } = req.query;
    
    const filtros = {};
    
    if (instituicaoId) {
      filtros.instituicaoId = instituicaoId;
    }
    
    if (nome) {
      filtros.nome = { $regex: nome, $options: 'i' };
    }
    
    if (status) {
      filtros.ativo = status === 'Ativo';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const cursos = await Curso.find(filtros)
      .populate('instituicaoId', 'nome')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Curso.countDocuments(filtros);

    res.json({
      cursos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar cursos', details: error.message });
  }
};

/**
 * Atualiza um curso por ID
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<void>}
 */
const atualizarCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const { instituicaoId, nome, turnos, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID do curso inválido' });
    }

    const dadosAtualizacao = {};
    
    if (instituicaoId) {
      const instituicao = await Instituicao.findOne({ _id: instituicaoId }).catch(() => null);
      if (!instituicao) {
        return res.status(404).json({ message: 'Instituição não encontrada' });
      }
      
      dadosAtualizacao.instituicaoId = instituicaoId;
    }
    
    if (nome !== undefined) dadosAtualizacao.nome = nome;
    if (turnos !== undefined) dadosAtualizacao.turnos = turnos;
    if (status !== undefined) dadosAtualizacao.ativo = status === 'Ativo';

    const curso = await Curso.findByIdAndUpdate(
      id,
      dadosAtualizacao,
      { new: true, runValidators: true }
    ).populate('instituicaoId', 'nome');

    if (!curso) {
      return res.status(404).json({ message: 'Curso não encontrado' });
    }

    res.json(curso);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar curso', details: error.message });
  }
};

/**
 * Remove um curso por ID
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<void>}
 */
const removerCurso = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID do curso inválido' });
    }

    const curso = await Curso.findByIdAndDelete(id);

    if (!curso) {
      return res.status(404).json({ message: 'Curso não encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover curso', details: error.message });
  }
};

module.exports = {
  criarCurso,
  listarCursos,
  atualizarCurso,
  removerCurso
};