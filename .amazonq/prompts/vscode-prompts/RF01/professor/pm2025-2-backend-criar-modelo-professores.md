@projeto @backend

resposta: pt-br

Crie um modelo (Schema) do Mongoose para a coleção 'professores' para um backend Node.js.

1. Estrutura do modelo:
   - nome: String (obrigatório).
   - email: String (obrigatório, deve ser único no banco).
   - telefone: String (opcional).
   - status: String (ex: 'Ativo', 'Inativo') com valor padrão 'Ativo'.

2. Requisitos técnicos:
   - Adicione timestamps (createdAt, updatedAt).
   - No campo 'email', adicione propriedades para 'trim' e 'lowercase' para sanitização.
   - Gere a documentação JSDoc completa para o modelo e seus métodos.
   - Responda apenas em português (pt-br).