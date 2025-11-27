import api from './api';

/**
 * @fileoverview Serviço para operações com blocos de horários
 * @description Gerencia todas as requisições relacionadas aos blocos de horários
 */

/**
 * Serviço de blocos de horários
 * @namespace BlocoService
 */
const blocoService = {
  /**
   * Busca todos os blocos
   * @async
   * @function getAll
   * @returns {Promise<Array>} Lista de blocos
   */
  async getAll() {
    const response = await api.get('/blocos');
    return response.data.blocos || [];
  },

  /**
   * Cria novo bloco
   * @async
   * @function create
   * @param {Object} bloco - Dados do bloco
   * @returns {Promise<Object>} Bloco criado
   */
  async create(bloco) {
    const response = await api.post('/blocos', bloco);
    return response.data;
  },

  /**
   * Atualiza bloco existente
   * @async
   * @function update
   * @param {string} id - ID do bloco
   * @param {Object} bloco - Dados atualizados
   * @returns {Promise<Object>} Bloco atualizado
   */
  async update(id, bloco) {
    const response = await api.put(`/blocos/${id}`, bloco);
    return response.data;
  },

  /**
   * Remove bloco
   * @async
   * @function delete
   * @param {string} id - ID do bloco
   * @returns {Promise<void>}
   */
  async delete(id) {
    await api.delete(`/blocos/${id}`);
  }
};

export default blocoService;