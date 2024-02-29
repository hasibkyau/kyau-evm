import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { FilterData } from '../../interfaces/gallery/filter-data';
import { Observable } from "rxjs";
import { BusGallery } from "../../interfaces/common/bus-gallery.interface";
import { Product } from '../../interfaces/common/product.interface';

const API_CATEGORY = environment.apiBaseLink + '/api/busGallery/';


@Injectable({
  providedIn: 'root'
})
export class BusGalleryService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addBusGallery
   * insertManyBusGallery
   * getAllBusGallerys
   * getBusGalleryById
   * updateBusGalleryById
   * updateMultipleBusGalleryById
   * deleteBusGalleryById
   * deleteMultipleBusGalleryById
   */

  // getAllCategories(filterData: FilterData, searchQuery?: string) {
  //   let params = new HttpParams();
  //   if (searchQuery) {
  //     params = params.append('q', searchQuery);
  //   }
  //   return this.httpClient.post<{ data: BusGallery[], count: number, success: boolean }>(API_SUB_CATEGORY + 'get-all', filterData, {params});
  // }

  addBusGallery(data: BusGallery): Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_CATEGORY + 'add', data);
  }

  getAllBusGallery(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: BusGallery[], count: number, success: boolean }>(API_CATEGORY + 'get-all/', filterData, { params });
  }

  getBusGalleryById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: BusGallery, message: string, success: boolean }>(API_CATEGORY + id, { params });
  }

  updateBusGalleryById(id: string, data: BusGallery) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_CATEGORY + 'update/' + id, data);
  }

  updateMultipleBusGalleryById(ids: string[], data: Product) {
    const mData = { ...{ ids: ids }, ...data }
    return this.httpClient.put<ResponsePayload>(API_CATEGORY + 'update-multiple', mData);
  }


  // deleteBusGalleryById(id: string) {
  //   return this.httpClient.delete<ResponsePayload>(API_CATEGORY + 'delete/' + id);
  // }

  deleteBusGalleryById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_CATEGORY + 'delete/' + id, { params });
  }

  deleteMultipleBusGalleryById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_CATEGORY + 'delete-multiple', { ids: ids }, { params });
  }




}
