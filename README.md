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

### Professores
- `POST /api/v1/professores` - Criar professor
- `GET /api/v1/professores` - Listar professores (com filtros)
- `PUT /api/v1/professores/:id` - Atualizar professor
- `DELETE /api/v1/professores/:id` - Remover professor

### Disciplinas
- `POST /api/v1/disciplinas` - Criar disciplina
- `GET /api/v1/disciplinas` - Listar disciplinas (com filtros)
- `PUT /api/v1/disciplinas/:id` - Atualizar disciplina
- `DELETE /api/v1/disciplinas/:id` - Remover disciplina

### Laboratórios
- `POST /api/v1/laboratorios` - Criar laboratório
- `GET /api/v1/laboratorios` - Listar laboratórios (com filtros)
- `PUT /api/v1/laboratorios/:id` - Atualizar laboratório
- `DELETE /api/v1/laboratorios/:id` - Remover laboratório

### Blocos de Horários
- `POST /api/v1/blocos` - Criar bloco de horário
- `GET /api/v1/blocos` - Listar blocos (com filtros)
- `PUT /api/v1/blocos/:id` - Atualizar bloco
- `DELETE /api/v1/blocos/:id` - Remover bloco

#### Parâmetros de Consulta
- `?ativo=true|false` - Filtrar por status (instituições, cursos)
- `?nome=texto` - Filtrar por nome (contém)
- `?instituicaoId=id` - Filtrar por instituição (cursos)
- `?email=texto` - Filtrar por email (professores)
- `?cursoId=id` - Filtrar por curso (disciplinas)
- `?professorId=id` - Filtrar por professor (disciplinas)
- `?local=texto` - Filtrar por local (laboratórios)
- `?status=Ativo|Inativo` - Filtrar por status (professores, disciplinas, laboratórios)
- `?minCapacidade=numero` - Capacidade mínima (laboratórios)
- `?turno=Manhã|Tarde|Noite|Integral` - Filtrar por turno (blocos)
- `?diaSemana=Segunda|Terça|...` - Filtrar por dia da semana (blocos)
- `?ordem=numero` - Filtrar por ordem (blocos)
- `?page=1&limit=20` - Paginação

## Funcionalidades Implementadas

✅ **Estrutura de Projeto**
- Organização em pastas (backend, frontend, mobile)
- Separação de infraestrutura
- Configuração de prompts e regras Amazon Q (.amazonq/)
- Documentação técnica completa

✅ **Infraestrutura Docker**
- Serviço MongoDB 7 com autenticação
- Serviço Portainer CE para gerenciamento de containers
- Network dedicada (pm2025-2-network) para comunicação
- Volumes persistentes para dados (mongo_data, portainer_data)
- Healthcheck configurado para MongoDB
- Configuração de restart automático

✅ **Backend - API REST Node.js**
- **Framework**: Express.js com Mongoose ODM
- **Segurança**: Helmet, CORS configurável, middleware de tratamento de erros
- **Logging**: Morgan para logs de requisições
- **Documentação**: Swagger UI em /api-docs com JSDoc completo
- **Configuração**: Sistema modular de configuração com .env
- **HTTPS**: Suporte opcional a HTTPS configurável
- **Banco de Dados**: MongoDB com conexão autenticada

**Modelos de Dados:**
- **Instituições**: nome, cnpj (único), email, telefone, endereço, status ativo
- **Cursos**: nome, instituicaoId (referência), turnos (Manhã/Tarde/Noite/Integral), status ativo
- **Professores**: nome, email (único), telefone, status (Ativo/Inativo)
- **Disciplinas**: nome, cargaHoraria, cursoId (referência), professorId (referência), status (Ativo/Inativo)
- **Laboratórios**: nome, capacidade (número inteiro > 0), local (opcional), status (Ativo/Inativo)
- **Blocos de Horários**: turno, diaSemana, inicio, fim, ordem (validação temporal e duplicidade)
- **Relacionamentos**: Cursos vinculados a Instituições, Disciplinas vinculadas a Cursos e Professores
- **Validações**: Campos obrigatórios, formatos de email, limites de caracteres, carga horária positiva, horários válidos
- **Timestamps**: createdAt e updatedAt automáticos

