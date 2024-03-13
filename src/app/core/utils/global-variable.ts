import {environment} from '../../../environments/environment';

export const DATABASE_KEY = Object.freeze({
  loginToken: 'MKSHIPPING_TRAVELS_TOKEN_' + environment.VERSION,
  loggInSession: 'MKSHIPPING_TRAVELS_SESSION_' + environment.VERSION,
  loginTokenAdmin: 'MKSHIPPING_TRAVELS_ADMIN_TOKEN_' + environment.VERSION,
  loggInSessionAdmin: 'MKSHIPPING_TRAVELS_ADMIN_SESSION_' + environment.VERSION,
  encryptAdminLogin: 'MKSHIPPING_TRAVELS_USER_0_' + environment.VERSION,
  encryptUserLogin: 'MKSHIPPING_TRAVELS_USER_1_' + environment.VERSION,
  loginAdminRole: 'MKSHIPPING_TRAVELS_ADMIN_ROLE_' + environment.VERSION,
  cartsProduct: 'MKSHIPPING_TRAVELS_USER_CART_' + environment.VERSION,
  productFormData: 'MKSHIPPING_TRAVELS_PRODUCT_FORM_' + environment.VERSION,
  userCart: 'MKSHIPPING_TRAVELS_USER_CART_' + environment.VERSION,
  recommendedProduct: 'MKSHIPPING_TRAVELS_RECOMMENDED_PRODUCT_' + environment.VERSION,
  userCoupon: 'MKSHIPPING_TRAVELS_USER_COUPON_' + environment.VERSION,
  userCookieTerm: 'MKSHIPPING_TRAVELS_COOKIE_TERM' + environment.VERSION,
});
