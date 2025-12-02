require("dotenv").config();

/**
 * Carregador de configurações do ambiente
 * @module ConfigurationLoader
 */

const config = {
  mongo: {
    host: process.env.MONGO_INITDB_HOST || "localhost",
    port: process.env.MONGO_INITDB_PORT || "27017",
    username: process.env.MONGO_INITDB_ROOT_USERNAME || "admin",
    password: process.env.MONGO_INITDB_ROOT_PASSWORD || "password",
    database: process.env.MONGO_INITDB_DATABASE || "test",
    URI: process.env.MONGODB_URI,
  },
  https: {
    enabled: process.env.HTTPS_ENABLED === "true",
    keyPath: process.env.SSL_KEY_PATH || "./certs/key.pem",
    certPath: process.env.SSL_CERT_PATH || "./certs/cert.pem",
  },
  app: {
    port: process.env.PORT || 3000,
    corsOrigin: process.env.CORS_ORIGIN || "*",
    nodeEnv: process.env.NODE_ENV || "development",
  },
};

module.exports = config;
