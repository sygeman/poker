export type User = {
  id: string;
  name: string;
  value: number;
};

export type Session = {
  users: User[];
  currentUser: User;
  hiddenValues: Boolean;
  valuesSet: number[];
  maxValue: number;
  avg: number;
  percent: number;
};

export type SocketAction = {
  type: string;
  data?: number | string;
};
