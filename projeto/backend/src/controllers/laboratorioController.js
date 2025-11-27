const Laboratorio = require('../models/Laboratorio');

/**
 * @fileoverview Controller para operações CRUD de Laboratórios
 * @description Gerencia todas as operações relacionadas aos laboratórios
 */

/**
 * Cria um novo laboratório
 * @async
 * @function criarLaboratorio
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<void>} Resposta JSON com o laboratório criado
 */
const criarLaboratorio = async (req, res) => {
  console.log('POST /api/v1/laboratorios chamado com:', req.body);
  try {
    const { nome, capacidade, local, status } = req.body;

    // Verificar duplicidade de nome no mesmo local
    if (local) {
      const laboratorioExistente = await Laboratorio.findOne({ 
        nome: { $regex: new RegExp(`^${nome}$`, 'i') }, 
        local: { $regex: new RegExp(`^${local}$`, 'i') } 
      });
      
      if (laboratorioExistente) {
        return res.status(409).json({
          message: 'Já existe um laboratório com este nome no local especificado'
        });
      }
    }

    const laboratorio = new Laboratorio({
      nome,
      capacidade,
      local,
      status: status || 'Ativo'
    });

    const laboratorioSalvo = await laboratorio.save();
    res.status(201).json(laboratorioSalvo);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Dados inválidos',
        details: error.message
      });
    }
    res.status(500).json({
      message: 'Erro interno do servidor',
      details: error.message
    });
  }
};

/**
 * Lista laboratórios com filtros e paginação
 * @async
 * @function listarLaboratorios
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<void>} Resposta JSON com lista paginada de laboratórios
 */
const listarLaboratorios = async (req, res) => {
  try {
    const { local, nome, status, minCapacidade, page = 1, limit = 20 } = req.query;
    
    const filtros = {};
    
    if (local) {
      filtros.local = { $regex: local, $options: 'i' };
    }
    
    if (nome) {
      filtros.nome = { $regex: nome, $options: 'i' };
    }
    
    if (status) {
      filtros.status = status;
    }
    
    if (minCapacidade) {
      filtros.capacidade = { $gte: parseInt(minCapacidade) };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [laboratorios, total] = await Promise.all([
      Laboratorio.find(filtros)
        .sort({ nome: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Laboratorio.countDocuments(filtros)
    ]);

    res.json({
      laboratorios,
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
 * Atualiza um laboratório por ID
 * @async
 * @function atualizarLaboratorio
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<void>} Resposta JSON com o laboratório atualizado
 */
const atualizarLaboratorio = async (req, res) => {
  try {
    const { id } = req.params;
    const dadosAtualizacao = req.body;

    const laboratorio = await Laboratorio.findByIdAndUpdate(
      id,
      dadosAtualizacao,
      { new: true, runValidators: true }
    );

    if (!laboratorio) {
      return res.status(404).json({
        message: 'Laboratório não encontrado'
      });
    }

    res.json(laboratorio);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Dados inválidos',
        details: error.message
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
 * Remove um laboratório por ID
 * @async
 * @function removerLaboratorio
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<void>} Resposta com status 204 ou erro
 */
const removerLaboratorio = async (req, res) => {
  try {
    const { id } = req.params;

    const laboratorio = await Laboratorio.findByIdAndDelete(id);

    if (!laboratorio) {
      return res.status(404).json({
        message: 'Laboratório não encontrado'
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
  criarLaboratorio,
  listarLaboratorios,
  atualizarLaboratorio,
  removerLaboratorio
};