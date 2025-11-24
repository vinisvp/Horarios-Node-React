@projeto @backend

resposta: pt-br

Crie um modelo (Schema) do Mongoose para a coleção 'disciplinas' para um backend Node.js.

1. Estrutura do modelo:
   - cursoId: deve ser um ObjectId referenciando a collection 'cursos' (obrigatório).
   - nome: String (obrigatório).
   - cargaHoraria: Number (obrigatório).
   - professorId: deve ser um ObjectId referenciando a collection 'professores' (opcional).
   - status: String (ex: 'Ativo', 'Inativo') com valor padrão 'Ativo'.

2. Requisitos técnicos:
   - Adicione timestamps (createdAt, updatedAt).
   - No campo 'cargaHoraria', adicione validação para garantir que seja um número positivo.
   - Gere a documentação JSDoc completa para o modelo e seus métodos.
   - Responda apenas em português (pt-br).