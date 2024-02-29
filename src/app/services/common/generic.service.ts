import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { Generic } from '../../interfaces/common/generic.interface';
import { FilterData } from '../../interfaces/gallery/filter-data';
import { Observable } from 'rxjs';

const API_NEW_EXPENSE = environment.apiBaseLink + '/api/generic/';

@Injectable({
  providedIn: 'root',
})
export class GenericService {
  constructor(private httpClient: HttpClient) {}

  /**
   * addGeneric
   * insertManyGeneric
   * getAllGenerics
   * getGenericById
   * updateGenericById
   * updateMultipleGenericById
   * deleteGenericById
   * deleteMultipleGenericById
   */

  addGeneric(data: Generic): Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_NEW_EXPENSE + 'add', data);
  }

  getAllGeneric(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{
      data: Generic[];
      count: number;
      success: boolean;
      calculation: any;
    }>(API_NEW_EXPENSE + 'get-all/', filterData, { params });
  }



  getGenericById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{
      data: Generic;
      message: string;
      success: boolean;
    }>(API_NEW_EXPENSE + id, { params });
  }

  updateGenericById(id: string, data: Generic) {
    return this.httpClient.put<{ message: string; success: boolean }>(
      API_NEW_EXPENSE + 'update/' + id,
      data
    );
  }

  // deleteGenericById(id: string) {
  //   return this.httpClient.delete<ResponsePayload>(API_NEW_EXPENSE + 'delete/' + id);
  // }

  deleteGenericById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(
      API_NEW_EXPENSE + 'delete/' + id,
      { params }
    );
  }

  deleteMultipleGenericById(ids: string[], checkUsage?: boolean) {
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

  //  genericGroupByField<T>(dataArray: T[], field: string): GenericGroup[] {
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
  //   return final as GenericGroup[];

  // }
}
