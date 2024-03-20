import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { FilterData } from '../../interfaces/gallery/filter-data';
import { Observable } from "rxjs";
import { Trip } from "../../interfaces/common/trip.interface";
import { Product } from '../../interfaces/common/product.interface';
import {BusConfig} from '../../interfaces/common/bus-config.interface';

const API_URL = environment.apiBaseLink + '/api/trip/';


@Injectable({
  providedIn: 'root'
})
export class TripService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addTrip
   * insertManyTrip
   * getAllTrips
   * getTripById
   * updateTripById
   * updateMultipleTripById
   * deleteTripById
   * deleteMultipleTripById
   */


  addTrip(data: Trip): Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_URL + 'add', data);
  }

  bookTrip(data: any): Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_URL + 'book-trip', data);
  }

  updateBookedTrip(ticketId: string, data: any): Observable<ResponsePayload> {
    return this.httpClient.put<ResponsePayload>(API_URL + 'update-booked-trip/'+ ticketId, data);
  }


  getAllTrip(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Trip[], count: number, success: boolean }>(API_URL + 'get-all/', filterData, { params });
  }

  getFilteredConfigForTrips(filter: any) {
    return this.httpClient.get<{ data: BusConfig[], count: number, success: boolean }>(API_URL + 'get-filtered-bus-config');
  }


  getTripById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Trip, message: string, success: boolean }>(API_URL + 'get-by/' + id, { params });
  }

  getTripSheetById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Trip, message: string, success: boolean }>(API_URL + 'get-trip-sheet-by-trip/' + id, { params });
  }

  updateTripById(id: string, data: Trip) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_URL + 'update/' + id, data);
  }

  updateMultipleTripById(ids: string[], data: Product) {
    const mData = { ...{ ids: ids }, ...data }
    return this.httpClient.put<ResponsePayload>(API_URL + 'update-multiple', mData);
  }


  deleteTripById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_URL + 'delete/' + id, { params });
  }

  deleteMultipleTripById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_URL + 'delete-multiple', { ids: ids }, { params });
  }




}
