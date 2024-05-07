import {Select} from "src/app/interfaces/core/select";

export const SEAT_TYPES: Select[] = [
  { value: 'noSeat', viewValue: 'No Seat' },
  { value: 'singleChair', viewValue: 'Chair' },
  { value: 'singleNonAc', viewValue: 'Single Non AC' },
  { value: 'singleAc', viewValue: 'Single AC' },
  { value: 'doubleNonAc', viewValue: 'Double Non AC' },
  { value: 'doubleAc', viewValue: 'Double AC' },
  { value: 'singleSleeper', viewValue: 'Single Sleeper' },
  { value: 'doubleSleeper', viewValue: 'Double Sleeper' },
  { value: 'familyAc', viewValue: 'Family AC' },
  { value: 'familyNonAc', viewValue: 'Family Non AC' },
  { value: 'semiFamilyAc', viewValue: 'Semi Family AC' },
  { value: 'semiFamilyNonAc', viewValue: 'Semi Family Non AC' },
  { value: 'semiVip', viewValue: 'Semi VIP' },
  { value: 'vip', viewValue: 'VIP' },

  { value: 'deluxCabin', viewValue: 'Delux Cabin' },
  { value: 'semiDoubleCabin', viewValue: 'Semi Double Cabin' },
];
