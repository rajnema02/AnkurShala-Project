import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  // API_URL = '//'+window.location.host;
  API_URL = '//'+window.location.host + '/api';
  // API_URL = 'https://parking.sensecure.in';

  constructor(
    private http: HttpClient
  ) { }

  get(url: string, options?: any) {
    return this.http.get(`${this.API_URL}/${url}`, options);
  }

  post(url: string, body: any, options?: any) {
    return this.http.post(`${this.API_URL}/${url}`, body, options);
  }

  put(url: string, body: any, options?: any) {
    return this.http.put(`${this.API_URL}/${url}`, body, options);
  }

  delete(url: string, options?: any) {
    return this.http.delete(`${this.API_URL}/${url}`, options);
  }

  patch(url: string, body: any, options?: any) {
    return this.http.patch(`${this.API_URL}/${url}`, body, options);
  }
}
