import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { EpisodeDetail, EpisodeResponse } from '../interfaces/EpisodeResponse';

@Injectable({ providedIn: 'root' })
export class EpisodeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  getEpisodes(page: number) {
    return this.http.get<EpisodeResponse>(`${this.baseUrl}/episodes?page=${page}`);
  }

  getEpisodeById(id: number) {
    return this.http.get<EpisodeDetail>(`${this.baseUrl}/episodes/${id}`);
  }
}
