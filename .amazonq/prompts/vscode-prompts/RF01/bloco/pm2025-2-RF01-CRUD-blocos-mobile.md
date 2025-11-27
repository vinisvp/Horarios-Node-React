@projeto @mobile

respostas: pt-br

1. Implementar o módulo de Blocos de Horários na aplicação mobile:

    a) Criar navegação e telas para o CRUD de Blocos
       - Seguir o mesmo padrão de design system e componentes usados nos módulos anteriores.

    b) Tela de Listagem (GET /api/v1/blocos)
       - Exibir lista (FlatList/ScrollView) com cards contendo: **Turno**, **Dia da Semana**, **Início** e **Fim**.
       - A lista deve ser **ordenada por Turno** e depois por **Ordem** (campo que deve ser usado para sorting, mas não precisa ser exibido no card).
       - Implementar **"Pull to refresh"** para atualizar a lista.
       - Filtro de busca local pelo **Turno** e/ou **Dia da Semana**.

    c) Tela de Cadastro/Edição (POST e PUT)
       - **Campo Turno:** Componente de seleção (**Picker/Modal**) obrigatório. Opções: 'Manhã', 'Tarde', 'Noite', 'Integral'.
       - **Campo Dia da Semana:** Componente de seleção (**Picker/Modal**) obrigatório. Opções: 'Segunda', 'Terça', ..., 'Domingo'.
       - **Campo Ordem:** Input de texto, configurado com `keyboardType="numeric"` (obrigatório, validar número positivo).
       - **Campo Início:** Componente de seleção de tempo/hora (**Time Picker**) para `HH:mm`. (Obrigatório).
       - **Campo Fim:** Componente de seleção de tempo/hora (**Time Picker**) para `HH:mm`. (Obrigatório).

    d) Exclusão (DELETE)
       - Adicionar botão de excluir com alerta de confirmação nativo.

2. Critérios de aceite
    - O formulário deve validar todos os campos obrigatórios.
    - **Validação Temporal Específica:** O horário de **Início** deve ser validado para ser anterior ao horário de **Fim** no próprio frontend, exibindo um alerta amigável se a regra for violada.
    - **Tratamento de 409 (Conflito):** Se a API retornar 409, exibir mensagem clara: "Já existe um bloco com o mesmo Turno, Dia e Ordem.".
    - Tratamento de erros gerais (400, 404, 500) deve exibir mensagens amigáveis (Toast ou Alert) em pt-BR.
    - Manter responsividade e adaptação para teclado (**KeyboardAvoidingView**).