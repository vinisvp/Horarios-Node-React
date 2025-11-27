@projeto @backend

Contexto: Backend Node.js com Express e Mongoose.
Resposta: pt-br

1. Implementar o CRUD para a entidade 'Laboratórios'

    a) Criar rota e controllers para o endpoint: /api/v1/laboratorios

        a.1) POST /api/v1/laboratorios
        Cria um novo laboratório.
        Body (JSON): { nome, capacidade, local?, status? }
        Lógica de Negócio:
          - 'capacidade' deve ser um número inteiro maior que 0.
          - 'status' deve ter default 'Ativo'.
          - Validar se já existe um laboratório com o mesmo 'nome' no mesmo 'local' (evitar duplicidade física), retornando 409 se existir.
        Retorna 201 + objeto criado.
        
        a.2) GET /api/v1/laboratorios
        Lista todos em JSON array com paginação.
        Suportar query params:
          - ?local=... (Filtro exato ou parcial para o local/bloco)
          - ?nome=... (Filtro contém/like, case-insensitive)
          - ?status=... (Ativo/Inativo)
          - ?minCapacidade=... (Filtra laboratórios que comportem pelo menos X alunos)
          - ?page=1&limit=20
        
        a.3) PUT /api/v1/laboratorios/:id
        Atualiza por id (ObjectId).
        Body parcial permitido.
        Lógica de Negócio:
          - Se 'capacidade' for alterada, validar se é > 0.
        Retorna 200 + objeto atualizado, 404 se não encontrado.

        a.4) DELETE /api/v1/laboratorios/:id
        Remove logicamente ou fisicamente (conforme padrão do projeto) por id.
        Retorna 204 sem corpo, 404 se não encontrado.

        a.5) Convenções de resposta de erro
        Manter o padrão: JSON { message: string, details?: any }
        400 validação (ex: capacidade inválida), 404 não encontrado, 409 conflito (nome duplicado no local), 500 erro interno.

2. Definir suporte ao Swagger
   - Atualizar o arquivo de configuração do Swagger para incluir as novas rotas de laboratórios.

3. Criar a documentação Swagger e JSDoc
   - Adicionar definições de schemas para Laboratórios.
   - Documentar todos os parâmetros e respostas possíveis.

4. Critérios de aceite
   - GET /api/v1/laboratorios retorna array paginado.
   - POST com capacidade negativa ou zero retorna erro 400 (Bad Request).
   - Filtro `?minCapacidade` funciona corretamente (ex: buscar lab para 30 alunos).
   - Swagger UI acessível e testável.
   - Código com JSDoc completo e em pt-BR.