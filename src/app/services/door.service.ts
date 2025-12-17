import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Access } from './access.service';

export interface Door {
  id: number;
  name: string;
  location: string;
  createdAt: string;
}

export interface DoorRequest {
  name: string;
  location: string;
}

@Injectable({
  providedIn: 'root'
})
export class DoorService {
  constructor(private apiService: ApiService) {}

  getAllDoors(): Observable<Door[]> {
    return this.apiService.get<Door[]>('/doors');
  }

  getDoorById(id: number): Observable<Door> {
    return this.apiService.get<Door>(`/doors/${id}`);
  }

  createDoor(door: DoorRequest): Observable<Door> {
    return this.apiService.post<Door>('/doors', door);
  }

  getUsersByDoorId(doorId: number): Observable<Access[]> {
    return this.apiService.get<Access[]>(`/doors/${doorId}/users`);
  }
}


