import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {RequestMedicine} from '../../interfaces/common/request-medicine';
import {FilterData} from '../../interfaces/core/filter-data';

const API_ORDER = environment.apiBaseLink + '/api/request-medicine/';


@Injectable({
  providedIn: 'root'
})
export class RequestMedicineService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addRequestMedicine
   * insertManyRequestMedicine
   * getAllRequestMedicines
   * getRequestMedicineById
   * updateRequestMedicineById
   * updateMultipleRequestMedicineById
   * deleteRequestMedicineById
   * deleteMultipleRequestMedicineById
   */

  addRequestMedicine(data: RequestMedicine) {
    return this.httpClient.post<ResponsePayload>
    (API_ORDER + 'add', data);
  }

  insertManyRequestMedicine(data: RequestMedicine, option?: any) {
    const mData = {data, option}
    return this.httpClient.post<ResponsePayload>
    (API_ORDER + 'insert-many', mData);
  }

  getAllRequestMedicines(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: RequestMedicine[], count: number, success: boolean }>(API_ORDER + 'get-all', filterData, {params});
  }

  getRequestMedicineById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: RequestMedicine, message: string, success: boolean }>(API_ORDER + id, {params});
  }

  updateRequestMedicineById(id: string, data: RequestMedicine) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_ORDER + 'update/' + id, data);
  }

  changeRequestMedicineStatus(id: string, data: any) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_ORDER + 'change-status/' + id, data);
  }

  updateMultipleRequestMedicineById(ids: string[], data: RequestMedicine) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_ORDER + 'update-multiple', mData);
  }

  deleteRequestMedicineById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_ORDER + 'delete/' + id, {params});
  }

  deleteMultipleRequestMedicineById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_ORDER + 'delete-multiple', {ids: ids}, {params});
  }


}
