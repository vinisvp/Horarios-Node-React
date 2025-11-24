@projeto @frontend

resposta: pt-br

1. Editar o componente src/component/Menu/Menu.jsx 
    a) adicionar item de menu para "Disciplinas". 
        a.1) ao selecionar disciplinas, exibir o componente Disciplinas em um modal (ou reaproveitar a estrutura de modal existente); 
        a.2) garantir controles para fechar o modal.

2. Criar o componente src/component/Disciplinas/Disciplinas.jsx 
    a) funcionalidades: 
        a.1) grid listando as disciplinas.
             - Exibir colunas: Nome da Disciplina, Carga Horária, Nome do Curso (Populada via lookup) e Status.
             - Formulário de Inserir/Alterar: 
                - **Campo Curso:** Usar um <Select> para 'cursoId' (buscando do endpoint /api/v1/cursos). Obrigatório.
                - **Campo Professor:** Usar um <Select> para 'professorId' (buscando do endpoint /api/v1/professores). Opcional.
                - Campo Nome: Input texto obrigatório.
                - Campo Carga Horária: Input numérico obrigatório.
                - Campo Status: Select ou Switch (Ativo/Inativo).
        a.2) ao clicar no cabeçalho da coluna, ordenar o conteúdo do grid. 
        a.3) filtrar conteúdo do grid (filtro de texto simples que busque por nome da disciplina ou nome do curso). 
    b) integrar componente com os endpoints de /api/v1/disciplinas.

3. Critérios de aceitação 
    a) A interface deve ser responsiva (mobile-friendly).
    b) O formulário deve validar campos obrigatórios (Nome, Curso, Carga Horária) antes de enviar.
    c) Os dados dos Selects de **Cursos** e **Professores** devem ser carregados ao montar o formulário.
    d) Tratamento de erro: Se a API retornar 404 por ID de relacionamento inválido, exibir mensagem amigável indicando qual ID falhou.

4. Gerar documentação e comentários JSDoc