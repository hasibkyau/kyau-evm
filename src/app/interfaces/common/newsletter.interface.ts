export interface Newsletter {
  _id?: string;
  readOnly?: boolean;
  email?: string;
  select?:boolean;
  createdAt?:Date;
}
