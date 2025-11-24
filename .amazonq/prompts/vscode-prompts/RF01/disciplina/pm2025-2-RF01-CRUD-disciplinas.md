@projeto @backend

Contexto: Backend Node.js com Express e Mongoose.
Resposta: pt-br

1. Implementar o CRUD para a entidade 'Disciplinas'

    a) Criar rota e controllers para o endpoint: /api/v1/disciplinas

        a.1) POST /api/v1/disciplinas
        Cria uma nova disciplina.
        Body (JSON): { cursoId, nome, cargaHoraria, professorId?, status? }
        Lógica de Negócio:
          - Validar se o 'cursoId' é um ObjectId válido e se o **Curso existe** no banco de dados (retornar 404 se não existir).
          - Se fornecido, validar se 'professorId' é um ObjectId válido e se o **Professor existe**.
          - 'cargaHoraria' deve ser um número positivo.
          - 'status' deve ter default 'Ativo'.
        Retorna 201 + objeto criado.
        
        a.2) GET /api/v1/disciplinas
        Lista todos em JSON array com paginação.
        Suportar query params:
          - ?cursoId=... (Filtrar disciplinas de um Curso específico)
          - ?professorId=... (Filtrar disciplinas por Professor)
          - ?nome=... (Filtro contém/like, case-insensitive)
          - ?status=... (Ativo/Inativo)
          - ?page=1&limit=20
        
        a.3) PUT /api/v1/disciplinas/:id
        Atualiza por id (ObjectId).
        Body parcial permitido.
        Lógica de Negócio:
          - Se o 'cursoId' ou 'professorId' for alterado, validar novamente a **existência** dessas entidades no banco.
        Retorna 200 + objeto atualizado, 404 se não encontrado.

        a.4) DELETE /api/v1/disciplinas/:id
        Remove logicamente ou fisicamente (conforme padrão do projeto) por id.
        Retorna 204 sem corpo, 404 se não encontrado.

        a.5) Convenções de resposta de erro
        Manter o padrão: JSON { message: string, details?: any }
        400 validação (ex: carga horária inválida), 404 não encontrado (IDs de relacionamento ou disciplina), 500 erro interno.

2. Definir suporte ao Swagger
   - Atualizar o arquivo de configuração do Swagger para incluir as novas rotas de disciplinas.

3. Criar a documentação Swagger e JSDoc
   - Adicionar definições de schemas para Disciplinas.
   - Documentar todos os parâmetros e respostas possíveis.

4. Critérios de aceite
   - GET /api/v1/disciplinas retorna array paginado.
   - POST com 'cursoId' inexistente retorna erro 404 (Não Encontrado) com mensagem clara em pt-BR.
   - Filtros por `cursoId` e `professorId` no GET funcionam corretamente.
   - Swagger UI acessível e testável.
   - Código com JSDoc completo e em pt-BR.