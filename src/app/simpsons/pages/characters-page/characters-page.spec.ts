import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { FavoritesService } from '../../services/favorites.service';
import FavoritesPage from '../favorites-page/favorites-page';
import CharactersPage from './characters-page';

describe('favorite cards', () => {
  beforeEach(async () => {
    localStorage.removeItem('favorites_charactes');
    await TestBed.configureTestingModule({
      imports: [CharactersPage, FavoritesPage],
      providers: [provideZonelessChangeDetection(), provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
    localStorage.removeItem('favorites_charactes');
  });

  it('adds from the catalog and removes from the favorites page', () => {
    const catalog = TestBed.createComponent(CharactersPage);
    catalog.detectChanges();
    TestBed.inject(HttpTestingController).expectOne(`${environment.baseUrl}/characters?page=1`).flush({
      count: 1, pages: 1, next: '', prev: null,
      results: [{ id: 1, name: 'Homero Simpson', age: 39, birthdate: null,
        gender: 'Male', occupation: 'Inspector', portrait_path: '', phrases: [], status: 'Alive' }],
    });
    catalog.detectChanges();

    const catalogButton = catalog.nativeElement.querySelector('.favorite-button') as HTMLButtonElement;
    catalogButton.click();
    catalog.detectChanges();
    expect(catalogButton.getAttribute('aria-pressed')).toBe('true');
    expect(TestBed.inject(FavoritesService).isFavorite(1)).toBeTrue();

    const favorites = TestBed.createComponent(FavoritesPage);
    favorites.detectChanges();
    const favoriteButton = favorites.nativeElement.querySelector('.favorite-button') as HTMLButtonElement;
    expect(favoriteButton.getAttribute('aria-pressed')).toBe('true');

    favoriteButton.click();
    favorites.detectChanges();
    catalog.detectChanges();
    expect(favorites.nativeElement.querySelector('app-no-results-state')).toBeTruthy();
    expect(catalogButton.getAttribute('aria-pressed')).toBe('false');
  });
});
