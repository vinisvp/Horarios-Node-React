const { Disciplina, Curso, Professor } = require('../models');
const mongoose = require('mongoose');

/**
 * Controller para gerenciamento de disciplinas
 * @module DisciplinaController
 */

/**
 * Cria uma nova disciplina
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<void>}
 */
const criarDisciplina = async (req, res) => {
  try {
    const { cursoId, nome, cargaHoraria, professorId, status } = req.body;

    // Validar se cursoId é um ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(cursoId)) {
      return res.status(400).json({ message: 'ID do curso inválido' });
    }

    // Verificar se o curso existe
    const curso = await Curso.findById(cursoId);
    if (!curso) {
      return res.status(404).json({ message: 'Curso não encontrado' });
    }

    // Se professorId foi fornecido, validar
    if (professorId) {
      if (!mongoose.Types.ObjectId.isValid(professorId)) {
        return res.status(400).json({ message: 'ID do professor inválido' });
      }

      const professor = await Professor.findById(professorId);
      if (!professor) {
        return res.status(404).json({ message: 'Professor não encontrado' });
      }
    }

    const disciplina = new Disciplina({
      cursoId,
      nome,
      cargaHoraria,
      professorId: professorId || null,
      status: status || 'Ativo'
    });

    const disciplinaSalva = await disciplina.save();
    res.status(201).json(disciplinaSalva);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar disciplina', details: error.message });
  }
};

/**
 * Lista disciplinas com filtros e paginação
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<void>}
 */
const listarDisciplinas = async (req, res) => {
  try {
    const { cursoId, professorId, nome, status, page = 1, limit = 20 } = req.query;
    
    const filtros = {};
    
    if (cursoId) {
      if (!mongoose.Types.ObjectId.isValid(cursoId)) {
        return res.status(400).json({ message: 'ID do curso inválido' });
      }
      filtros.cursoId = cursoId;
    }
    
    if (professorId) {
      if (!mongoose.Types.ObjectId.isValid(professorId)) {
        return res.status(400).json({ message: 'ID do professor inválido' });
      }
      filtros.professorId = professorId;
    }
    
    if (nome) {
      filtros.nome = { $regex: nome, $options: 'i' };
    }
    
    if (status) {
      filtros.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const disciplinas = await Disciplina.find(filtros)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ nome: 1 });

    const total = await Disciplina.countDocuments(filtros);

    res.json({
      disciplinas,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar disciplinas', details: error.message });
  }
};

/**
 * Atualiza uma disciplina por ID
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<void>}
 */
const atualizarDisciplina = async (req, res) => {
  try {
    const { id } = req.params;
    const { cursoId, nome, cargaHoraria, professorId, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID da disciplina inválido' });
    }

    // Se cursoId está sendo atualizado, verificar se existe
    if (cursoId) {
      if (!mongoose.Types.ObjectId.isValid(cursoId)) {
        return res.status(400).json({ message: 'ID do curso inválido' });
      }

      const curso = await Curso.findById(cursoId);
      if (!curso) {
        return res.status(404).json({ message: 'Curso não encontrado' });
      }
    }

    // Se professorId está sendo atualizado, verificar se existe
    if (professorId) {
      if (!mongoose.Types.ObjectId.isValid(professorId)) {
        return res.status(400).json({ message: 'ID do professor inválido' });
      }

      const professor = await Professor.findById(professorId);
      if (!professor) {
        return res.status(404).json({ message: 'Professor não encontrado' });
      }
    }

    const dadosAtualizacao = {};
    if (cursoId !== undefined) dadosAtualizacao.cursoId = cursoId;
    if (nome !== undefined) dadosAtualizacao.nome = nome;
    if (cargaHoraria !== undefined) dadosAtualizacao.cargaHoraria = cargaHoraria;
    if (professorId !== undefined) dadosAtualizacao.professorId = professorId;
    if (status !== undefined) dadosAtualizacao.status = status;

    const disciplina = await Disciplina.findByIdAndUpdate(
      id,
      dadosAtualizacao,
      { new: true, runValidators: true }
    );

    if (!disciplina) {
      return res.status(404).json({ message: 'Disciplina não encontrada' });
    }

    res.json(disciplina);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar disciplina', details: error.message });
  }
};

/**
 * Remove uma disciplina por ID
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<void>}
 */
const removerDisciplina = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID da disciplina inválido' });
    }

    const disciplina = await Disciplina.findByIdAndDelete(id);

    if (!disciplina) {
      return res.status(404).json({ message: 'Disciplina não encontrada' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover disciplina', details: error.message });
  }
};

module.exports = {
  criarDisciplina,
  listarDisciplinas,
  atualizarDisciplina,
  removerDisciplina
};