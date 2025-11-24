@projeto @backend

respostas: pt-br

Contexto: Backend Node.js com Express e Mongoose.
Resposta: pt-br

1. Implementar o CRUD para a entidade 'Professores'

    a) Criar rota e controllers para o endpoint: /api/v1/professores

        a.1) POST /api/v1/professores
        Cria um novo professor.
        Body (JSON): { nome, email, telefone?, status? }
        Lógica de Negócio:
          - Validar se o 'email' já existe no banco de dados (verificar duplicidade). Se existir, retornar 409 (Conflict).
          - 'status' deve ter default 'Ativo'.
          - Validar formato básico de email.
        Retorna 201 + objeto criado.
        
        a.2) GET /api/v1/professores
        Lista todos em JSON array com paginação.
        Suportar query params:
          - ?nome=... (Filtro contém/like, case-insensitive)
          - ?email=... (Busca exata ou parcial)
          - ?status=... (Ativo/Inativo)
          - ?page=1&limit=20
        
        a.3) PUT /api/v1/professores/:id
        Atualiza por id (ObjectId).
        Body parcial permitido (ex: atualizar apenas 'telefone' ou 'status').
        Lógica de Negócio:
          - Se o body contiver 'email', verificar se o novo email já não pertence a outro professor (exceto o próprio).
        Retorna 200 + objeto atualizado, 404 se não encontrado.

        a.4) DELETE /api/v1/professores/:id
        Remove logicamente ou fisicamente (conforme padrão do projeto) por id.
        Retorna 204 sem corpo, 404 se não encontrado.

        a.5) Convenções de resposta de erro
        Manter o padrão: JSON { message: string, details?: any }
        400 validação, 404 não encontrado, 409 conflito (email duplicado), 500 erro interno.

2. Definir suporte ao Swagger
   - Atualizar o arquivo de configuração do Swagger para incluir as novas rotas de professores.

3. Criar a documentação Swagger e JSDoc
   - Adicionar definições de schemas para Professores.
   - Documentar todos os parâmetros e respostas possíveis.

4. Critérios de aceite
   - GET /api/v1/professores retorna array paginado.
   - POST com email já cadastrado retorna erro 409 com mensagem clara em pt-BR.
   - Filtros de busca (nome e status) funcionam corretamente.
   - Swagger UI acessível e testável.
   - Código com JSDoc completo e em pt-BR.