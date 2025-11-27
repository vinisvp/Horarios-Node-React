const mongoose = require('mongoose');

/**
 * @fileoverview Modelo Mongoose para Laboratórios
 * @description Define o schema e modelo para a coleção de laboratórios no MongoDB
 */

/**
 * Schema do Mongoose para Laboratórios
 * @typedef {Object} LaboratorioSchema
 * @property {string} nome - Nome do laboratório (obrigatório)
 * @property {number} capacidade - Capacidade máxima do laboratório (obrigatório, mínimo 1)
 * @property {string} local - Localização do laboratório (opcional)
 * @property {string} status - Status do laboratório (Ativo/Inativo, padrão: Ativo)
 * @property {Date} createdAt - Data de criação (automático)
 * @property {Date} updatedAt - Data da última atualização (automático)
 */
const laboratorioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome do laboratório é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  capacidade: {
    type: Number,
    required: [true, 'Capacidade do laboratório é obrigatória'],
    min: [1, 'Capacidade deve ser no mínimo 1'],
    validate: {
      validator: Number.isInteger,
      message: 'Capacidade deve ser um número inteiro'
    }
  },
  local: {
    type: String,
    trim: true,
    maxlength: [200, 'Local deve ter no máximo 200 caracteres']
  },
  status: {
    type: String,
    enum: {
      values: ['Ativo', 'Inativo'],
      message: 'Status deve ser Ativo ou Inativo'
    },
    default: 'Ativo'
  }
}, {
  timestamps: true,
  collection: 'laboratorios'
});

/**
 * Índices para otimização de consultas
 */
laboratorioSchema.index({ nome: 1 });
laboratorioSchema.index({ status: 1 });
laboratorioSchema.index({ capacidade: 1 });

/**
 * Método estático para buscar laboratórios ativos
 * @returns {Promise<Array>} Lista de laboratórios ativos
 */
laboratorioSchema.statics.findAtivos = function() {
  return this.find({ status: 'Ativo' });
};

/**
 * Método de instância para verificar se o laboratório está ativo
 * @returns {boolean} True se o laboratório estiver ativo
 */
laboratorioSchema.methods.isAtivo = function() {
  return this.status === 'Ativo';
};

/**
 * Modelo Mongoose para Laboratórios
 * @class Laboratorio
 * @description Modelo que representa um laboratório no sistema
 */
const Laboratorio = mongoose.model('Laboratorio', laboratorioSchema);

module.exports = Laboratorio;