import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Access {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  doorId: number;
  doorName: string;
  doorLocation: string;
  grantedAt: string;
}

export interface AccessRequest {
  userId: number;
  doorId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AccessService {
  constructor(private apiService: ApiService) {}

  grantAccess(request: AccessRequest): Observable<Access> {
    return this.apiService.post<Access>('/access', request);
  }

  revokeAccess(request: AccessRequest): Observable<void> {
    return this.apiService.delete<void>('/access', request);
  }
}


