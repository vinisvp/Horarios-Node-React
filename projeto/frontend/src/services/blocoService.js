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
   * Busca todos os blocos com filtros opcionais
   * @async
   * @function getAll
   * @param {Object} params - Parâmetros de consulta
   * @param {string} [params.turno] - Filtro por turno
   * @param {string} [params.diaSemana] - Filtro por dia da semana
   * @param {number} [params.ordem] - Filtro por ordem
   * @param {number} [params.page=1] - Página
   * @param {number} [params.limit=20] - Itens por página
   * @returns {Promise<Object>} Resposta com blocos e paginação
   */
  async getAll(params = {}) {
    const response = await api.get('/blocos', { params });
    return response.data;
  },

  /**
   * Busca bloco por ID
   * @async
   * @function getById
   * @param {string} id - ID do bloco
   * @returns {Promise<Object>} Dados do bloco
   */
  async getById(id) {
    const response = await api.get(`/blocos/${id}`);
    return response.data;
  },

  /**
   * Cria novo bloco
   * @async
   * @function create
   * @param {Object} bloco - Dados do bloco
   * @param {string} bloco.turno - Turno do bloco
   * @param {string} bloco.diaSemana - Dia da semana
   * @param {string} bloco.inicio - Horário de início (HH:mm)
   * @param {string} bloco.fim - Horário de fim (HH:mm)
   * @param {number} bloco.ordem - Ordem do bloco
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