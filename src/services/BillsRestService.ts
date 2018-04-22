import {Bill} from 'models';
import {FirebaseAuthService, FirebaseRestService} from 'services/FirebaseRestService';

export interface BillsSubscribeUpdate {
  type: string;
  updated: Bill;
}

export class BillsRestService {
  private static instance: BillsRestService;
  private collectionStore: FirebaseRestService;

  static getInstance() {
    if (!this.instance) {
      this.instance = new BillsRestService();
    }

    return this.instance;
  }

  constructor() {
    this.collectionStore = new FirebaseRestService('bills');
  }

  public getBill = (id: string) => {
    return this.collectionStore.get(id);
  };

  public setBill = (bill: Bill) => {
    if (!bill.permissions) {
      const userId = FirebaseAuthService.getInstance().getUserId();
      bill = {...bill, permissions: {[userId]: 'AUTHOR'}};
    }
    return this.collectionStore.set(bill.id, bill);
  };

  public remove = (id: string) => {
    return this.collectionStore.delete(id);
  };

  public subscribe = (cb: Function, filter: [string, string, string]) =>
    this.collectionStore.subscribeCollection(cb, filter);
}
