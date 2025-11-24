/**
 * Exporta todos os modelos do sistema
 * @module Models
 */

const Instituicao = require('./Instituicao');
const Curso = require('./Curso');
const Professor = require('./Professor');
const Disciplina = require('./Disciplina');

module.exports = {
  Instituicao,
  Curso,
  Professor,
  Disciplina
};