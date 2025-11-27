@projeto @frontend

resposta: pt-br

1. Editar o componente src/component/Menu/Menu.jsx 
    a) adicionar item de menu para "Blocos de Horários". 
        a.1) ao selecionar blocos de horários, exibir o componente Blocos em um modal (ou reaproveitar a estrutura de modal existente); 
        a.2) garantir controles para fechar o modal.

2. Criar o componente src/component/Blocos/Blocos.jsx 
    a) funcionalidades: 
        a.1) grid listando os blocos de horários.
             - Exibir colunas: Turno, Dia da Semana, Início, Fim e Ordem.
             - **Ordenação Padrão:** O grid deve ser ordenado por **Turno** e depois por **Ordem** crescente.
             - Formulário de Inserir/Alterar: 
                - Campo Turno: Usar **<Select>** com as opções: 'Manhã', 'Tarde', 'Noite', 'Integral'. (Obrigatório).
                - Campo Dia da Semana: Usar **<Select>** com as opções: 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'. (Obrigatório).
                - Campo Início: Input de texto com formato de hora (ex: HH:mm). (Obrigatório).
                - Campo Fim: Input de texto com formato de hora (ex: HH:mm). (Obrigatório).
                - Campo Ordem: Input **numérico** (type='number', min='1'). (Obrigatório).
        a.2) ao clicar no cabeçalho da coluna (Turno, Dia da Semana, Ordem), ordenar o conteúdo do grid. 
        a.3) filtrar conteúdo do grid (Filtro por **Turno** (Select) e filtro de texto simples que busque por **Dia da Semana**). 
    b) integrar componente com os endpoints de /api/v1/blocos.

3. Critérios de aceitação 
    a) A interface deve ser responsiva (mobile-friendly).
    b) **Validação Temporal:** O formulário deve impedir o envio se o horário de **Início** for posterior ou igual ao horário de **Fim**.
    c) **Validação de Unicidade (409):** Se a API retornar **409 (Conflito)**, exibir mensagem clara indicando que "Um bloco já existe para este Turno, Dia e Ordem".
    d) O formulário deve validar campos obrigatórios e números positivos para a **Ordem**.

4. Gerar documentação e comentários JSDoc