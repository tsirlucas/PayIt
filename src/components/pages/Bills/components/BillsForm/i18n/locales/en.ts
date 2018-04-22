export default {
  inputs: {
    description: {
      label: 'Description',
      requiredMessage: 'The description field is required!',
    },
    value: {
      label: 'Value',
      requiredMessage: 'The value field is required!',
    },
    type: {
      placeholder: 'Type',
      options: {
        bill: 'Bill',
      },
    },
    frequency: {
      placeholder: 'Frequency',
      options: {
        monthly: 'Monthly',
      },
    },
    generationDay: {
      placeholder: 'Generaion Day',
    },
    expirationDay: {
      placeholder: 'Expiration Day',
    },
  },
};
