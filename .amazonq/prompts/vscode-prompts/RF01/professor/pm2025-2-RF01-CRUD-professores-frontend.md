@projeto @frontend

resposta: pt-br

1. Editar o componente src/component/Menu/Menu.jsx 
    a) adicionar item de menu para "Professores". 
        a.1) ao selecionar professores, exibir o componente Professores em um modal (ou reaproveitar a estrutura de modal existente); 
        a.2) garantir controles para fechar o modal.

2. Criar o componente src/component/Professores/Professores.jsx 
    a) funcionalidades: 
        a.1) grid listando os professores.
             - Exibir colunas: Nome, Email, Telefone e Status.
             - Formulário de Inserir/Alterar: 
                - Campo Nome: Input texto obrigatório.
                - Campo Email: Input type='email' obrigatório (validar formato).
                - Campo Telefone: Input texto (aplicar máscara de telefone se houver biblioteca disponível, ex: (XX) XXXXX-XXXX).
                - Campo Status: Select ou Switch (Ativo/Inativo).
        a.2) ao clicar no cabeçalho da coluna, ordenar o conteúdo do grid. 
        a.3) filtrar conteúdo do grid (filtro de texto simples que busque por nome ou email). 
    b) integrar componente com os endpoints de /api/v1/professores.

3. Critérios de aceitação 
    a) A interface deve ser responsiva (mobile-friendly).
    b) O formulário deve validar formato de e-mail antes de enviar.
    c) Tratamento de erro: Se a API retornar 409 (Email duplicado), exibir mensagem amigável no formulário.

4. Gerar documentação e comentários JSDoc