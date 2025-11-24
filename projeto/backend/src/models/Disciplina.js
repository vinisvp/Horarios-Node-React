const mongoose = require('mongoose');

/**
 * Schema para o modelo de Disciplinas
 * @typedef {Object} Disciplina
 * @property {mongoose.Types.ObjectId} cursoId - ID do curso (referência obrigatória)
 * @property {string} nome - Nome da disciplina
 * @property {number} cargaHoraria - Carga horária da disciplina em horas
 * @property {mongoose.Types.ObjectId} [professorId] - ID do professor responsável (opcional)
 * @property {string} [status] - Status da disciplina (Ativo/Inativo)
 * @property {Date} createdAt - Data de criação
 * @property {Date} updatedAt - Data de atualização
 */

/**
 * Schema do Mongoose para Disciplinas
 */
const disciplinaSchema = new mongoose.Schema({
  cursoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curso',
    required: [true, 'Curso é obrigatório'],
    index: true
  },
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  cargaHoraria: {
    type: Number,
    required: [true, 'Carga horária é obrigatória'],
    min: [1, 'Carga horária deve ser um número positivo'],
    validate: {
      validator: function(value) {
        return value > 0 && Number.isInteger(value);
      },
      message: 'Carga horária deve ser um número inteiro positivo'
    }
  },
  professorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor',
    default: null,
    index: true
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
  collection: 'disciplinas'
});

/**
 * Índices para otimização de consultas
 */
disciplinaSchema.index({ cursoId: 1, nome: 1 });
disciplinaSchema.index({ professorId: 1 });
disciplinaSchema.index({ status: 1 });
disciplinaSchema.index({ nome: 1 });

/**
 * Middleware para popular referências automaticamente
 */
disciplinaSchema.pre(/^find/, function(next) {
  this.populate('cursoId', 'nome instituicaoId')
      .populate('professorId', 'nome email');
  next();
});

/**
 * Método estático para buscar disciplinas por curso
 * @param {string} cursoId - ID do curso
 * @returns {Promise<Array>} Lista de disciplinas do curso
 */
disciplinaSchema.statics.findByCurso = function(cursoId) {
  return this.find({ cursoId });
};

/**
 * Método estático para buscar disciplinas por professor
 * @param {string} professorId - ID do professor
 * @returns {Promise<Array>} Lista de disciplinas do professor
 */
disciplinaSchema.statics.findByProfessor = function(professorId) {
  return this.find({ professorId });
};

/**
 * Método de instância para calcular carga horária total por curso
 * @returns {Promise<number>} Carga horária total
 */
disciplinaSchema.methods.getCargaHorariaTotalCurso = async function() {
  const disciplinas = await this.constructor.find({ cursoId: this.cursoId });
  return disciplinas.reduce((total, disciplina) => total + disciplina.cargaHoraria, 0);
};

/**
 * Modelo Mongoose para Disciplinas
 * @class Disciplina
 */
const Disciplina = mongoose.model('Disciplina', disciplinaSchema);

module.exports = Disciplina;