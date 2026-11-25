import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CharacterResponse } from '../interfaces/CharacterResponse';
import { CharacterService } from './character.service';

describe('CharacterService', () => {
  let service: CharacterService;
  let http: HttpTestingController;
  const response = (page: number): CharacterResponse => ({
    count: 40, pages: 2, next: '', prev: null, results: [{
      id: page, name: `Personaje ${page}`, age: null, birthdate: null,
      gender: 'Male', occupation: '', portrait_path: '', phrases: [], status: 'Alive',
    }],
  });

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(CharacterService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('shares an in-flight page request and then serves the cached response', () => {
    const received: CharacterResponse[] = [];
    service.getCharacters(1).subscribe((value) => received.push(value));
    service.getCharacters(1).subscribe((value) => received.push(value));

    const requests = http.match(`${environment.baseUrl}/characters?page=1`);
    expect(requests.length).toBe(1);
    requests[0].flush(response(1));
    expect(received.length).toBe(2);
    expect(service.getCachedPage(1)?.results[0].id).toBe(1);

    service.getCharacters(1).subscribe((value) => received.push(value));
    http.expectNone(`${environment.baseUrl}/characters?page=1`);
    expect(received.length).toBe(3);
  });

  it('retries failed pages without losing successful pages', () => {
    service.getCharacters(1).subscribe();
    http.expectOne(`${environment.baseUrl}/characters?page=1`).flush(response(1));

    service.getCharacters(2).subscribe({ error: () => {} });
    http.expectOne(`${environment.baseUrl}/characters?page=2`).flush('error', { status: 500, statusText: 'Error' });
    expect(service.getCachedCatalog(2)).toBeNull();
    expect(service.getCachedPage(1)).toBeTruthy();

    service.getCharacters(2).subscribe();
    http.expectOne(`${environment.baseUrl}/characters?page=2`).flush(response(2));
    expect(service.getCachedCatalog(2)?.length).toBe(2);
  });
});
