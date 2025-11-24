@projeto @mobile

respostas: pt-br

1. Implementar o módulo de Disciplinas na aplicação mobile:

    a) Criar navegação e telas para o CRUD de Disciplinas
       - Seguir o mesmo padrão de design system e componentes usados nos módulos anteriores (Instituições, Cursos, Professores).

    b) Tela de Listagem (GET /api/v1/disciplinas)
       - Exibir lista (FlatList/ScrollView) com cards contendo: Nome da Disciplina, Carga Horária e Nome do Curso vinculado.
       - Implementar **"Pull to refresh"** para atualizar a lista.
       - Filtro de busca local pelo nome da disciplina ou pelo nome do curso.

    c) Tela de Cadastro/Edição (POST e PUT)
       - Campo Nome: Input de texto obrigatório.
       - Campo Carga Horária: Input de texto. Configurar `keyboardType="numeric"`.
       - **Campo Curso (cursoId):** Componente de seleção (**Picker/Modal**) obrigatório. Deve consumir o endpoint **GET /api/v1/cursos** para popular as opções.
       - **Campo Professor (professorId):** Componente de seleção (**Picker/Modal**) opcional. Deve consumir o endpoint **GET /api/v1/professores** para popular as opções.
       - Campo Status: Switch/Toggle (Ativo/Inativo).

    d) Exclusão (DELETE)
       - Adicionar botão de excluir com alerta de confirmação nativo.

2. Critérios de aceite
    - O formulário deve validar se os campos obrigatórios (**Nome**, **Carga Horária** e **Curso**) estão preenchidos.
    - **Validação Específica:** O `cursoId` deve ser enviado no POST/PUT.
    - Tratamento de erros gerais (400, 404, 500) deve exibir mensagens amigáveis (Toast ou Alert) em pt-BR.
    - Manter responsividade e adaptação para teclado (**KeyboardAvoidingView**).