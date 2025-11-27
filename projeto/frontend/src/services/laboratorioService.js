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
   * Busca todos os laboratórios com filtros opcionais
   * @async
   * @function getAll
   * @param {Object} params - Parâmetros de consulta
   * @param {string} [params.nome] - Filtro por nome
   * @param {string} [params.local] - Filtro por local
   * @param {string} [params.status] - Filtro por status
   * @param {number} [params.minCapacidade] - Capacidade mínima
   * @param {number} [params.page=1] - Página
   * @param {number} [params.limit=20] - Itens por página
   * @returns {Promise<Object>} Resposta com laboratórios e paginação
   */
  async getAll(params = {}) {
    const response = await api.get('/laboratorios', { params });
    return response.data;
  },

  /**
   * Busca laboratório por ID
   * @async
   * @function getById
   * @param {string} id - ID do laboratório
   * @returns {Promise<Object>} Dados do laboratório
   */
  async getById(id) {
    const response = await api.get(`/laboratorios/${id}`);
    return response.data;
  },

  /**
   * Cria novo laboratório
   * @async
   * @function create
   * @param {Object} laboratorio - Dados do laboratório
   * @param {string} laboratorio.nome - Nome do laboratório
   * @param {number} laboratorio.capacidade - Capacidade do laboratório
   * @param {string} [laboratorio.local] - Local do laboratório
   * @param {string} [laboratorio.status] - Status do laboratório
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