import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface UserRequest {
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService) {}

  getAllUsers(): Observable<User[]> {
    return this.apiService.get<User[]>('/users');
  }

  getUserById(id: number): Observable<User> {
    return this.apiService.get<User>(`/users/${id}`);
  }

  createUser(user: UserRequest): Observable<User> {
    return this.apiService.post<User>('/users', user);
  }
}


