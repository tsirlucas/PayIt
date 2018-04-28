import {Firestore} from '@google-cloud/firestore';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import {Bill, IndexedPendencies, User, UserPendencies} from 'models';

import {computeBillPendency} from './core/pendency';
import {setPendency} from './rest/pendency';

const getUserPendencies = async (firestore: Firestore, userId: string) => {
  const user = await firestore.doc(`/users/${userId}`).get();
  const pendencies = await firestore.doc(`/pendencies/${userId}`).get();

  return {user: user.data() as User, pendencies: pendencies.data() as UserPendencies};
};

const updateBillPendency = (
  firestore: FirebaseFirestore.Firestore,
  user: User,
  pendencies: UserPendencies = {id: null as string, data: null as IndexedPendencies},
  bill: Bill,
) => {
  const {payday} = user;
  const data = pendencies.data || {};
  const updatedPendency = computeBillPendency(bill, data, payday);

  return setPendency(firestore, user, updatedPendency);
};

export const onBillChange = functions.firestore
  .document('bills/{billId}')
  .onWrite(async (event) => {
    const newBillValue: Bill = event.after.data() as Bill;
    const users = newBillValue && Object.keys(newBillValue.permissions);

    if (users && users.length > 0) {
      const firestore = admin.firestore();

      return users.map(async (userId) => {
        const {user, pendencies} = await getUserPendencies(firestore, userId);

        return updateBillPendency(firestore, user, pendencies, newBillValue);
      });
    } else {
      return true;
    }
  });
