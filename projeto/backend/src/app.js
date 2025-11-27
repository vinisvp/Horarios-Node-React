const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

/**
 * Aplicação Express principal
 */
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://pm2025-2-mongo-admin:pm2025-2-mongo-secret@localhost:27017/pm2025-2-mongodb';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'Backend PM2025-2 funcionando!' });
});

// Importar e configurar rotas
console.log('Carregando rotas...');
const instituicaoRoutes = require('./routes/instituicoes');
const cursoRoutes = require('./routes/cursos');
const professorRoutes = require('./routes/professores');
const disciplinaRoutes = require('./routes/disciplinas');
const laboratorioRoutes = require('./routes/laboratorioRoutes');
const blocoRoutes = require('./routes/blocoRoutes');
console.log('Rotas carregadas com sucesso');

// Rotas da API
app.use('/api/v1/instituicoes', instituicaoRoutes);
app.use('/api/v1/cursos', cursoRoutes);
app.use('/api/v1/professores', professorRoutes);
app.use('/api/v1/disciplinas', disciplinaRoutes);
app.use('/api/v1/laboratorios', laboratorioRoutes);
app.use('/api/v1/blocos', blocoRoutes);
console.log('Rotas registradas: /api/v1/instituicoes, /api/v1/cursos, /api/v1/professores, /api/v1/disciplinas, /api/v1/laboratorios, /api/v1/blocos');

// Configurar Swagger
const { setupSwagger } = require('./config/swagger');
setupSwagger(app);

// Middleware de tratamento de erros 404
app.use('*', (req, res) => {
  res.status(404).json({
    message: `Rota ${req.originalUrl} não encontrada`
  });
});

// Middleware de tratamento de erros gerais
app.use((error, req, res, next) => {
  console.error('Erro:', error);
  res.status(500).json({
    message: 'Erro interno do servidor',
    details: error.message
  });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Porta ${PORT} em uso, tentando porta ${PORT + 1}...`);
    app.listen(PORT + 1, () => {
      console.log(`Servidor rodando na porta ${PORT + 1}`);
      console.log(`Swagger UI: http://localhost:${PORT + 1}/api-docs`);
    });
  } else {
    console.error('Erro ao iniciar servidor:', err);
  }
});

module.exports = app;