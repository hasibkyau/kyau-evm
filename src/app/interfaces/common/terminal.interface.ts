import { Counter } from "./counter.interface";

export interface Terminal {
  _id?: string;
  name?: string;
  counters?: Counter[];
  priority?: number;
  status?: 'draft' | 'publish';
  createdAt?: Date;
  updatedAt?: Date;
  select?:boolean;
}
