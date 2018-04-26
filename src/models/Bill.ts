export interface Bill {
  id: string;
  description: string;
  generationDay: number;
  expirationDay: number;
  frequency: string;
  permissions: {[index: string]: string};
  type: string;
  value: number;
}

export interface IndexedBills {
  [index: string]: Bill;
}
