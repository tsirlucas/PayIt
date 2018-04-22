export default {
  inputs: {
    description: {
      label: 'Descrição',
      requiredMessage: 'O campo descrição é obrigatório!',
    },
    value: {
      label: 'Valor',
      requiredMessage: 'O campo valor é obrigatório!',
    },
    type: {
      placeholder: 'Tipo',
      options: {
        bill: 'Boleto',
      },
    },
    frequency: {
      placeholder: 'Frequência',
      options: {
        monthly: 'Mensalmente',
      },
    },
    generationDay: {
      placeholder: 'Dia da geração',
    },
    expirationDay: {
      placeholder: 'Dia do vencimento',
    },
  },
};
