@projeto @backend

respostas: pt-br

Contexto: Backend Node.js com Express e Mongoose.
Resposta: pt-br

1. Implementar o CRUD para a entidade 'Cursos'

    a) Criar rota e controllers para o endpoint: /api/v1/cursos

        a.1) POST /api/v1/cursos
        Cria um novo curso.
        Body (JSON): { instituicaoId, nome, turnos, status? }
        Lógica de Negócio:
          - Validar se 'instituicaoId' é um ObjectId válido e se a instituição existe no banco (retornar 404 ou 400 se não existir).
          - 'status' deve ter default 'Ativo'.
        Retorna 201 + objeto criado.
        
        a.2) GET /api/v1/cursos
        Lista todos em JSON array com paginação.
        Suportar query params:
          - ?instituicaoId=... (Filtrar cursos de uma instituição específica)
          - ?nome=... (Filtro contém/like, case-insensitive)
          - ?status=... (Ativo/Inativo)
          - ?page=1&limit=20
        
        a.3) PUT /api/v1/cursos/:id
        Atualiza por id (ObjectId).
        Body parcial permitido (ex: atualizar apenas 'turnos' ou 'status').
        Retorna 200 + objeto atualizado, 404 se não encontrado.

        a.4) DELETE /api/v1/cursos/:id
        Remove logicamente ou fisicamente (conforme padrão do projeto) por id.
        Retorna 204 sem corpo, 404 se não encontrado.

        a.5) Convenções de resposta de erro
        Manter o padrão: JSON { message: string, details?: any }
        400 validação (ex: ID de instituição inválido), 404 não encontrado, 500 erro interno.

2. Definir suporte ao Swagger
   - Atualizar o arquivo de configuração do Swagger para incluir as novas rotas.

3. Criar a documentação Swagger e JSDoc
   - Adicionar definições de schemas para Cursos.
   - Documentar todos os parâmetros e respostas possíveis.

4. Critérios de aceite
   - GET /api/v1/cursos retorna array paginado.
   - POST com 'instituicaoId' inexistente retorna erro adequado (400 ou 404).
   - Filtro ?instituicaoId no GET funciona corretamente trazendo apenas cursos daquela instituição.
   - Swagger UI acessível e testável.
   - Código com JSDoc completo e em pt-BR.