import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {Cart} from '../../interfaces/common/cart.interface';
import {FilterData} from '../../interfaces/gallery/filter-data';
import {Observable} from 'rxjs';

const API_URL = environment.apiBaseLink + '/api/cart/';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addCart
   * insertManyCart
   * getAllCarts
   * getCartById
   * updateCartById
   * updateMultipleCartById
   * deleteCartById
   * deleteMultipleCartById
   */

  addCart(data: Cart): Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_URL + 'add', data);
  }

  getCartByTrip(data: {user: string, trip: string}) {
    return this.httpClient.post<{ data: Cart[], count: number, success: boolean }>(API_URL + 'get-by-trip', data)
  }




  getAllCarts(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{
      data: Cart[],
      count: number,
      success: boolean
    }>(API_URL + 'get-all/', filterData, {params});
  }

  getCartById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{
      data: Cart,
      message: string,
      success: boolean
    }>(API_URL + 'get-all-carts-by-user/' + id, {params});
  }

  updateCartById(id: string, data: Cart) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_URL + 'update/' + id, data);
  }

  deleteCartById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_URL + 'delete/' + id, {params});
  }

  deleteMultipleCartById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_URL + 'delete-multiple', {ids: ids}, {params});
  }

  cleanCartByUser() {
    return this.httpClient.delete<ResponsePayload>(API_URL + 'delete-cart-by-user');
  }

  // cartGroupByField<T>(dataArray: T[], field: string): CartGroup[] {
  //   const data = dataArray.reduce((group, product) => {
  //     const uniqueField = product[field]
  //     group[uniqueField] = group[uniqueField] ?? [];
  //     group[uniqueField].push(product);
  //     return group;
  //   }, {});
  //
  //   const final = [];
  //
  //   for (const key in data) {
  //     final.push({
  //       _id: key,
  //       data: data[key]
  //     })
  //   }
  //
  //   return final as CartGroup[];

  // }


}
