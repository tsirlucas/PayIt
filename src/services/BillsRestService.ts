import {Bill} from 'models';
import {FirebaseRestService} from 'services/FirebaseRestService';

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

  public getBill = async (id: string) => {
    return this.collectionStore.get(id);
  };

  public setBill = async (bill: Bill) => {
    return this.collectionStore.set(bill.id, bill);
  };

  public subscribe = (cb: Function, filter: string[]) => this.collectionStore.subscribeCollection(cb, filter);
}
