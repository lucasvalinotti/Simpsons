import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CharacterResponse } from '../interfaces/CharacterResponse';
import { Observable, of } from 'rxjs';
import { finalize, shareReplay, tap } from 'rxjs/operators';
import { CharacterByID } from '../interfaces/CharacterByIdResponse';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private readonly baseUrl = environment.baseUrl;
  private readonly http = inject(HttpClient);
  private readonly cache = new Map<number, CharacterResponse>();
  private readonly inFlight = new Map<number, Observable<CharacterResponse>>();

  getCachedPage(page: number): CharacterResponse | undefined {
    return this.cache.get(page);
  }

  getCachedCatalog(totalPages: number): CharacterResponse[] | null {
    const pages: CharacterResponse[] = [];
    for (let page = 1; page <= totalPages; page++) {
      const response = this.cache.get(page);
      if (!response) return null;
      pages.push(response);
    }
    return pages;
  }

  getCharacters(page: number): Observable<CharacterResponse> {
    const cached = this.cache.get(page);
    if (cached) return of(cached);

    const pending = this.inFlight.get(page);
    if (pending) return pending;

    const request = this.http.get<CharacterResponse>(`${this.baseUrl}/characters?page=${page}`).pipe(
      tap((response) => this.cache.set(page, response)),
      finalize(() => this.inFlight.delete(page)),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
    this.inFlight.set(page, request);
    return request;
  }

  getCharacterById(id: string) {
    return this.http.get<CharacterByID>(`${this.baseUrl}/characters/${id}`)
  }
}
