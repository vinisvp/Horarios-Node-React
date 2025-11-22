@projeto @mobile

respostas: pt-br

1. Implementar o módulo de Cursos na aplicação mobile:

    a) Criar navegação e telas para o CRUD de Cursos
       - Seguir o mesmo padrão de design system e componentes usados em Instituições.

    b) Tela de Listagem (GET /api/v1/cursos)
       - Exibir lista (FlatList/ScrollView) com cards contendo: Nome do Curso, Status e Nome da Instituição.
       - Implementar "Pull to refresh" para atualizar a lista.
       - Filtro de busca local pelo nome do curso.

    c) Tela de Cadastro/Edição (POST e PUT)
       - Campo Nome: Input de texto.
       - Campo Instituição: Componente de seleção (Picker/Modal). Deve consumir o endpoint GET /api/v1/instituicoes para popular as opções.
       - Campo Turnos: Componente de múltipla escolha (ex: Chips selecionáveis ou Checkboxes) para 'Manhã', 'Tarde', 'Noite'.
       - Campo Status: Switch/Toggle (Ativo/Inativo).

    d) Exclusão (DELETE)
       - Adicionar botão de excluir com alerta de confirmação nativo.

2. Critérios de aceite
    - O formulário deve validar campos obrigatórios antes do envio.
    - Ao abrir o formulário, a lista de instituições deve ser carregada automaticamente para o seletor.
    - Tratamento de erros da API (400, 404, 500) deve exibir mensagens amigáveis (Toast ou Alert) em pt-BR.
    - Manter responsividade e adaptação para teclado (KeyboardAvoidingView).