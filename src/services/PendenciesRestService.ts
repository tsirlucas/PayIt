import {UserPendencies} from 'models';
import {FirebaseRestService} from 'services/FirebaseRestService';

export interface PendenciesSubscribeUpdate {
  type: string;
  updated: UserPendencies;
}

export class PendenciesRestService {
  private static instance: PendenciesRestService;
  private collectionStore: FirebaseRestService;

  static getInstance() {
    if (!this.instance) {
      this.instance = new PendenciesRestService();
    }

    return this.instance;
  }

  constructor() {
    this.collectionStore = new FirebaseRestService('pendencies');
  }

  public getPendency = async (id: string) => {
    return this.collectionStore.get(id);
  };

  public setPendency = async (pendency: UserPendencies) => {
    return this.collectionStore.set(pendency.id, pendency);
  };

  public setPendencyAsPaid = async (userId: string, pendencyId: string) => {
    return this.collectionStore.set(userId, {[`data.${pendencyId}.type`]: 'PAID'});
  };

  public subscribeDocument = (id: string, cb: Function) =>
    this.collectionStore.subscribeDocument(id, cb);
}
