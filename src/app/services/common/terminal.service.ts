import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { FilterData } from '../../interfaces/gallery/filter-data';
import { Observable } from "rxjs";
import { Terminal } from 'src/app/interfaces/common/terminal.interface';

const API_TERMINAL = environment.apiBaseLink + '/api/terminal/';


@Injectable({
  providedIn: 'root'
})
export class TerminalService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addTerminal
   * insertManyTerminal
   * getAllTerminals
   * getTerminalById
   * updateTerminalById
   * updateMultipleTerminalById
   * deleteTerminalById
   * deleteMultipleTerminalById
   */


  addTerminal(data: Terminal): Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_TERMINAL + 'add', data);
  }

  getAllTerminal(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Terminal[], count: number, success: boolean }>(API_TERMINAL + 'get-all/', filterData, { params });
  }
  getAllBasicTerminal() {
    return this.httpClient.get<{ data: Terminal[], count: number, success: boolean }>(API_TERMINAL + 'get-all-basic');
  }

  getTerminalById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Terminal, message: string, success: boolean }>(API_TERMINAL +'get-by/'+id, { params });
  }

  updateTerminalById(id: string, data: Terminal) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_TERMINAL + 'update/' + id, data);
  }

  updateMultipleTerminalById(ids: string[], data: Terminal) {
    const mData = { ...{ ids: ids }, ...data }
    return this.httpClient.put<ResponsePayload>(API_TERMINAL + 'update-multiple', mData);
  }



  deleteTerminalById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_TERMINAL + 'delete/' + id, { params });
  }

  deleteMultipleTerminalById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_TERMINAL + 'delete-multiple', { ids: ids }, { params });
  }




}
