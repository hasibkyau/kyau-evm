import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { FilterData } from '../../interfaces/gallery/filter-data';
import { Observable } from "rxjs";
import { RouteRelations } from "../../interfaces/common/route-relation.interface";
import { Product } from '../../interfaces/common/product.interface';

const API_COUNTER = environment.apiBaseLink + '/api/route-relation/';


@Injectable({
  providedIn: 'root'
})
export class RouteRelationService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addRouteRelation
   * insertManyRouteRelation
   * getAllRouteRelations
   * getRouteRelationById
   * updateRouteRelationById
   * updateMultipleRouteRelationById
   * deleteRouteRelationById
   * deleteMultipleRouteRelationById
   */


  addRouteRelation(data: RouteRelations): Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_COUNTER + 'add', data);
  }

  getAllRouteRelation(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: RouteRelations[], count: number, success: boolean }>(API_COUNTER + 'get-all/', filterData, { params });
  }

  getAllBasicRouteRelation() {
    return this.httpClient.get<{ data: RouteRelations[], count: number, success: boolean }>(API_COUNTER + 'get-all-basic');
  }


  getRouteRelationById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: RouteRelations, message: string, success: boolean }>(API_COUNTER + 'get-by/' + id, { params });
  }

  updateRouteRelationById(id: string, data: RouteRelations) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_COUNTER + 'update/' + id, data);
  }

  updateMultipleRouteRelationById(ids: string[], data: Product) {
    const mData = { ...{ ids: ids }, ...data }
    return this.httpClient.put<ResponsePayload>(API_COUNTER + 'update-multiple', mData);
  }


  deleteRouteRelationById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_COUNTER + 'delete/' + id, { params });
  }

  deleteMultipleRouteRelationById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_COUNTER + 'delete-multiple', { ids: ids }, { params });
  }




}
