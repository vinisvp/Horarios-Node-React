const Bloco = require('../models/Bloco');

/**
 * @fileoverview Controller para operações CRUD de Blocos de Horários
 * @description Gerencia todas as operações relacionadas aos blocos de horários
 */

/**
 * Cria um novo bloco de horário
 * @async
 * @function criarBloco
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<void>} Resposta JSON com o bloco criado
 */
const criarBloco = async (req, res) => {
  try {
    const { turno, diaSemana, inicio, fim, ordem } = req.body;

    // Verificar duplicidade da combinação (turno, diaSemana, ordem)
    const blocoExistente = await Bloco.findOne({ turno, diaSemana, ordem });
    if (blocoExistente) {
      return res.status(409).json({
        message: 'Já existe um bloco com este turno, dia da semana e ordem'
      });
    }

    const bloco = new Bloco({
      turno,
      diaSemana,
      inicio,
      fim,
      ordem
    });

    const blocoSalvo = await bloco.save();
    res.status(201).json(blocoSalvo);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Dados inválidos',
        details: error.message
      });
    }
    if (error.message.includes('Horário de início deve ser anterior')) {
      return res.status(400).json({
        message: error.message
      });
    }
    res.status(500).json({
      message: 'Erro interno do servidor',
      details: error.message
    });
  }
};

/**
 * Lista blocos com filtros e paginação
 * @async
 * @function listarBlocos
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<void>} Resposta JSON com lista paginada de blocos
 */
const listarBlocos = async (req, res) => {
  try {
    const { turno, diaSemana, ordem, page = 1, limit = 20 } = req.query;
    
    const filtros = {};
    
    if (turno) {
      filtros.turno = turno;
    }
    
    if (diaSemana) {
      filtros.diaSemana = diaSemana;
    }
    
    if (ordem) {
      filtros.ordem = parseInt(ordem);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [blocos, total] = await Promise.all([
      Bloco.find(filtros)
        .sort({ turno: 1, diaSemana: 1, ordem: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Bloco.countDocuments(filtros)
    ]);

    res.json({
      blocos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erro interno do servidor',
      details: error.message
    });
  }
};

/**
 * Atualiza um bloco por ID
 * @async
 * @function atualizarBloco
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<void>} Resposta JSON com o bloco atualizado
 */
const atualizarBloco = async (req, res) => {
  try {
    const { id } = req.params;
    const dadosAtualizacao = req.body;

    // Se alterando turno, diaSemana ou ordem, verificar duplicidade
    if (dadosAtualizacao.turno || dadosAtualizacao.diaSemana || dadosAtualizacao.ordem) {
      const blocoAtual = await Bloco.findById(id);
      if (!blocoAtual) {
        return res.status(404).json({
          message: 'Bloco não encontrado'
        });
      }

      const novoTurno = dadosAtualizacao.turno || blocoAtual.turno;
      const novoDiaSemana = dadosAtualizacao.diaSemana || blocoAtual.diaSemana;
      const novaOrdem = dadosAtualizacao.ordem || blocoAtual.ordem;

      const blocoExistente = await Bloco.findOne({
        _id: { $ne: id },
        turno: novoTurno,
        diaSemana: novoDiaSemana,
        ordem: novaOrdem
      });

      if (blocoExistente) {
        return res.status(409).json({
          message: 'Já existe um bloco com este turno, dia da semana e ordem'
        });
      }
    }

    const bloco = await Bloco.findByIdAndUpdate(
      id,
      dadosAtualizacao,
      { new: true, runValidators: true }
    );

    if (!bloco) {
      return res.status(404).json({
        message: 'Bloco não encontrado'
      });
    }

    res.json(bloco);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Dados inválidos',
        details: error.message
      });
    }
    if (error.message.includes('Horário de início deve ser anterior')) {
      return res.status(400).json({
        message: error.message
      });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'ID inválido'
      });
    }
    res.status(500).json({
      message: 'Erro interno do servidor',
      details: error.message
    });
  }
};

/**
 * Remove um bloco por ID
 * @async
 * @function removerBloco
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<void>} Resposta com status 204 ou erro
 */
const removerBloco = async (req, res) => {
  try {
    const { id } = req.params;

    const bloco = await Bloco.findByIdAndDelete(id);

    if (!bloco) {
      return res.status(404).json({
        message: 'Bloco não encontrado'
      });
    }

    res.status(204).send();
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'ID inválido'
      });
    }
    res.status(500).json({
      message: 'Erro interno do servidor',
      details: error.message
    });
  }
};

module.exports = {
  criarBloco,
  listarBlocos,
  atualizarBloco,
  removerBloco
};