@projeto @backend

resposta: pt-br

Crie um modelo (Schema) do Mongoose para a coleção 'blocos' (ou 'blocosdehorarios') para um backend Node.js.

1. Estrutura do modelo:
   - turno: String (obrigatório). **Deve usar Enum** com os valores: ['Manhã', 'Tarde', 'Noite', 'Integral'].
   - diaSemana: String (obrigatório). **Deve usar Enum** com os valores: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].
   - inicio: String (obrigatório). Formato esperado: HH:mm (ex: '07:30').
   - fim: String (obrigatório). Formato esperado: HH:mm (ex: '08:20').
   - ordem: Number (obrigatório).

2. Requisitos técnicos:
   - Adicione timestamps (createdAt, updatedAt).
   - Crie um **índice composto único** para garantir que a combinação **(turno, diaSemana, ordem)** seja única no banco de dados.
   - Adicione validação para que a 'ordem' seja um número inteiro positivo (min: 1).
   - Adicione uma validação que garanta que o horário de 'inicio' seja sempre anterior ao horário de 'fim'.
   - Gere a documentação JSDoc completa para o modelo e seus métodos.
   - Responda apenas em português (pt-br).