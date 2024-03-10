
import {Select} from '../../interfaces/core/select';
import {AdminRolesEnum} from '../../enum/admin.roles.enum';
import {AdminPermissions} from "../../enum/admin-permission.enum";
import {FileTypes} from '../../enum/file-types.enum';
import {OrderStatus} from '../../enum/order.enum';

export const ADMIN_ROLES: Select[] = [
  {value: AdminRolesEnum.SUPER_ADMIN, viewValue: 'Super Admin'},
  {value: AdminRolesEnum.ADMIN, viewValue: 'Admin'},
  {value: AdminRolesEnum.EDITOR, viewValue: 'Counter'},
  // {value: AdminRolesEnum.SALESMAN, viewValue: 'Sales Man'}
];

export const ADMIN_PERMISSIONS: Select[] = [
  {value: AdminPermissions.CREATE, viewValue: 'Create'},
  {value: AdminPermissions.GET, viewValue: 'Get'},
  {value: AdminPermissions.EDIT, viewValue: 'Edit'},
  {value: AdminPermissions.DELETE, viewValue: 'Delete'},
];

export const GENDERS: Select[] = [
  {value: 'male', viewValue: 'Male'},
  {value: 'female', viewValue: 'Female'},
  {value: 'other', viewValue: 'Other'}
];
export const DATA_BOOLEAN: Select[] = [
  {value: true, viewValue: 'Yes'},
  {value: false, viewValue: 'No'},
];

export const YEARS: Select[] = [
  {value: 2024, viewValue: '2024'},
  {value: 2023, viewValue: '2023'},
  {value: 2022, viewValue: '2022'},
];

export const REPORT_FILTER: Select[] = [
  // {value: 0, viewValue: 'Today'},
  {value: 1, viewValue: 'Last Day'},
  {value: 7, viewValue: 'Last 7 days'},
  {value: 15, viewValue: 'Last 15 days'},
  {value: 30, viewValue: 'Last 30 days'},
  {value: 60, viewValue: 'Last 60 days'},
  {value: 90, viewValue: 'Last 90 days'}
];

export const BOOKING_TIME: Select[] = [
  {value: 0, viewValue: 'Not Set'},
  {value: 1, viewValue: '1 Min'},
  {value: 2, viewValue: '2 Min'},
  {value: 60, viewValue: '1 Hours'},
  {value: 2 * 60, viewValue: '2 Hours'},
  {value: 3 * 60, viewValue: '3 Hours'},
  {value: 4 * 60, viewValue: '4 Hours'},
  {value: 5 * 60, viewValue: '5 Hours'},
  {value: 6 * 60, viewValue: '6 Hours'},
  {value: 12 * 60, viewValue: '12 Hours'},
  {value: 24 * 60, viewValue: '1 Day'},
  {value: 48 * 60, viewValue: '2 Day'},
  {value: 72 * 60, viewValue: '3 Day'},
];


export const DELIVERY_TYPE: Select[] = [
  { value: 'regular', viewValue: 'Regular Delivery'},
  { value: 'express', viewValue: 'Express Delivery'},
  { value: 'emergency', viewValue: 'Emergency Delivery'},
];

export const PRODUCT_STATUS: Select[] = [
  {value: 'draft', viewValue: 'Draft'},
  {value: 'publish', viewValue: 'Publish'},
];


export const TICKET_TYPES: Select[] = [
  {
    value: 'Booked',
    viewValue: 'Booked'
  },
  {
    value: 'Sold',
    viewValue: 'Issued'
  },
  {
    value: 'Canceled',
    viewValue: 'Canceled'
  },
];

export const DISCOUNT_TYPES: Select[] = [
  {
    value: 1,
    viewValue: 'Percentage'
  },
  {
    value: 2,
    viewValue: 'Cash'
  },
];

export const AMOUNT_TYPES: Select[] = [
  {
    value: 1,
    viewValue: 'Percentage'
  },
  {
    value: 2,
    viewValue: 'Amount'
  },
];

export const CITIES = ['Barisal', 'Bhairab', 'Bogra', 'Brahmanbaria', 'Chandpur', 'Chittagong', 'Chowmuhani', 'Chuadanga', 'Comilla', 'Cox\'s Bazar', 'Dhaka', 'Dinajpur', 'Faridpur', 'Feni', 'Gazipur', 'Jamalpur', 'Jessore', 'Jhenaidah', 'Kaliakair', 'Khulna', 'Kishoreganj', 'Kushtia', 'Maijdee', 'Manikganj', 'Mymensingh', 'Naogaon', 'Narayanganj', 'Narsingdi', 'Nawabganj', 'Pabna', 'Rajshahi', 'Rangpur', 'Saidpur', 'Satkhira', 'Savar', 'Siddhirganj', 'Sirajganj', 'Sreepur', 'Sylhet', 'Tangail', 'Tongi'];

