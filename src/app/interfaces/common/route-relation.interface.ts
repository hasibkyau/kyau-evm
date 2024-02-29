import { Terminal } from "./terminal.interface";

export interface RouteRelations{
  _id?: string;
  from?: Terminal;
  to?: [Terminal];
  priority?: number;
  status?: 'draft' | 'publish';
  createdAt?: Date;
  updatedAt?: Date;
  select?:boolean;
}
