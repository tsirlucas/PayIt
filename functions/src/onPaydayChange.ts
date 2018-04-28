import {Firestore} from '@google-cloud/firestore';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import {Bill, IndexedPendencies, User, UserPendencies} from 'models';

import {computeBillPendency} from './core/pendency';
import {setPendency} from './rest/pendency';

const getPendenciesBills = async (firestore: Firestore, pendencies: UserPendencies) => {
  const billsPromises = Object.keys(pendencies.data)
    .filter((key) => pendencies.data[key].type !== 'PAID')
    .map(async (key) => {
      const billSnapshot = await firestore.doc(`/bills/${pendencies.data[key].billId}`).get();
      return billSnapshot.data() as Bill;
    });
  const result = await Promise.all(billsPromises);

  return result.filter((bill) => bill);
};

const updateUserPendencies = async (
  firestore: Firestore,
  user: User,
  pendencies: UserPendencies = {id: null as string, data: null as IndexedPendencies},
) => {
  const bills = await getPendenciesBills(firestore, pendencies);

  const changes = bills.map((bill) => {
    const {payday} = user;
    const data = pendencies.data || {};
    const updatedPendency = computeBillPendency(bill, data, payday);

    return setPendency(firestore, user, updatedPendency);
  });

  return Promise.all(changes);
};

export const onPaydayChange = functions.firestore
  .document('users/{userId}')
  .onWrite(async (event) => {
    const oldUserValue: User = event.before.data() as User;
    const newUserValue: User = event.after.data() as User;

    if (oldUserValue.payday && oldUserValue.payday !== newUserValue.payday) {
      const firestore = admin.firestore();

      const pendencies = await firestore.doc(`/pendencies/${newUserValue.uid}`).get();
      return updateUserPendencies(firestore, newUserValue, pendencies.data() as UserPendencies);
    } else {
      return true;
    }
  });
