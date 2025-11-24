@projeto @mobile

respostas: pt-br

1. Implementar o módulo de Professores na aplicação mobile:

    a) Criar navegação e telas para o CRUD de Professores
       - Seguir o mesmo padrão de design system e componentes usados em Instituições e Cursos.

    b) Tela de Listagem (GET /api/v1/professores)
       - Exibir lista (FlatList/ScrollView) com cards contendo: Nome, Email e Status.
       - Implementar "Pull to refresh" para atualizar a lista.
       - Filtro de busca local pelo nome ou email do professor.

    c) Tela de Cadastro/Edição (POST e PUT)
       - Campo Nome: Input de texto.
       - Campo Email: Input de texto. Configurar `keyboardType="email-address"` e `autoCapitalize="none"`.
       - Campo Telefone: Input de texto. Configurar `keyboardType="phone-pad"`. Se possível, aplicar máscara de formatação (ex: (XX) XXXXX-XXXX) enquanto o usuário digita.
       - Campo Status: Switch/Toggle (Ativo/Inativo).

    d) Exclusão (DELETE)
       - Adicionar botão de excluir com alerta de confirmação nativo.

2. Critérios de aceite
    - O formulário deve validar se o email é válido e se campos obrigatórios estão preenchidos.
    - Tratamento de erro específico: Se a API retornar 409, exibir alerta claro: "Este email já está cadastrado".
    - Tratamento de erros gerais (400, 404, 500) deve exibir mensagens amigáveis (Toast ou Alert) em pt-BR.
    - Manter responsividade e adaptação para teclado (KeyboardAvoidingView), garantindo que o teclado não cubra os campos de input.