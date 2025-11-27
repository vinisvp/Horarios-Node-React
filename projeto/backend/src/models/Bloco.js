const mongoose = require('mongoose');

/**
 * @fileoverview Modelo Mongoose para Blocos de Horários
 * @description Define o schema e modelo para a coleção de blocos de horários no MongoDB
 */

/**
 * Schema do Mongoose para Blocos de Horários
 * @typedef {Object} BlocoSchema
 * @property {string} turno - Turno do bloco (Manhã/Tarde/Noite/Integral)
 * @property {string} diaSemana - Dia da semana do bloco
 * @property {string} inicio - Horário de início (formato HH:mm)
 * @property {string} fim - Horário de fim (formato HH:mm)
 * @property {number} ordem - Ordem do bloco no turno/dia
 * @property {Date} createdAt - Data de criação (automático)
 * @property {Date} updatedAt - Data da última atualização (automático)
 */
const blocoSchema = new mongoose.Schema({
  turno: {
    type: String,
    required: [true, 'Turno é obrigatório'],
    enum: {
      values: ['Manhã', 'Tarde', 'Noite', 'Integral'],
      message: 'Turno deve ser: Manhã, Tarde, Noite ou Integral'
    }
  },
  diaSemana: {
    type: String,
    required: [true, 'Dia da semana é obrigatório'],
    enum: {
      values: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
      message: 'Dia da semana deve ser: Segunda, Terça, Quarta, Quinta, Sexta, Sábado ou Domingo'
    }
  },
  inicio: {
    type: String,
    required: [true, 'Horário de início é obrigatório'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário de início deve estar no formato HH:mm']
  },
  fim: {
    type: String,
    required: [true, 'Horário de fim é obrigatório'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário de fim deve estar no formato HH:mm']
  },
  ordem: {
    type: Number,
    required: [true, 'Ordem é obrigatória'],
    min: [1, 'Ordem deve ser um número positivo'],
    validate: {
      validator: Number.isInteger,
      message: 'Ordem deve ser um número inteiro'
    }
  }
}, {
  timestamps: true,
  collection: 'blocos'
});

/**
 * Índice composto único para garantir unicidade de turno, dia da semana e ordem
 */
blocoSchema.index({ turno: 1, diaSemana: 1, ordem: 1 }, { unique: true });

/**
 * Índices para otimização de consultas
 */
blocoSchema.index({ turno: 1 });
blocoSchema.index({ diaSemana: 1 });

/**
 * Validação customizada para garantir que início seja anterior ao fim
 */
blocoSchema.pre('validate', function(next) {
  if (this.inicio && this.fim) {
    const [inicioHora, inicioMinuto] = this.inicio.split(':').map(Number);
    const [fimHora, fimMinuto] = this.fim.split(':').map(Number);
    
    const inicioMinutos = inicioHora * 60 + inicioMinuto;
    const fimMinutos = fimHora * 60 + fimMinuto;
    
    if (inicioMinutos >= fimMinutos) {
      return next(new Error('Horário de início deve ser anterior ao horário de fim'));
    }
  }
  next();
});

/**
 * Método estático para buscar blocos por turno
 * @param {string} turno - Turno desejado
 * @returns {Promise<Array>} Lista de blocos do turno
 */
blocoSchema.statics.findByTurno = function(turno) {
  return this.find({ turno }).sort({ diaSemana: 1, ordem: 1 });
};

/**
 * Método estático para buscar blocos por dia da semana
 * @param {string} diaSemana - Dia da semana desejado
 * @returns {Promise<Array>} Lista de blocos do dia
 */
blocoSchema.statics.findByDiaSemana = function(diaSemana) {
  return this.find({ diaSemana }).sort({ turno: 1, ordem: 1 });
};

/**
 * Método estático para buscar blocos por turno e dia
 * @param {string} turno - Turno desejado
 * @param {string} diaSemana - Dia da semana desejado
 * @returns {Promise<Array>} Lista de blocos ordenados
 */
blocoSchema.statics.findByTurnoEDia = function(turno, diaSemana) {
  return this.find({ turno, diaSemana }).sort({ ordem: 1 });
};

/**
 * Método de instância para calcular duração do bloco em minutos
 * @returns {number} Duração em minutos
 */
blocoSchema.methods.getDuracaoMinutos = function() {
  const [inicioHora, inicioMinuto] = this.inicio.split(':').map(Number);
  const [fimHora, fimMinuto] = this.fim.split(':').map(Number);
  
  const inicioMinutos = inicioHora * 60 + inicioMinuto;
  const fimMinutos = fimHora * 60 + fimMinuto;
  
  return fimMinutos - inicioMinutos;
};

/**
 * Método de instância para verificar se há conflito de horário com outro bloco
 * @param {Object} outroBloco - Outro bloco para comparação
 * @returns {boolean} True se há conflito
 */
blocoSchema.methods.temConflito = function(outroBloco) {
  if (this.turno !== outroBloco.turno || this.diaSemana !== outroBloco.diaSemana) {
    return false;
  }
  
  const [inicioHora1, inicioMinuto1] = this.inicio.split(':').map(Number);
  const [fimHora1, fimMinuto1] = this.fim.split(':').map(Number);
  const [inicioHora2, inicioMinuto2] = outroBloco.inicio.split(':').map(Number);
  const [fimHora2, fimMinuto2] = outroBloco.fim.split(':').map(Number);
  
  const inicio1 = inicioHora1 * 60 + inicioMinuto1;
  const fim1 = fimHora1 * 60 + fimMinuto1;
  const inicio2 = inicioHora2 * 60 + inicioMinuto2;
  const fim2 = fimHora2 * 60 + fimMinuto2;
  
  return !(fim1 <= inicio2 || fim2 <= inicio1);
};

/**
 * Modelo Mongoose para Blocos de Horários
 * @class Bloco
 * @description Modelo que representa um bloco de horário no sistema
 */
const Bloco = mongoose.model('Bloco', blocoSchema);

module.exports = Bloco;