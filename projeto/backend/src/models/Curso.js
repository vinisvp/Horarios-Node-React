const mongoose = require('mongoose');

/**
 * Schema para o modelo de Cursos
 * @typedef {Object} Curso
 * @property {mongoose.Types.ObjectId} instituicaoId - ID da instituição à qual o curso pertence
 * @property {string} nome - Nome do curso
 * @property {string[]} turnos - Array de turnos disponíveis para o curso
 * @property {boolean} ativo - Status ativo/inativo do curso
 * @property {Date} createdAt - Data de criação
 * @property {Date} updatedAt - Data de atualização
 */

/**
 * Schema do Mongoose para Cursos
 */
const cursoSchema = new mongoose.Schema({
  instituicaoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instituicao',
    required: [true, 'ID da instituição é obrigatório']
  },
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  turnos: {
    type: [String],
    enum: {
      values: ['Manhã', 'Tarde', 'Noite', 'Integral'],
      message: 'Turno deve ser: Manhã, Tarde, Noite ou Integral'
    },
    default: []
  },
  ativo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'cursos'
});

/**
 * Índices para otimização de consultas
 */
cursoSchema.index({ instituicaoId: 1 });
cursoSchema.index({ nome: 1 });
cursoSchema.index({ ativo: 1 });

/**
 * Modelo Mongoose para Cursos
 * @class Curso
 */
const Curso = mongoose.model('Curso', cursoSchema);

module.exports = Curso;