import {Platform} from 'react-native';

export default {
  routes: {
    titles: {
      home: 'Home',
      bills: 'Bills',
      settings: 'Settings',
      delayed: 'Delayed Bills',
      ideal: 'Ideal Bills',
      next: 'Next Bills',
      newBill: 'New Bill',
      editBill: 'Edit Bill',
    },
    actions: {
      create: Platform.select({android: 'CREATE', ios: 'Create'}),
    },
  },
  confirmDialog: {
    title: 'Are you sure?',
    msg: 'This action cannot be undone',
    confirm: 'Confirm',
    cancel: 'Cancel',
  },
};
