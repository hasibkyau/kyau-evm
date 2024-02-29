export interface Schedule {
  _id?: string;
  name?: string;
  shift?: 'Night' | 'Morning' | 'Evening';
  priority?: number;
  status?: 'draft' | 'publish';
  createdAt?: Date;
  updatedAt?: Date;
  select?:boolean;
}
