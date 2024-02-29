import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { FilterData } from '../../interfaces/gallery/filter-data';
import { Observable } from 'rxjs';
import {Type} from "../../interfaces/common/type.interface";

const API_NEW_EXPENSE = environment.apiBaseLink + '/api/type/';

@Injectable({
  providedIn: 'root',
})
export class TypeService {
  constructor(private httpClient: HttpClient) {}

  /**
   * addType
   * insertManyType
   * getAllTypes
   * getTypeById
   * updateTypeById
   * updateMultipleTypeById
   * deleteTypeById
   * deleteMultipleTypeById
   */

  addType(data: Type): Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_NEW_EXPENSE + 'add', data);
  }

  getAllType(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{
      data: Type[];
      count: number;
      success: boolean;
      calculation: any;
    }>(API_NEW_EXPENSE + 'get-all/', filterData, { params });
  }

  getTypeById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{
      data: Type;
      message: string;
      success: boolean;
    }>(API_NEW_EXPENSE + id, { params });
  }

  updateTypeById(id: string, data: Type) {
    return this.httpClient.put<{ message: string; success: boolean }>(
      API_NEW_EXPENSE + 'update/' + id,
      data
    );
  }

  // deleteTypeById(id: string) {
  //   return this.httpClient.delete<ResponsePayload>(API_NEW_EXPENSE + 'delete/' + id);
  // }

  deleteTypeById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(
      API_NEW_EXPENSE + 'delete/' + id,
      { params }
    );
  }

  deleteMultipleTypeById(ids: string[], checkUsage?: boolean) {
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

  //  typeGroupByField<T>(dataArray: T[], field: string): TypeGroup[] {
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
  //   return final as TypeGroup[];

  // }
}
