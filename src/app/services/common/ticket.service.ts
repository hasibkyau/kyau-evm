import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { FilterData } from '../../interfaces/gallery/filter-data';
import { Observable } from "rxjs";
import { Ticket } from "../../interfaces/common/ticket.interface";
import { Product } from '../../interfaces/common/product.interface';

const API_COUNTER = environment.apiBaseLink + '/api/ticket/';


@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addTicket
   * insertManyTicket
   * getAllTickets
   * getTicketById
   * updateTicketById
   * updateMultipleTicketById
   * deleteTicketById
   * deleteMultipleTicketById
   */


  addTicket(data: Ticket): Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_COUNTER + 'add', data);
  }

  getAllTicket(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Ticket[], count: number, success: boolean }>(API_COUNTER + 'get-all/', filterData, { params });
  }

  getAllBasicTicket() {
    return this.httpClient.get<{ data: Ticket[], count: number, success: boolean }>(API_COUNTER + 'get-all-basic');
  }


  getTicketById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Ticket, message: string, success: boolean }>(API_COUNTER + 'get-by/' + id, { params });
  }

  updateTicketById(id: string, data: Ticket) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_COUNTER + 'update/' + id, data);
  }

  updateMultipleTicketById(ids: string[], data: Product) {
    const mData = { ...{ ids: ids }, ...data }
    return this.httpClient.put<ResponsePayload>(API_COUNTER + 'update-multiple', mData);
  }


  deleteTicketById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_COUNTER + 'delete/' + id, { params });
  }

  deleteMultipleTicketById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_COUNTER + 'delete-multiple', { ids: ids }, { params });
  }




}
