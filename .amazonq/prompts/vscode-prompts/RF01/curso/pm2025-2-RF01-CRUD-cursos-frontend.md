@projeto @frontend

resposta: pt-br

1. Editar o componente src/component/Menu/Menu.jsx 
    a) adicionar item de menu para "Cursos". 
        a.1) ao selecionar cursos, exibir o componente Cursos em um modal (ou reaproveitar a estrutura de modal existente); 
        a.2) garantir controles para fechar o modal.

2. Criar o componente src/component/Cursos/Cursos.jsx 
    a) funcionalidades: 
        a.1) grid listando os cursos.
             - Exibir colunas: Nome, Turnos (formatado), Status e Instituição.
             - Formulário de Inserir/Alterar: Usar um <Select> para 'instituicaoId' (buscando do endpoint de instituições) e checkboxes ou multiselect para 'turnos'.
        a.2) ao clicar no cabeçalho da coluna, ordenar o conteúdo do grid. 
        a.3) filtrar conteúdo do grid (filtro de texto simples pelo nome). 
    b) integrar componente com os endpoints de /api/v1/cursos.

3. Critérios de aceitação 
    a) A interface deve ser responsiva (mobile-friendly).
    b) O formulário deve validar campos obrigatórios antes de enviar.

4. Gerar documentação e comentários JSDoc