export const PAYMENT_TYPES: Select[] = [
  { value: 'cash_on_delivery', viewValue: 'Cash On Delivery'},
  { value: 'bkash', viewValue: 'Bkash'},
  { value: 'rocket', viewValue: 'Rocket'},
  { value: 'nagad', viewValue: 'Nagad'},
  { value: 'credit_card', viewValue: 'Visa/Mastercard'},
];

export const  PAYMENT_STATUS: Select[] = [
  { value: 'unpaid', viewValue: 'Unpaid'},
  { value: 'paid', viewValue: 'Paid'},
];

export const ORDER_STATUS: Select[] = [
  { value: OrderStatus.PENDING, viewValue: 'Pending'},
  { value: OrderStatus.CONFIRM, viewValue: 'Confirm'},
  { value: OrderStatus.PROCESSING, viewValue: 'Processing'},
  { value: OrderStatus.SHIPPING, viewValue: 'Shipping'},
  { value: OrderStatus.DELIVERED, viewValue: 'Delivered'},
  { value: OrderStatus.CANCEL, viewValue: 'Cancel'},
  { value: OrderStatus.REFUND, viewValue: 'Refund'},
];


export const DELIVERY_TIMES: any[] =  [
  // {value: '8.30 am to 10.00 am', viewValue: '8.30 am to 10.00 am', end: 6},
  // {value: '10.00 am to 11.30 am', viewValue: '10.00 am to 11.30 am', end: 8},
  // {value: '11.30 am to 01.00 pm', viewValue: '11.30 am to 01.00 pm', end: 9},
  // {value: '01.00 pm to 02.30 pm', viewValue: '01.00 pm to 02.30 pm', end: 11},
  // {value: '02.30 pm to 04.00 pm', viewValue: '02.30 pm to 04.00 pm', end: 13},
  // {value: '04.00 pm to 05.30 pm', viewValue: '04.00 pm to 05.30 pm', end: 14},
  // {value: '05.30 pm to 07.00 pm', viewValue: '05.30 pm to 07.00 pm', end: 15},
  // {value: '07.00 pm to 08.30 pm', viewValue: '07.00 pm to 08.30 pm', end: 17},


  {value: '08:30 am-09:30 am', viewValue: '08:30 am-09:30 am', end: 6},
  {value: '09:30 am-10:30 am', viewValue: '09:30 am-10:30 am', end: 7},
  {value: '10:30 am-11:30 am', viewValue: '10:30 am-11:30 am', end: 8},
  {value: '11:30 am-12:30 pm', viewValue: '11:30 am-12:30 pm', end: 9},
  {value: '12:30 pm-01:30 pm', viewValue: '12:30 pm-01:30 pm', end: 10},
  {value: '01:30 pm-02:30 pm', viewValue: '01:30 pm-02:30 pm', end: 11},
  {value: '02:30 pm-03:30 pm', viewValue: '02:30 pm-03:30 pm', end: 12},
  {value: '03:30 pm-04:30 pm', viewValue: '03:30 pm-04:30 pm', end: 13},
  {value: '04:30 pm-05:30 pm', viewValue: '04:30 pm-05:30 pm', end: 14},
  {value: '05:30 pm-06:30 pm', viewValue: '05:30 pm-06:30 pm', end: 15},
  {value: '06:30 pm-07:30 pm', viewValue: '06:30 pm-07:30 pm', end: 16},
  {value: '07:30 pm-08:30 pm', viewValue: '07:30 pm-08:30 pm', end: 17},
  {value: '08:30 pm-09:30 pm', viewValue: '08:30 pm-09:30 pm', end: 18},
  {value: '11:30 pm-08:00 am', viewValue: '11:30 pm-08:00 am', end: 19},
];
export const defaultUploadImage = '/assets/images/avatar/image-upload.jpg';
export const VARIATION_IMG_PLACEHOLDER = '/assets/images/placeholder/image-pick-placeholder.png';
export const PDF_MAKE_LOGO = '/assets/images/logo/logo2.png';


export const MONTHS: Select[] = [
  {value: 1, viewValue: 'January'},
  {value: 2, viewValue: 'February'},
  {value: 3, viewValue: 'March'},
  {value: 4, viewValue: 'April'},
  {value: 5, viewValue: 'May'},
  {value: 6, viewValue: 'June'},
  {value: 7, viewValue: 'July'},
  {value: 8, viewValue: 'August'},
  {value: 9, viewValue: 'September'},
  {value: 10, viewValue: 'October'},
  {value: 11, viewValue: 'November'},
  {value: 12, viewValue: 'December'},
];




export const PAGE_TYPES: Select[] = [
  {value: 'home_page', viewValue: 'Home Page'},
  {value: 'contact_us_page', viewValue: 'Contact Us Page'},
  {value: 'product_list_page', viewValue: 'Product List Page'},
  {value: 'login_page', viewValue: 'Login Page'},
  {value: 'category_page', viewValue: 'Category Page'},
  {value: 'blog_page', viewValue: 'Blog Page'},
  {value: 'about_us_page', viewValue: 'About Us Page'},
];
