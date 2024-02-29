import { Bus, Seat } from './bus.interface';
import { Schedule } from './schedule.interface';
import { Terminal } from './terminal.interface';
import { Counter } from './counter.interface';

export interface Ticket {
  _id?: string;
  ticketNo?: string;
  date?: string;
  trip?: string;
  name?: string;
  phoneNo?: string;
  email?: string;
  gender?: string;
  subTotal?: number;
  discount?: number;
  serviceCharge?: number;
  bookingTime?: number;
  paidAmount?: number;
  grandTotal?: number;
  ticketType?:'Booked' | 'Issued' | 'Canceled';
  bus?: Bus;
  departureTime?: Schedule;
  arrivalTime?: Schedule;
  from?: Terminal;
  to?: Terminal;
  boardingPoints?: Counter;
  droppingPoints?: Counter;
  seats?: Seat[];
  canceledSeats?: Seat[];
  user?: string;
  bookedInfo?: BookedInfo;
  issuedInfo?: BookedInfo;
  price?: number;
  expiredIn?: any;
  expireTime?: any;
  status?: 'draft' | 'publish';
  createdAt: string;
  updatedAt: string;
  select?:boolean;
}

interface BookedInfo {
  _id: string;
  role: string;
  applicationChannel: string;
}
