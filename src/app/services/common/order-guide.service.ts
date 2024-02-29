import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { OrderGuide } from '../../interfaces/common/order-guide.interface';
import { FilterData } from '../../interfaces/gallery/filter-data';
import { Observable } from 'rxjs';

const API_NEW_EXPENSE = environment.apiBaseLink + '/api/order-guide/';

@Injectable({
  providedIn: 'root',
})
export class OrderGuideService {
  constructor(private httpClient: HttpClient) {}

  /**
   * addOrderGuide
   * insertManyOrderGuide
   * getAllOrderGuides
   * getOrderGuideById
   * updateOrderGuideById
   * updateMultipleOrderGuideById
   * deleteOrderGuideById
   * deleteMultipleOrderGuideById
   */

  addOrderGuide(data: OrderGuide): Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_NEW_EXPENSE + 'add', data);
  }

  getAllOrderGuide(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{
      data: OrderGuide[];
      count: number;
      success: boolean;
      calculation: any;
    }>(API_NEW_EXPENSE + 'get-all/', filterData, { params });
  }

  getOrderGuideById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{
      data: OrderGuide;
      message: string;
      success: boolean;
    }>(API_NEW_EXPENSE + id, { params });
  }

  updateOrderGuideById(id: string, data: OrderGuide) {
    return this.httpClient.put<{ message: string; success: boolean }>(
      API_NEW_EXPENSE + 'update/' + id,
      data
    );
  }

  // deleteOrderGuideById(id: string) {
  //   return this.httpClient.delete<ResponsePayload>(API_NEW_EXPENSE + 'delete/' + id);
  // }

  deleteOrderGuideById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(
      API_NEW_EXPENSE + 'delete/' + id,
      { params }
    );
  }

  deleteMultipleOrderGuideById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(
      API_NEW_EXPENSE + 'delete-multiple',
      { ids: ids },
      { params }
    );
  }

  //  orderGuideGroupByField<T>(dataArray: T[], field: string): OrderGuideGroup[] {
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
  //   return final as OrderGuideGroup[];

  // }
}
