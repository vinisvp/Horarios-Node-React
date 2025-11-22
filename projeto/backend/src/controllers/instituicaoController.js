const Instituicao = require('../models/Instituicao');

/**
 * Controller para operações CRUD de instituições
 * @module InstituicaoController
 */

/**
 * Cria uma nova instituição
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const criarInstituicao = async (req, res, next) => {
  try {
    const instituicao = await Instituicao.create(req.body);
    res.status(201).json(instituicao);
  } catch (error) {
    next(error);
  }
};

/**
 * Lista todas as instituições com filtros opcionais
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const listarInstituicoes = async (req, res, next) => {
  try {
    const { ativo, nome, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (ativo !== undefined) {
      filter.ativo = ativo === 'true';
    }

    if (nome) {
      filter.nome = { $regex: nome, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const instituicoes = await Instituicao.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ nome: 1 });

    res.json(instituicoes);
  } catch (error) {
    next(error);
  }
};

/**
 * Atualiza uma instituição por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const atualizarInstituicao = async (req, res, next) => {
  try {
    const instituicao = await Instituicao.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!instituicao) {
      return res.status(404).json({
        message: 'Instituição não encontrada'
      });
    }

    res.json(instituicao);
  } catch (error) {
    next(error);
  }
};

/**
 * Remove uma instituição por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const removerInstituicao = async (req, res, next) => {
  try {
    console.log('Tentando remover instituição com ID:', req.params.id);
    const instituicao = await Instituicao.findByIdAndDelete(req.params.id);

    if (!instituicao) {
      console.log('Instituição não encontrada:', req.params.id);
      return res.status(404).json({
        message: 'Instituição não encontrada'
      });
    }

    console.log('Instituição removida com sucesso:', req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao remover instituição:', error);
    next(error);
  }
};

module.exports = {
  criarInstituicao,
  listarInstituicoes,
  atualizarInstituicao,
  removerInstituicao
};