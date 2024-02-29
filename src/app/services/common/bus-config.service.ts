import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { FilterData } from '../../interfaces/gallery/filter-data';
import { Observable } from "rxjs";
import { BusConfig } from "../../interfaces/common/bus-config.interface";
import { Product } from '../../interfaces/common/product.interface';

const API_COUNTER = environment.apiBaseLink + '/api/bus-config/';


@Injectable({
  providedIn: 'root'
})
export class BusConfigService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addBusConfig
   * insertManyBusConfig
   * getAllBusConfigs
   * getBusConfigById
   * updateBusConfigById
   * updateMultipleBusConfigById
   * deleteBusConfigById
   * deleteMultipleBusConfigById
   */


  addBusConfig(data: BusConfig): Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_COUNTER + 'add', data);
  }

  getAllBusConfig(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: BusConfig[], count: number, success: boolean }>(API_COUNTER + 'get-all/', filterData, { params });
  }

  getAllBasicBusConfig() {
    return this.httpClient.get<{ data: BusConfig[], count: number, success: boolean }>(API_COUNTER + 'get-all-basic');
  }


  getBusConfigById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: BusConfig, message: string, success: boolean }>(API_COUNTER + 'get-by/' + id, { params });
  }

  updateBusConfigById(id: string, data: BusConfig) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_COUNTER + 'update/' + id, data);
  }

  updateMultipleBusConfigById(ids: string[], data: Product) {
    const mData = { ...{ ids: ids }, ...data }
    return this.httpClient.put<ResponsePayload>(API_COUNTER + 'update-multiple', mData);
  }


  deleteBusConfigById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_COUNTER + 'delete/' + id, { params });
  }

  deleteMultipleBusConfigById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_COUNTER + 'delete-multiple', { ids: ids }, { params });
  }




}
