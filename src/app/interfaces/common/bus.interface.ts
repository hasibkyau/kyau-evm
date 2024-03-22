export interface Bus {
  _id?: string;
  name?: string;
  coachNo?: string;
  coachType?: 'Ac' | 'Non Ac' | 'Slipper';
  totalSeat?: number;
  company?: string;
  seats?: Seat[];
  priority?: number;
  status?: 'draft' | 'publish';
  createdAt?: string;
  updatedAt?: string;
  select?: boolean;
}

export interface Seat {
  _id?: string;
  seatNo?: string;
  seatType?: string;
  floorNo?: string;
  price?: number;
  status?:
    | 'Available'
    | 'Booked'
    | 'Selected'
    | 'Sold'
    | 'Blocked';
  xaxis?: number;
  yaxis?: number;
  bookedFor?: number;
  gender?: 'Male' | 'Female';
  seatTypeId?: string;
  serialNo?: number;
  version?: number;
  seatAnimation?: boolean;
  type?: 'new' | 'old';
}
