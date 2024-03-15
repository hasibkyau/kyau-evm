import {Select} from "src/app/interfaces/core/select";

export const SEAT_TYPES: Select[] = [
  {value: 'noSeat', viewValue: 'No Seat'},
  {value: 'singleChair', viewValue: 'Chair'},
  {value: 'singleNonAc', viewValue: 'Single Non AC'},
  {value: 'singleAc', viewValue: 'Single AC'},
  {value: 'doubleNonAc', viewValue: 'Double Non AC'},
  {value: 'doubleAc', viewValue: 'Double AC'},
  {value: 'familyAc', viewValue: 'Family AC'},
  {value: 'vip', viewValue: 'VIP'},
];
