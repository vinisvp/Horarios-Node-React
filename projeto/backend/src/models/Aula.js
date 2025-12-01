const mongoose = require('mongoose');

/**
 * @fileoverview Modelo de Aula para agendamento de laboratórios
 * @description Define o schema para aulas/agendamentos de laboratórios com validações e índices
 */

/**
 * Schema para Aulas/Agendamentos
 * @typedef {Object} Aula
 * @property {string} semestre - Semestre da aula (ex: '2024.1')
 * @property {ObjectId} cursoId - Referência ao curso
 * @property {ObjectId} disciplinaId - Referência à disciplina
 * @property {ObjectId} professorId - Referência ao professor
 * @property {ObjectId} laboratorioId - Referência ao laboratório
 * @property {string} diaSemana - Dia da semana da aula
 * @property {ObjectId[]} blocos - Array de blocos de horário
 * @property {Date} dataInicio - Data de início do período da aula
 * @property {Date} dataFim - Data de fim do período da aula
 * @property {Date} createdAt - Data de criação do registro
 * @property {Date} updatedAt - Data da última atualização
 */

const aulaSchema = new mongoose.Schema({
  /**
   * Semestre da aula
   * @type {string}
   * @required
   * @example '2024.1'
   */
  semestre: {
    type: String,
    required: [true, 'Semestre é obrigatório'],
    trim: true,
    maxlength: [10, 'Semestre deve ter no máximo 10 caracteres']
  },

  /**
   * Referência ao curso
   * @type {ObjectId}
   * @required
   * @ref 'Curso'
   */
  cursoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curso',
    required: [true, 'Curso é obrigatório']
  },

  /**
   * Referência à disciplina
   * @type {ObjectId}
   * @required
   * @ref 'Disciplina'
   */
  disciplinaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Disciplina',
    required: [true, 'Disciplina é obrigatória']
  },

  /**
   * Referência ao professor
   * @type {ObjectId}
   * @required
   * @ref 'Professor'
   */
  professorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor',
    required: [true, 'Professor é obrigatório']
  },

  /**
   * Referência ao laboratório
   * @type {ObjectId}
   * @required
   * @ref 'Laboratorio'
   */
  laboratorioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Laboratorio',
    required: [true, 'Laboratório é obrigatório']
  },

  /**
   * Dia da semana da aula
   * @type {string}
   * @required
   * @enum ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
   */
  diaSemana: {
    type: String,
    required: [true, 'Dia da semana é obrigatório'],
    enum: {
      values: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
      message: 'Dia da semana deve ser um dos valores: Segunda, Terça, Quarta, Quinta, Sexta, Sábado, Domingo'
    }
  },

  /**
   * Array de blocos de horário
   * @type {ObjectId[]}
   * @required
   * @ref 'Bloco'
   */
  blocos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bloco',
    required: true
  }],

  /**
   * Data de início do período da aula
   * @type {Date}
   * @required
   */
  dataInicio: {
    type: Date,
    required: [true, 'Data de início é obrigatória']
  },

  /**
   * Data de fim do período da aula
   * @type {Date}
   * @required
   */
  dataFim: {
    type: Date,
    required: [true, 'Data de fim é obrigatória']
  }
}, {
  timestamps: true,
  collection: 'aulas'
});

/**
 * Validação customizada para garantir que dataInicio seja anterior ou igual a dataFim
 */
aulaSchema.pre('validate', function(next) {
  if (this.dataInicio && this.dataFim && this.dataInicio > this.dataFim) {
    this.invalidate('dataFim', 'Data de fim deve ser posterior ou igual à data de início');
  }
  next();
});

/**
 * Validação customizada para garantir que o array blocos não esteja vazio
 */
aulaSchema.pre('validate', function(next) {
  if (!this.blocos || this.blocos.length === 0) {
    this.invalidate('blocos', 'Pelo menos um bloco de horário deve ser selecionado');
  }
  next();
});

/**
 * Índice composto único para evitar conflitos de agendamento
 * Garante que um laboratório não seja agendado duas vezes no mesmo dia e bloco
 */
aulaSchema.index(
  { laboratorioId: 1, diaSemana: 1, blocos: 1 },
  { 
    unique: true,
    name: 'unique_lab_dia_bloco',
    partialFilterExpression: {
      laboratorioId: { $exists: true },
      diaSemana: { $exists: true },
      blocos: { $exists: true, $ne: [] }
    }
  }
);

/**
 * Índice para otimizar consultas por semestre
 */
aulaSchema.index({ semestre: 1 });

/**
 * Índice para otimizar consultas por período
 */
aulaSchema.index({ dataInicio: 1, dataFim: 1 });

/**
 * Índice para otimizar consultas por curso e disciplina
 */
aulaSchema.index({ cursoId: 1, disciplinaId: 1 });

/**
 * Método estático para verificar conflitos de agendamento
 * @static
 * @async
 * @function verificarConflito
 * @param {ObjectId} laboratorioId - ID do laboratório
 * @param {string} diaSemana - Dia da semana
 * @param {ObjectId[]} blocos - Array de blocos de horário
 * @param {ObjectId} [excludeId] - ID da aula a ser excluída da verificação (para updates)
 * @returns {Promise<boolean>} True se houver conflito
 */
aulaSchema.statics.verificarConflito = async function(laboratorioId, diaSemana, blocos, excludeId = null) {
  const query = {
    laboratorioId,
    diaSemana,
    blocos: { $in: blocos }
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const conflito = await this.findOne(query);
  return !!conflito;
};

/**
 * Método estático para buscar aulas por período
 * @static
 * @async
 * @function buscarPorPeriodo
 * @param {Date} dataInicio - Data de início do período
 * @param {Date} dataFim - Data de fim do período
 * @returns {Promise<Aula[]>} Array de aulas no período
 */
aulaSchema.statics.buscarPorPeriodo = async function(dataInicio, dataFim) {
  return this.find({
    $or: [
      {
        dataInicio: { $lte: dataFim },
        dataFim: { $gte: dataInicio }
      }
    ]
  }).populate(['cursoId', 'disciplinaId', 'professorId', 'laboratorioId', 'blocos']);
};

/**
 * Método de instância para verificar se a aula está ativa
 * @instance
 * @function estaAtiva
 * @returns {boolean} True se a aula está no período ativo
 */
aulaSchema.methods.estaAtiva = function() {
  const hoje = new Date();
  return hoje >= this.dataInicio && hoje <= this.dataFim;
};

/**
 * Método de instância para obter duração em dias
 * @instance
 * @function getDuracaoEmDias
 * @returns {number} Duração da aula em dias
 */
aulaSchema.methods.getDuracaoEmDias = function() {
  const diffTime = Math.abs(this.dataFim - this.dataInicio);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

/**
 * Transformação JSON para remover campos internos
 */
aulaSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

/**
 * Modelo de Aula
 * @class Aula
 */
const Aula = mongoose.model('Aula', aulaSchema);

module.exports = Aula;