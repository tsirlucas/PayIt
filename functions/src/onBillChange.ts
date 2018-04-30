import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import {Bill, IndexedPendencies, User, UserPendencies} from 'models';

import {computeBillPendency} from './core/pendency';
import {setPendency} from './rest/pendency';
import {getUserPendencies} from './rest/user';

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
