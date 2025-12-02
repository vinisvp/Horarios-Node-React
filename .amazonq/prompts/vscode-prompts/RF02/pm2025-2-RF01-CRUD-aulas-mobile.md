@projeto @mobile

respostas: pt-br

1. Implementar o módulo de Aulas (Agendamentos) na aplicação mobile:

    a) Criar navegação e telas para o CRUD de Aulas
       - Seguir o mesmo padrão de design system e componentes usados nos módulos anteriores.

    b) Tela de Listagem (GET /api/v1/aulas)
       - Exibir lista (FlatList/ScrollView) com cards contendo: Semestre, Nome da Disciplina, Professor e Laboratório.
       - A lista deve ser agrupada ou formatada para facilitar a visualização da grade (Ex: Agrupar por Dia da Semana).
       - Implementar **"Pull to refresh"** para atualizar a lista.
       - Filtros de busca essenciais: **Professor** (Picker), **Laboratório** (Picker) e **Dia da Semana** (Picker).

    c) Tela de Cadastro/Edição (POST e PUT)
       - **Campos de Relacionamento (Pickers/Modais):**
         - **Curso (cursoId):** Picker, consome `/api/v1/cursos`. (Obrigatório).
         - **Disciplina (disciplinaId):** Picker, consome `/api/v1/disciplinas`. (Obrigatório).
         - **Professor (professorId):** Picker, consome `/api/v1/professores`. (Obrigatório).
         - **Laboratório (laboratorioId):** Picker, consome `/api/v1/laboratorios`. (Obrigatório).
       - **Campos de Agendamento:**
         - **Dia da Semana:** Picker (Enum: Segunda a Domingo). (Obrigatório).
         - **Blocos (Array de IDs):** Componente de seleção múltipla (ex: **Multi-select Modal** ou **Checkboxes**) que consome `/api/v1/blocos`. (Obrigatório).
         - **Semestre:** Input de texto (Ex: '2024.2'). (Obrigatório).
         - **Data Início/Fim:** Componentes de seleção de data (**Date Picker**). (Obrigatório).

    d) Exclusão (DELETE)
       - Adicionar botão de excluir com alerta de confirmação nativo.

2. Critérios de aceite
    - **Carregamento de Dados:** Ao carregar a tela, realizar as **5 chamadas de API** necessárias (`cursos`, `disciplinas`, `professores`, `laboratorios`, `blocos`) para popular os Pickers.
    - O formulário deve validar todos os campos obrigatórios (incluindo o `blocos` como um array não vazio).
    - **Validação Temporal:** A Data Início deve ser validada para não ser posterior à Data Fim.
    - **Tratamento de Conflito (409):** Se a API retornar **409**, exibir alerta ou Toast: "Conflito de Agendamento: Professor ou Laboratório já ocupados no horário.".
    - Tratamento de erros gerais (400, 404, 500) deve exibir mensagens amigáveis (Toast ou Alert) em pt-BR.
    - Manter responsividade e adaptação para teclado (**KeyboardAvoidingView**).