const mongoose = require("mongoose");
const config = require("./configurationLoader");

/**
 * Configuração e conexão com MongoDB
 * @module Database
 */

/**
 * Conecta ao MongoDB usando as configurações do .env
 * @returns {Promise<void>}
 */
const connectDatabase = async () => {
  try {
    const { host, port, username, password, database, URI } = config.mongo;
    const connectionString =
      URI ||
      `mongodb://${username}:${password}@${host}:${port}/${database}?authSource=admin`;

    await mongoose.connect(connectionString);
    console.log("Conectado ao MongoDB com sucesso:", connectionString);
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = { connectDatabase };
