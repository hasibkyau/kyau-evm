import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { FilterData } from '../../interfaces/gallery/filter-data';
import { Observable } from "rxjs";
import { Routes } from "../../interfaces/common/route.interface";
import { Product } from '../../interfaces/common/product.interface';

const API_COUNTER = environment.apiBaseLink + '/api/route/';


@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addRoute
   * insertManyRoute
   * getAllRoutes
   * getRouteById
   * updateRouteById
   * updateMultipleRouteById
   * deleteRouteById
   * deleteMultipleRouteById
   */


  addRoute(data: Routes): Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_COUNTER + 'add', data);
  }

  getAllRoute(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Routes[], count: number, success: boolean }>(API_COUNTER + 'get-all/', filterData, { params });
  }

  getAllBasicRoute() {
    return this.httpClient.get<{ data: Routes[], count: number, success: boolean }>(API_COUNTER + 'get-all-basic');
  }


  getRouteById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Routes, message: string, success: boolean }>(API_COUNTER + 'get-by/' + id, { params });
  }

  updateRouteById(id: string, data: Routes) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_COUNTER + 'update/' + id, data);
  }

  updateMultipleRouteById(ids: string[], data: Product) {
    const mData = { ...{ ids: ids }, ...data }
    return this.httpClient.put<ResponsePayload>(API_COUNTER + 'update-multiple', mData);
  }


  deleteRouteById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_COUNTER + 'delete/' + id, { params });
  }

  deleteMultipleRouteById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_COUNTER + 'delete-multiple', { ids: ids }, { params });
  }




}
