/**
 * Exporta todos os modelos do sistema
 * @module Models
 */

const Instituicao = require('./Instituicao');
const Curso = require('./Curso');
const Professor = require('./Professor');
const Disciplina = require('./Disciplina');
const Laboratorio = require('./Laboratorio');
const Bloco = require('./Bloco');
const Aula = require('./Aula');

module.exports = {
  Instituicao,
  Curso,
  Professor,
  Disciplina,
  Laboratorio,
  Bloco,
  Aula
};