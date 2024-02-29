import { Bus, Seat } from "./bus.interface";
import { Counter } from "./counter.interface";
import { Schedule } from "./schedule.interface";
import { Terminal } from "./terminal.interface";

export interface BusConfig {
  _id?: string;
  date?: string;
  bus?: Bus;
  departureTime?: Schedule;
  arrivalTime?: Schedule;
  from?: Terminal;
  to?: Terminal;
  boardingPoints?: Counter[];
  droppingPoints?: Counter[];
  price?: number;
  serviceCharge?: number;
  seats?: Seat[];
  priority?: number;
  status?: 'draft' | 'publish';
  createdAt: string;
  updatedAt: string;
  select?:boolean;
}
