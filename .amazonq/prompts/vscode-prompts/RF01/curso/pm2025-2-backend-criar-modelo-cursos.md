@projeto @backend

resposta: pt-br

Crie um modelo (Schema) do Mongoose para a coleção 'cursos' para um backend Node.js.

1. Estrutura do modelo:
   - instituicaoId: deve ser um ObjectId referenciando a collection 'instituicoes'.
   - nome: String (obrigatório).
   - turnos: Array de Strings (ex: ['Manhã', 'Noite']).
   - status: String (ex: 'Ativo', 'Inativo') ou Boolean.

2. Requisitos técnicos:
   - Adicione timestamps (createdAt, updatedAt).
   - Gere a documentação JSDoc completa para o modelo e seus métodos.
   - Responda apenas em português (pt-br).
