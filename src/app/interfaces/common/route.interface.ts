import { Counter } from "./counter.interface";
import { Terminal } from "./terminal.interface";

export interface Routes{
  _id?: string;
  from?: Terminal;
  to?: Terminal;
  boardingPoints?: Counter[];
  droppingPoints?: Counter[];
  priority?: number;
  status?: 'draft' | 'publish';
  createdAt?: Date;
  updatedAt?: Date;
  select?:boolean;
}
