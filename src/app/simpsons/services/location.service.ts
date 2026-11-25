import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LocationDetail, LocationResponse } from '../interfaces/LocationResponse';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  getLocations(page: number) {
    return this.http.get<LocationResponse>(`${this.baseUrl}/locations?page=${page}`);
  }

  getLocationById(id: number) {
    return this.http.get<LocationDetail>(`${this.baseUrl}/locations/${id}`);
  }
}
