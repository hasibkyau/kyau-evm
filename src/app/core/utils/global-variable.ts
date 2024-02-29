import {environment} from '../../../environments/environment';

export const DATABASE_KEY = Object.freeze({
  loginToken: 'SHAZADPUR_TRAVELS_TOKEN_' + environment.VERSION,
  loggInSession: 'SHAZADPUR_TRAVELS_SESSION_' + environment.VERSION,
  loginTokenAdmin: 'SHAZADPUR_TRAVELS_ADMIN_TOKEN_' + environment.VERSION,
  loggInSessionAdmin: 'SHAZADPUR_TRAVELS_ADMIN_SESSION_' + environment.VERSION,
  encryptAdminLogin: 'SHAZADPUR_TRAVELS_USER_0_' + environment.VERSION,
  encryptUserLogin: 'SHAZADPUR_TRAVELS_USER_1_' + environment.VERSION,
  loginAdminRole: 'SHAZADPUR_TRAVELS_ADMIN_ROLE_' + environment.VERSION,
  cartsProduct: 'SHAZADPUR_TRAVELS_USER_CART_' + environment.VERSION,
  productFormData: 'SHAZADPUR_TRAVELS_PRODUCT_FORM_' + environment.VERSION,
  userCart: 'SHAZADPUR_TRAVELS_USER_CART_' + environment.VERSION,
  recommendedProduct: 'SHAZADPUR_TRAVELS_RECOMMENDED_PRODUCT_' + environment.VERSION,
  userCoupon: 'SHAZADPUR_TRAVELS_USER_COUPON_' + environment.VERSION,
  userCookieTerm: 'SHAZADPUR_TRAVELS_COOKIE_TERM' + environment.VERSION,
});
