import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {PrescriptionOrder} from '../../interfaces/common/prescription-order';
import {FilterData} from '../../interfaces/core/filter-data';

const API_ORDER = environment.apiBaseLink + '/api/prescription-order/';


@Injectable({
  providedIn: 'root'
})
export class PrescriptionOrderService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addPrescriptionOrder
   * insertManyPrescriptionOrder
   * getAllPrescriptionOrders
   * getPrescriptionOrderById
   * updatePrescriptionOrderById
   * updateMultiplePrescriptionOrderById
   * deletePrescriptionOrderById
   * deleteMultiplePrescriptionOrderById
   */

  addPrescriptionOrder(data: PrescriptionOrder) {
    return this.httpClient.post<ResponsePayload>
    (API_ORDER + 'add', data);
  }

  insertManyPrescriptionOrder(data: PrescriptionOrder, option?: any) {
    const mData = {data, option}
    return this.httpClient.post<ResponsePayload>
    (API_ORDER + 'insert-many', mData);
  }

  getAllPrescriptionOrders(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: PrescriptionOrder[], count: number, success: boolean }>(API_ORDER + 'get-all', filterData, {params});
  }

  getPrescriptionOrderById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: PrescriptionOrder, message: string, success: boolean }>(API_ORDER + id, {params});
  }

  updatePrescriptionOrderById(id: string, data: PrescriptionOrder) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_ORDER + 'update/' + id, data);
  }

  changePrescriptionOrderStatus(id: string, data: any) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_ORDER + 'change-status/' + id, data);
  }

  updateMultiplePrescriptionOrderById(ids: string[], data: PrescriptionOrder) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_ORDER + 'update-multiple', mData);
  }

  deletePrescriptionOrderById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_ORDER + 'delete/' + id, {params});
  }

  deleteMultiplePrescriptionOrderById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_ORDER + 'delete-multiple', {ids: ids}, {params});
  }


}
