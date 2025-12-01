const Aula = require('../models/Aula');
const Curso = require('../models/Curso');
const Disciplina = require('../models/Disciplina');
const Professor = require('../models/Professor');
const Laboratorio = require('../models/Laboratorio');
const Bloco = require('../models/Bloco');

/**
 * @fileoverview Controller para operações CRUD de Aulas
 * @description Gerencia todas as operações relacionadas ao agendamento de aulas
 */

/**
 * Valida se todos os ObjectIds existem no banco de dados
 * @async
 * @function validarReferencias
 * @param {Object} dados - Dados da aula
 * @returns {Promise<Object|null>} Retorna erro se alguma referência não existir
 */
const validarReferencias = async (dados) => {
  const { cursoId, disciplinaId, professorId, laboratorioId, blocos } = dados;

  if (cursoId && !(await Curso.findById(cursoId))) {
    return { status: 404, message: 'Curso não encontrado' };
  }

  if (disciplinaId && !(await Disciplina.findById(disciplinaId))) {
    return { status: 404, message: 'Disciplina não encontrada' };
  }

  if (professorId && !(await Professor.findById(professorId))) {
    return { status: 404, message: 'Professor não encontrado' };
  }

  if (laboratorioId && !(await Laboratorio.findById(laboratorioId))) {
    return { status: 404, message: 'Laboratório não encontrado' };
  }

  if (blocos && blocos.length > 0) {
    for (const blocoId of blocos) {
      if (!(await Bloco.findById(blocoId))) {
        return { status: 404, message: `Bloco de horário ${blocoId} não encontrado` };
      }
    }
  }

  return null;
};

/**
 * Verifica conflitos de agendamento
 * @async
 * @function verificarConflitos
 * @param {Object} dados - Dados da aula
 * @param {string} [excludeId] - ID da aula a excluir da verificação
 * @returns {Promise<Object|null>} Retorna erro se houver conflito
 */
const verificarConflitos = async (dados, excludeId = null) => {
  const { laboratorioId, professorId, diaSemana, blocos } = dados;

  const query = {
    diaSemana,
    blocos: { $in: blocos }
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  // Verificar conflito de laboratório
  const conflitoLab = await Aula.findOne({ ...query, laboratorioId });
  if (conflitoLab) {
    return {
      status: 409,
      message: 'Laboratório já está agendado para este dia da semana e horário'
    };
  }

  // Verificar conflito de professor
  const conflitoProf = await Aula.findOne({ ...query, professorId });
  if (conflitoProf) {
    return {
      status: 409,
      message: 'Professor já está agendado para este dia da semana e horário'
    };
  }

  return null;
};

/**
 * Cria uma nova aula
 * @async
 * @function criarAula
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<void>} Resposta JSON com a aula criada
 */
const criarAula = async (req, res) => {
  try {
    const { semestre, cursoId, disciplinaId, professorId, laboratorioId, diaSemana, blocos, dataInicio, dataFim } = req.body;

    // Validar referências
    const erroReferencia = await validarReferencias(req.body);
    if (erroReferencia) {
      return res.status(erroReferencia.status).json({ message: erroReferencia.message });
    }

    // Validar conflitos
    const erroConflito = await verificarConflitos(req.body);
    if (erroConflito) {
      return res.status(erroConflito.status).json({ message: erroConflito.message });
    }

    const aula = new Aula({
      semestre,
      cursoId,
      disciplinaId,
      professorId,
      laboratorioId,
      diaSemana,
      blocos,
      dataInicio,
      dataFim
    });

    const aulaSalva = await aula.save();
    res.status(201).json(aulaSalva);
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
 * Lista aulas com filtros e paginação
 * @async
 * @function listarAulas
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<void>} Resposta JSON com lista paginada de aulas
 */
const listarAulas = async (req, res) => {
  try {
    const { professorId, laboratorioId, diaSemana, semestre, page = 1, limit = 20 } = req.query;
    
    const filtros = {};
    
    if (professorId) filtros.professorId = professorId;
    if (laboratorioId) filtros.laboratorioId = laboratorioId;
    if (diaSemana) filtros.diaSemana = diaSemana;
    if (semestre) filtros.semestre = semestre;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [aulas, total] = await Promise.all([
      Aula.find(filtros)
        .populate('cursoId', 'nome')
        .populate('disciplinaId', 'nome')
        .populate('professorId', 'nome')
        .populate('laboratorioId', 'nome')
        .populate('blocos', 'turno inicio fim ordem')
        .sort({ dataInicio: 1, diaSemana: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Aula.countDocuments(filtros)
    ]);

    res.json({
      aulas,
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
 * Atualiza uma aula por ID
 * @async
 * @function atualizarAula
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<void>} Resposta JSON com a aula atualizada
 */
const atualizarAula = async (req, res) => {
  try {
    const { id } = req.params;
    const dadosAtualizacao = req.body;

    // Verificar se a aula existe
    const aulaExistente = await Aula.findById(id);
    if (!aulaExistente) {
      return res.status(404).json({ message: 'Aula não encontrada' });
    }

    // Validar referências se fornecidas
    const erroReferencia = await validarReferencias(dadosAtualizacao);
    if (erroReferencia) {
      return res.status(erroReferencia.status).json({ message: erroReferencia.message });
    }

    // Verificar conflitos se campos relevantes foram alterados
    const camposConflito = ['laboratorioId', 'professorId', 'diaSemana', 'blocos'];
    const temAlteracaoConflito = camposConflito.some(campo => dadosAtualizacao.hasOwnProperty(campo));
    
    if (temAlteracaoConflito) {
      const dadosParaVerificacao = {
        laboratorioId: dadosAtualizacao.laboratorioId || aulaExistente.laboratorioId,
        professorId: dadosAtualizacao.professorId || aulaExistente.professorId,
        diaSemana: dadosAtualizacao.diaSemana || aulaExistente.diaSemana,
        blocos: dadosAtualizacao.blocos || aulaExistente.blocos
      };

      const erroConflito = await verificarConflitos(dadosParaVerificacao, id);
      if (erroConflito) {
        return res.status(erroConflito.status).json({ message: erroConflito.message });
      }
    }

    const aula = await Aula.findByIdAndUpdate(
      id,
      dadosAtualizacao,
      { new: true, runValidators: true }
    ).populate(['cursoId', 'disciplinaId', 'professorId', 'laboratorioId', 'blocos']);

    res.json(aula);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Dados inválidos',
        details: error.message
      });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'ID inválido' });
    }
    res.status(500).json({
      message: 'Erro interno do servidor',
      details: error.message
    });
  }
};

/**
 * Remove uma aula por ID
 * @async
 * @function removerAula
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<void>} Resposta com status 204 ou erro
 */
const removerAula = async (req, res) => {
  try {
    const { id } = req.params;

    const aula = await Aula.findByIdAndDelete(id);

    if (!aula) {
      return res.status(404).json({ message: 'Aula não encontrada' });
    }

    res.status(204).send();
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'ID inválido' });
    }
    res.status(500).json({
      message: 'Erro interno do servidor',
      details: error.message
    });
  }
};

module.exports = {
  criarAula,
  listarAulas,
  atualizarAula,
  removerAula
};