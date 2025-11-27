@projeto @frontend

resposta: pt-br

1. Editar o componente src/component/Menu/Menu.jsx 
    a) adicionar item de menu para "Laboratórios". 
        a.1) ao selecionar laboratórios, exibir o componente Laboratorios em um modal (ou reaproveitar a estrutura de modal existente); 
        a.2) garantir controles para fechar o modal.

2. Criar o componente src/component/Laboratorios/Laboratorios.jsx 
    a) funcionalidades: 
        a.1) grid listando os laboratórios.
             - Exibir colunas: Nome, Capacidade (número de lugares), Local e Status.
             - Formulário de Inserir/Alterar: 
                - Campo Nome: Input texto obrigatório.
                - Campo Capacidade: Input type='number' obrigatório.
                - Campo Local: Input texto opcional (ex: "Bloco A", "Sala 101").
                - Campo Status: Select ou Switch (Ativo/Inativo).
        a.2) ao clicar no cabeçalho da coluna, ordenar o conteúdo do grid. 
        a.3) filtrar conteúdo do grid (filtro de texto simples que busque por nome ou local). 
    b) integrar componente com os endpoints de /api/v1/laboratorios.

3. Critérios de aceitação 
    a) A interface deve ser responsiva (mobile-friendly).
    b) Validação de Frontend: O formulário deve impedir o envio se o campo **Capacidade** for menor ou igual a 0.
    c) Tratamento de erro: Se a API retornar erro (ex: 400 por dados inválidos ou 409 por duplicidade), exibir mensagem clara ao usuário.

4. Gerar documentação e comentários JSDoc