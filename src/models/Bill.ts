export interface Bill {
  id: string;
  description: string;
  priority: number;
  generationDay: number;
  expirationDay: number;
  frequency: string;
  lastPaid: any;
  permissions: {[index: string]: string};
  type: string;
  value: number;
}

export interface IndexedBills {
  [index: string]: Bill;
}
