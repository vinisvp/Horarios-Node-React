import api from './api';

/**
 * @fileoverview Serviço para operações com laboratórios
 * @description Gerencia todas as requisições relacionadas aos laboratórios
 */

/**
 * Serviço de laboratórios
 * @namespace LaboratorioService
 */
const laboratorioService = {
  /**
   * Busca todos os laboratórios
   * @async
   * @function getAll
   * @returns {Promise<Array>} Lista de laboratórios
   */
  async getAll() {
    const response = await api.get('/laboratorios');
    return response.data.laboratorios || [];
  },

  /**
   * Cria novo laboratório
   * @async
   * @function create
   * @param {Object} laboratorio - Dados do laboratório
   * @returns {Promise<Object>} Laboratório criado
   */
  async create(laboratorio) {
    const response = await api.post('/laboratorios', laboratorio);
    return response.data;
  },

  /**
   * Atualiza laboratório existente
   * @async
   * @function update
   * @param {string} id - ID do laboratório
   * @param {Object} laboratorio - Dados atualizados
   * @returns {Promise<Object>} Laboratório atualizado
   */
  async update(id, laboratorio) {
    const response = await api.put(`/laboratorios/${id}`, laboratorio);
    return response.data;
  },

  /**
   * Remove laboratório
   * @async
   * @function delete
   * @param {string} id - ID do laboratório
   * @returns {Promise<void>}
   */
  async delete(id) {
    await api.delete(`/laboratorios/${id}`);
  }
};

export default laboratorioService;