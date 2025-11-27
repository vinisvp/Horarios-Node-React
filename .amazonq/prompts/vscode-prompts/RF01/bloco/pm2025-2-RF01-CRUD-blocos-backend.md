@projeto @backend

Contexto: Backend Node.js com Express e Mongoose.
Resposta: pt-br

1. Implementar o CRUD para a entidade 'Blocos'

    a) Criar rota e controllers para o endpoint: /api/v1/blocos

        a.1) POST /api/v1/blocos
        Cria um novo bloco de horário.
        Body (JSON): { turno, diaSemana, inicio, fim, ordem }
        Lógica de Negócio:
          - Validar se o **horário de 'inicio' é anterior ao horário de 'fim'**. Retornar 400 se não for.
          - Validar se a **combinação (turno, diaSemana, ordem) já existe**. Se existir, retornar **409 (Conflict)**.
          - Validar que 'turno' e 'diaSemana' estão nos Enums definidos no Schema.
          - Validar que 'ordem' é um número inteiro positivo.
        Retorna 201 + objeto criado.
        
        a.2) GET /api/v1/blocos
        Lista todos em JSON array com paginação.
        Suportar query params:
          - ?turno=... (Filtro por turno específico: Manhã, Tarde, Noite)
          - ?diaSemana=... (Filtro por dia específico: Segunda, Terça, etc.)
          - ?ordem=... (Filtro por número do bloco)
          - ?page=1&limit=20
        
        a.3) PUT /api/v1/blocos/:id
        Atualiza por id (ObjectId).
        Body parcial permitido.
        Lógica de Negócio:
          - Se os campos 'turno', 'diaSemana' ou 'ordem' forem alterados, **revalidar a unicidade composta** (evitar 409).
          - Revalidar a lógica temporal (inicio < fim).
        Retorna 200 + objeto atualizado, 404 se não encontrado.

        a.4) DELETE /api/v1/blocos/:id
        Remove fisicamente por id.
        Retorna 204 sem corpo, 404 se não encontrado.

        a.5) Convenções de resposta de erro
        Manter o padrão: JSON { message: string, details?: any }
        400 validação (ex: horário inválido ou turno fora do Enum), 404 não encontrado, **409 conflito (Bloco duplicado)**, 500 erro interno.

2. Definir suporte ao Swagger
   - Atualizar o arquivo de configuração do Swagger para incluir as novas rotas de blocos.

3. Criar a documentação Swagger e JSDoc
   - Adicionar definições de schemas para Blocos.
   - Documentar todos os parâmetros e respostas possíveis.

4. Critérios de aceite
   - GET /api/v1/blocos retorna array paginado e **ordenado pela 'ordem' crescente**.
   - POST com bloco já existente (mesmo turno, dia e ordem) retorna erro **409 (Conflict)**.
   - POST com horário de `inicio` posterior ao `fim` retorna erro **400 (Bad Request)**.
   - Swagger UI acessível e testável.
   - Código com JSDoc completo e em pt-BR.