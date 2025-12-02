@projeto @frontend

resposta: pt-br

1. Editar o componente src/component/Menu/Menu.jsx 
    a) adicionar item de menu para "Aulas / Agendamentos". 
        a.1) ao selecionar, exibir o componente Aulas em um modal (ou reaproveitar a estrutura de modal existente); 
        a.2) garantir controles para fechar o modal.

2. Criar o componente src/component/Aulas/Aulas.jsx 
    a) funcionalidades: 
        a.1) grid listando as aulas.
             - Exibir colunas: Semestre, Curso, Disciplina, Professor, Laboratório e Dia da Semana/Blocos.
             - **Filtros Adicionais:** Adicionar filtros por **Professor** (Select) e **Laboratório** (Select) para visualização da grade.
             - Formulário de Inserir/Alterar: 
                - **Campo Semestre:** Input de texto (Ex: '2024.2'). Obrigatório.
                - **Campo Curso:** Usar **<Select>** para `cursoId` (GET /api/v1/cursos). Obrigatório.
                - **Campo Disciplina:** Usar **<Select>** para `disciplinaId` (GET /api/v1/disciplinas). Obrigatório.
                - **Campo Professor:** Usar **<Select>** para `professorId` (GET /api/v1/professores). Obrigatório.
                - **Campo Laboratório:** Usar **<Select>** para `laboratorioId` (GET /api/v1/laboratorios). Obrigatório.
                - **Campo Dia da Semana:** Usar **<Select>** (Enum: Segunda a Domingo). Obrigatório.
                - **Campo Blocos:** Usar **<Multi-Select / Checkboxes>** para `blocos` (GET /api/v1/blocos). O usuário deve selecionar um ou mais blocos para o dia. (Obrigatório).
                - **Campo Data Início:** Input `type='date'`. (Obrigatório).
                - **Campo Data Fim:** Input `type='date'`. (Obrigatório).
        a.2) ao clicar no cabeçalho da coluna, ordenar o conteúdo do grid. 
        a.3) filtrar conteúdo do grid (filtro de texto simples que busque por nome da disciplina ou semestre). 
    b) integrar componente com os endpoints de /api/v1/aulas.

3. Critérios de aceitação 
    a) A interface deve ser responsiva (mobile-friendly).
    b) **Carregamento de Dados:** Ao carregar o modal/formulário, o frontend deve realizar **quatro chamadas de API** (`cursos`, `disciplinas`, `professores`, `laboratorios`, `blocos`) para popular todos os Selects.
    c) **Validação Temporal:** O formulário deve impedir o envio se a **Data Início** for posterior à **Data Fim**.
    d) **Tratamento de Conflito (409):** Se a API retornar **409 (Conflito)**, exibir mensagem clara indicando se o conflito é de **Laboratório** ou **Professor** para o bloco de horário selecionado.
    e) O formulário deve validar que todos os campos obrigatórios estão preenchidos, especialmente o `blocos` (Array de IDs).

4. Gerar documentação e comentários JSDoc