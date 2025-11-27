@projeto @mobile

respostas: pt-br

1. Implementar o módulo de Laboratórios na aplicação mobile:

    a) Criar navegação e telas para o CRUD de Laboratórios
       - Seguir o mesmo padrão de design system e componentes usados nos módulos anteriores.

    b) Tela de Listagem (GET /api/v1/laboratorios)
       - Exibir lista (FlatList/ScrollView) com cards contendo: Nome do Laboratório, Capacidade e Local.
       - Implementar **"Pull to refresh"** para atualizar a lista.
       - Filtro de busca local pelo nome ou local do laboratório.

    c) Tela de Cadastro/Edição (POST e PUT)
       - Campo Nome: Input de texto obrigatório.
       - Campo Capacidade: Input de texto. Configurar `keyboardType="numeric"` e validar número positivo.
       - Campo Local: Input de texto opcional (Ex: Bloco B, Sala 201).
       - Campo Status: Switch/Toggle (Ativo/Inativo).

    d) Exclusão (DELETE)
       - Adicionar botão de excluir com alerta de confirmação nativo.

2. Critérios de aceite
    - O formulário deve validar se os campos obrigatórios (**Nome** e **Capacidade**) estão preenchidos.
    - **Validação Específica:** O campo **Capacidade** deve ser validado para ser um número **maior que zero** antes de enviar para a API.
    - Tratamento de erros gerais (400, 404, 500) deve exibir mensagens amigáveis (Toast ou Alert) em pt-BR.
    - Manter responsividade e adaptação para teclado (**KeyboardAvoidingView**).