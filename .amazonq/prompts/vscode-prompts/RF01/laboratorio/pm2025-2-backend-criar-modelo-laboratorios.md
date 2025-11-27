@projeto @backend

resposta: pt-br

Crie um modelo (Schema) do Mongoose para a coleção 'laboratorios' para um backend Node.js.

1. Estrutura do modelo:
   - nome: String (obrigatório).
   - capacidade: Number (obrigatório).
   - local: String (opcional - ex: 'Bloco A', 'Sala 104').
   - status: String (ex: 'Ativo', 'Inativo') com valor padrão 'Ativo'.

2. Requisitos técnicos:
   - Adicione timestamps (createdAt, updatedAt).
   - No campo 'capacidade', adicione validação para garantir que seja um número inteiro e positivo (min: 1).
   - Gere a documentação JSDoc completa para o modelo e seus métodos.
   - Responda apenas em português (pt-br).