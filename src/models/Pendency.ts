export interface Pendency {
  id: string;
  billId: string;
  expirationDay: string;
  description: string;
  type: string;
  value: number;
  warning: boolean;
}

export interface CategorizedPendencies {
  delayed: Pendency[];
  ideal: Pendency[];
  next: Pendency[];
}

export interface UserPendencies {
  id: string;
  data: IndexedPendencies;
}

export interface IndexedPendencies {
  [index: string]: Pendency;
}
