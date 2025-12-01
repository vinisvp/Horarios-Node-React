@projeto @backend

Contexto: Backend Node.js com Express e Mongoose.
Resposta: pt-br

1. Implementar o CRUD para a entidade 'Aulas'

    a) Criar rota e controllers para o endpoint: /api/v1/aulas

        a.1) POST /api/v1/aulas
        Cria um novo agendamento de aula.
        Body (JSON): { semestre, cursoId, disciplinaId, professorId, laboratorioId, diaSemana, blocos, dataInicio, dataFim }
        Lógica de Negócio (Validações de Integridade e Conflito):
          - Validar se todos os ObjectIds (cursoId, disciplinaId, professorId, laboratorioId) e o Array de ObjectIds (blocos) são válidos e **existem no banco de dados**. Retornar 404 para qualquer ID não encontrado.
          - Validar se 'dataInicio' é anterior ou igual a 'dataFim'. Retornar 400.
          - Validar se o array 'blocos' não está vazio. Retornar 400.
          
          - **Validação Crítica de Conflito (Duplo Agendamento):**
            - **Conflito de Laboratório (Obrigatório):** Verificar se o `laboratorioId` já está agendado para o mesmo `diaSemana` e nos mesmos `blocos`. Se houver sobreposição, retornar **409 (Conflict)** com mensagem clara.
            - **Conflito de Professor (Obrigatório):** Verificar se o `professorId` já está agendado para o mesmo `diaSemana` e nos mesmos `blocos`. Se houver sobreposição, retornar **409 (Conflict)** com mensagem clara.
        Retorna 201 + objeto criado.
        
        a.2) GET /api/v1/aulas
        Lista todos em JSON array com paginação.
        Suportar query params:
          - ?professorId=... (Filtrar grade de um professor específico)
          - ?laboratorioId=... (Filtrar ocupação de um laboratório específico)
          - ?diaSemana=... (Filtrar por dia da semana)
          - ?semestre=... (Filtrar por semestre)
          - ?page=1&limit=20
        
        a.3) PUT /api/v1/aulas/:id
        Atualiza por id (ObjectId).
        Body parcial permitido.
        Lógica de Negócio:
          - Antes de salvar, revalidar a existência de todos os ObjectIds fornecidos.
          - **Revalidar Conflito:** Se os campos `laboratorioId`, `professorId`, `diaSemana` ou `blocos` forem alterados, repetir as verificações de **Conflito de Laboratório** e **Conflito de Professor**, excluindo o próprio documento da checagem. Retornar 409 se houver conflito.
        Retorna 200 + objeto atualizado, 404 se não encontrado.

        a.4) DELETE /api/v1/aulas/:id
        Remove fisicamente por id.
        Retorna 204 sem corpo, 404 se não encontrado.

        a.5) Convenções de resposta de erro
        Manter o padrão: JSON { message: string, details?: any }
        400 validação, 404 não encontrado (IDs de entidades ou a própria aula), **409 conflito (Agendamento Duplo)**, 500 erro interno.

2. Definir suporte ao Swagger
   - Atualizar o arquivo de configuração do Swagger para incluir as novas rotas de aulas.

3. Criar a documentação Swagger e JSDoc
   - Adicionar definições de schemas para Aulas.
   - Documentar todos os parâmetros e respostas possíveis.

4. Critérios de aceite
   - GET /api/v1/aulas retorna array paginado.
   - POST com `laboratorioId` ou `professorId` já agendados para o mesmo horário/dia retorna erro **409 (Conflict)** com mensagem clara em pt-BR.
   - Filtros de busca (professorId, laboratorioId, diaSemana) funcionam corretamente.
   - Swagger UI acessível e testável.
   - Código com JSDoc completo e em pt-BR.