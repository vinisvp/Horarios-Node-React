const mongoose = require('mongoose');

/**
 * Schema para o modelo de Professores
 * @typedef {Object} Professor
 * @property {string} nome - Nome do professor
 * @property {string} email - Email do professor (único)
 * @property {string} [telefone] - Telefone do professor
 * @property {string} [status] - Status do professor (Ativo/Inativo)
 * @property {Date} createdAt - Data de criação
 * @property {Date} updatedAt - Data de atualização
 */

/**
 * Schema do Mongoose para Professores
 */
const professorSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email deve ter um formato válido']
  },
  telefone: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: {
      values: ['Ativo', 'Inativo'],
      message: 'Status deve ser: Ativo ou Inativo'
    },
    default: 'Ativo'
  }
}, {
  timestamps: true,
  collection: 'professores'
});

/**
 * Índices para otimização de consultas
 */
professorSchema.index({ email: 1 });
professorSchema.index({ nome: 1 });
professorSchema.index({ status: 1 });

/**
 * Modelo Mongoose para Professores
 * @class Professor
 */
const Professor = mongoose.model('Professor', professorSchema);

module.exports = Professor;