import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { FilterData } from '../../interfaces/gallery/filter-data';
import { Observable } from "rxjs";
import { Bus } from "../../interfaces/common/bus.interface";
import { Product } from '../../interfaces/common/product.interface';

const API_COUNTER = environment.apiBaseLink + '/api/bus/';


@Injectable({
  providedIn: 'root'
})
export class BusService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addBus
   * insertManyBus
   * getAllBuss
   * getBusById
   * updateBusById
   * updateMultipleBusById
   * deleteBusById
   * deleteMultipleBusById
   */


  addBus(data: Bus): Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_COUNTER + 'add', data);
  }

  getAllBus(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Bus[], count: number, success: boolean }>(API_COUNTER + 'get-all/', filterData, { params });
  }

  getAllBasicBus() {
    return this.httpClient.get<{ data: Bus[], count: number, success: boolean }>(API_COUNTER + 'get-all-basic');
  }


  getBusById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Bus, message: string, success: boolean }>(API_COUNTER + 'get-by/' + id, { params });
  }

  updateBusById(id: string, data: Bus) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_COUNTER + 'update/' + id, data);
  }

  updateMultipleBusById(ids: string[], data: Product) {
    const mData = { ...{ ids: ids }, ...data }
    return this.httpClient.put<ResponsePayload>(API_COUNTER + 'update-multiple', mData);
  }


  deleteBusById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_COUNTER + 'delete/' + id, { params });
  }

  deleteMultipleBusById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_COUNTER + 'delete-multiple', { ids: ids }, { params });
  }




}
