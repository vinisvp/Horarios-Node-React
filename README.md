# PM2025-2 Trabalho Final

## Descrição
Sistema de gerenciamento de laboratórios desenvolvido como trabalho final da disciplina PM2025-2.

## Estrutura do Projeto

### Pastas Criadas
- `projeto/` - Pasta principal do projeto
- `projeto/backend/` - Código do backend
- `projeto/frontend/` - Código do frontend web
- `projeto/mobile/` - Código da aplicação mobile
- `infraestrutura/` - Arquivos de infraestrutura e deploy

### Documentação
- `Documents/Horarios_Laboratórios.pdf` - Horários dos laboratórios
- `Documents/Requisitos_Sistema_Labs.pdf` - Requisitos do sistema

## Infraestrutura

### Serviços Docker
Configurados no arquivo `infraestrutura/docker-compose.yml`:

#### MongoDB
- **Serviço**: `pm2025-2-trabalho-final-mongo`
- **Usuário**: `pm2025-2-mongo-admin`
- **Senha**: `pm2025-2-mongo-secret`
- **Banco**: `pm2025-2-mongodb`
- **Porta**: `27017`

#### Portainer
- **Serviço**: `pm2025-2-trabalho-final-portainer`
- **Porta**: `9000`
- **Função**: Gerenciamento de containers Docker

#### Network
- **Nome**: `pm2025-2-network`
- **Driver**: bridge
- **Função**: Comunicação entre containers

## Como Executar

### Iniciar Infraestrutura
```bash
cd infraestrutura
docker-compose up -d
```

### Executar Backend
```bash
cd projeto/backend
npm install
npm run dev
```

### Executar Frontend
```bash
cd projeto/frontend
npm install
npm run dev
```

### Executar Mobile
```bash
cd projeto/mobile
npm install
npm start
```

### Acessar Serviços
- **Frontend Web**: `http://localhost:5173`
- **Mobile App**: Expo Development Server
- **API Backend**: `http://localhost:3000`
- **Documentação API**: `http://localhost:3000/api-docs`
- **MongoDB**: `localhost:27017`
- **Portainer**: `http://localhost:9000`

## Endpoints da API

### Instituições
- `POST /api/v1/instituicoes` - Criar instituição
- `GET /api/v1/instituicoes` - Listar instituições (com filtros)
- `PUT /api/v1/instituicoes/:id` - Atualizar instituição
- `DELETE /api/v1/instituicoes/:id` - Remover instituição

### Cursos
- `POST /api/v1/cursos` - Criar curso
- `GET /api/v1/cursos` - Listar cursos (com filtros)
- `PUT /api/v1/cursos/:id` - Atualizar curso
- `DELETE /api/v1/cursos/:id` - Remover curso

#### Parâmetros de Consulta
- `?ativo=true|false` - Filtrar por status
- `?nome=texto` - Filtrar por nome (contém)
- `?instituicaoId=id` - Filtrar por instituição
- `?page=1&limit=20` - Paginação

## Funcionalidades Implementadas

✅ **Estrutura de Projeto**
- Organização em pastas (backend, frontend, mobile)
- Separação de infraestrutura

✅ **Infraestrutura Docker**
- Serviço MongoDB configurado
- Serviço Portainer para gerenciamento
- Network dedicada para comunicação
- Volumes persistentes para dados

✅ **Backend - API REST**
- Projeto Node.js com Express e Mongoose
- Modelo de dados para Instituições e Cursos
- CRUD completo para instituições (/api/v1/instituicoes)
- CRUD completo para cursos (/api/v1/cursos)
- Relacionamento entre Cursos e Instituições
- Validação de dados e tratamento de erros
- Suporte a HTTPS configurável
- Documentação Swagger em /api-docs
- Middleware de segurança (Helmet, CORS)
- Logging com Morgan
- Paginação e filtros nas consultas

✅ **Frontend Web - React**
- Projeto React com Vite e Material-UI
- Layout responsivo com cabeçalho, área de trabalho e rodapé
- Menu lateral (drawer) com navegação
- Componente de Instituições com CRUD completo
- Grid de dados com ordenação e filtros
- Modais para edição e criação
- Integração com API do backend
- Design responsivo para mobile e desktop

✅ **Mobile App - React Native**
- Projeto React Native com Expo
- Interface Material Design com React Native Paper
- CRUD completo de Instituições idêntico ao web
- Cards responsivos para listagem
- Formulários modais para criação/edição
- Filtros em tempo real
- Navegação com React Navigation
- Integração com mesma API do backend
- Mensagens de feedback em português
- Confirmações nativas para exclusões

✅ **Documentação**
- README.md atualizado
- Documentos de requisitos e horários
- JSDoc em todo o código
- Documentação Swagger da API