**Endpoints da API:**
- **Instituições**: POST, GET (com filtros), PUT, DELETE em /api/v1/instituicoes
- **Cursos**: POST, GET (com filtros), PUT, DELETE em /api/v1/cursos
- **Professores**: POST, GET (com filtros), PUT, DELETE em /api/v1/professores
- **Disciplinas**: POST, GET (com filtros), PUT, DELETE em /api/v1/disciplinas
- **Laboratórios**: POST, GET (com filtros), PUT, DELETE em /api/v1/laboratorios
- **Blocos**: POST, GET (com filtros), PUT, DELETE em /api/v1/blocos
- **Filtros**: Por nome, status, email (professores), curso/professor (disciplinas), capacidade mínima (laboratórios), turno/dia (blocos)
- **Paginação**: Suporte a page e limit em todas as listagens
- **Tratamento de Erros**: Respostas padronizadas com códigos HTTP apropriados
- **Validação de Duplicidade**: Emails únicos (professores), laboratórios com mesmo nome e local, blocos com mesmo turno/dia/ordem (409 Conflict)

✅ **Frontend Web - React + Vite**
- **UI Framework**: Material-UI (MUI) v7 com tema customizado
- **Roteamento**: React Router DOM v7
- **Layout Responsivo**: Cabeçalho, menu lateral (drawer), área de trabalho, rodapé
- **Componentes**: Layout modular, Menu de navegação, CRUD completo
- **Funcionalidades**:
  - Tabela de dados com ordenação e filtros em tempo real
  - Modais para criação e edição de registros
  - Confirmações de exclusão
  - Snackbars para feedback de ações
  - Validação de formulários
  - Integração completa com API backend
  - Design responsivo para desktop e mobile

**Módulos Web Implementados:**
- **Instituições**: CRUD completo com validação de CNPJ
- **Cursos**: CRUD com vinculação a instituições
- **Professores**: CRUD com validação de email único
- **Disciplinas**: CRUD com vinculação a cursos e professores
- **Laboratórios**: CRUD com validação de capacidade e filtros avançados
- **Blocos de Horários**: CRUD com validação temporal e seleção de turnos/dias

✅ **Mobile App - React Native + Expo**
- **Framework**: React Native 0.81.5 com Expo SDK 54
- **UI Library**: React Native Paper v5 (Material Design)
- **Navegação**: React Navigation v6 com Stack Navigator
- **Funcionalidades Implementadas**:
  - CRUD completo para todos os módulos
  - Cards responsivos para listagem de dados
  - Searchbar para filtros em tempo real
  - Formulários modais com validação
  - FAB (Floating Action Button) para novos registros
  - Pull to refresh para atualização de listas
  - Confirmações nativas (Alert) para exclusões
  - Snackbar para feedback de ações
  - Switch para campos booleanos
  - KeyboardAvoidingView para adaptação de teclado
  - Integração com mesma API do backend
  - Interface em português brasileiro
  - Suporte a teclados específicos (email, telefone, numérico)

**Módulos Mobile Implementados:**
- **Instituições**: CRUD completo com validações
- **Cursos**: CRUD com seleção de instituições
- **Professores**: CRUD com validação de email
- **Disciplinas**: CRUD com vinculação a cursos e professores
- **Laboratórios**: CRUD com validação de capacidade e busca por local
- **Blocos de Horários**: CRUD com pickers de turno/dia, validação temporal e ordenação automática

✅ **Serviços e Integração**
- **API Service**: Axios configurado para comunicação HTTP
- **Base URL**: Configurável para diferentes ambientes
- **Tratamento de Erros**: Interceptação e tratamento de respostas de erro
- **Consistência**: Mesma estrutura de serviços entre web e mobile
- **Serviços Específicos**: laboratorioService e blocoService para operações especializadas
- **Endpoints Funcionais**: Todos os endpoints DELETE funcionando corretamente após correção das rotas

✅ **Qualidade e Manutenibilidade**
- **Documentação**: JSDoc completo em todo o código backend
- **Swagger**: Documentação interativa da API com exemplos
- **ESLint**: Configuração de linting para frontend
- **Estrutura Modular**: Separação clara de responsabilidades
- **Tratamento de Erros**: Middleware centralizado no backend
- **Validação**: Validações tanto no frontend quanto no backend
- **Feedback**: Mensagens de sucesso e erro em português
- **Índices de Banco**: Otimização de consultas com índices apropriados
- **Correções**: Problema dos botões de remover resolvido (rotas registradas corretamente)

✅ **Configuração e Deploy**
- **Variáveis de Ambiente**: Configuração via .env com exemplos
- **Scripts NPM**: Scripts de desenvolvimento e produção
- **Docker**: Infraestrutura containerizada pronta para produção
- **Portainer**: Interface web para gerenciamento de containers
- **Volumes**: Persistência de dados configurada
- **Tratamento de Porta**: Fallback automático para porta alternativa

✅ **Documentação Técnica**
- README.md completo com instruções de instalação e uso
- Documentos de requisitos do sistema (PDF)
- Horários dos laboratórios (PDF)
- Prompts organizados para desenvolvimento com Amazon Q
- Status do projeto documentado
- Documentação Swagger completa para todos os endpoints