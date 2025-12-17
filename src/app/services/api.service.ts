import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${API_URL}${endpoint}`, { headers: this.headers });
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${API_URL}${endpoint}`, body, { headers: this.headers });
  }

  delete<T>(endpoint: string, body?: any): Observable<T> {
    return this.http.delete<T>(`${API_URL}${endpoint}`, { 
      headers: this.headers,
      body: body 
    });
  }
}


