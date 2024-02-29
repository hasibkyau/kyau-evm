export interface Counter {
  _id?: string;
  name?: string;
  scheduleTime?: string;
  priority?: number;
  status?: 'draft' | 'publish';
  select?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
