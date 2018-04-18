export interface Pendency {
  billId: string;
  expirationDay: string;
  description: string;
  type: string;
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
