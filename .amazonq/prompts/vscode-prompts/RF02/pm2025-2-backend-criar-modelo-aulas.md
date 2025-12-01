@projeto @backend

resposta: pt-br

Crie um modelo (Schema) do Mongoose para a coleção 'aulas' (ou 'agendamentos') para um backend Node.js.

1. Estrutura do modelo:
   - semestre: String (obrigatório). (Ex: '2024.1').
   - cursoId: deve ser um ObjectId referenciando a collection 'cursos' (obrigatório).
   - disciplinaId: deve ser um ObjectId referenciando a collection 'disciplinas' (obrigatório).
   - professorId: deve ser um ObjectId referenciando a collection 'professores' (obrigatório).
   - laboratorioId: deve ser um ObjectId referenciando a collection 'laboratorios' (obrigatório).
   - diaSemana: String (obrigatório). Deve usar **Enum** com os valores: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].
   - blocos: Array de ObjectIds referenciando a collection 'blocos' (obrigatório). Representa os horários da aula naquele dia.
   - dataInicio: Date (obrigatório).
   - dataFim: Date (obrigatório).

2. Requisitos técnicos:
   - Adicione timestamps (createdAt, updatedAt).
   - Crie um **índice composto único** (partial unique index, se aplicável, ou uma validação customizada forte) para garantir que um **Laboratório** não seja agendado duas vezes no mesmo **Dia da Semana** e no mesmo **Bloco de Horário**. A chave de unicidade deve ser: **(laboratorioId, diaSemana, blocos)**.
   - Adicione validação para garantir que 'dataInicio' seja anterior ou igual a 'dataFim'.
   - Adicione validação para garantir que o array `blocos` não esteja vazio.
   - Gere a documentação JSDoc completa para o modelo e seus métodos.
   - Responda apenas em português (pt-br).