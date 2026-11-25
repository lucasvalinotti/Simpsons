import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { FavoriteCharacter } from '../../interfaces/FavoriteCharacter';
import FavoritesPage from './favorites-page';

describe('FavoritesPage', () => {
  const key = 'favorites_charactes';
  const favorites: FavoriteCharacter[] = Array.from({ length: 25 }, (_, index) => ({
    id: index + 1,
    name: `Personaje ${index + 1}`,
    occupation: 'Vecino',
    portrait_path: '',
    status: index % 2 === 0 ? 'Alive' : 'Dead',
    gender: index % 2 === 0 ? 'Female' : 'Male',
  }));

  beforeEach(async () => {
    localStorage.setItem(key, JSON.stringify(favorites));
    await TestBed.configureTestingModule({
      imports: [FavoritesPage],
      providers: [provideZonelessChangeDetection(), provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
    localStorage.removeItem(key);
  });

  it('paginates stored favorites and clamps the page after removals', () => {
    const fixture = TestBed.createComponent(FavoritesPage);
    fixture.detectChanges();
    const page = fixture.componentInstance;

    expect(page.totalPages()).toBe(2);
    expect(page.visibleFavorites().length).toBe(20);
    page.changePage(2);
    fixture.detectChanges();
    expect(page.visibleFavorites().length).toBe(5);
    expect(page.firstResult()).toBe(21);
    expect(page.lastResult()).toBe(25);

    favorites.slice(20).forEach((favorite) => page.toggleFavorite(favorite));
    fixture.detectChanges();
    expect(page.totalPages()).toBe(1);
    expect(page.page()).toBe(1);
    expect(page.currentPage()).toBe(1);
    expect(page.visibleFavorites().length).toBe(20);
  });

  it('filters by name, status and gender and resets to page one', () => {
    const fixture = TestBed.createComponent(FavoritesPage);
    fixture.detectChanges();
    const page = fixture.componentInstance;
    page.changePage(2);
    page.updateFilters({ name: 'personaje 1', status: 'Vivo', gender: 'Femenino' });
    fixture.detectChanges();

    expect(page.currentPage()).toBe(1);
    expect(page.filteredFavorites().map((favorite) => favorite.id)).toEqual([1, 11, 13, 15, 17, 19]);
    expect(page.totalPages()).toBe(1);
    expect(fixture.nativeElement.querySelectorAll('app-character-card').length).toBe(6);

    page.updateFilters({ name: '', status: '', gender: '' });
    expect(page.totalMatches()).toBe(25);
    expect(page.currentPage()).toBe(1);
  });

  it('fills missing gender in older saved favorites and retries a failed lookup', () => {
    const legacy = { ...favorites[0], gender: undefined };
    localStorage.setItem(key, JSON.stringify([legacy]));
    const fixture = TestBed.createComponent(FavoritesPage);
    fixture.detectChanges();
    const page = fixture.componentInstance;
    const http = TestBed.inject(HttpTestingController);

    page.updateFilters({ name: '', status: '', gender: 'Femenino' });
    fixture.detectChanges();
    expect(page.needsGender()).toBeTrue();
    expect(fixture.nativeElement.textContent).toContain('Preparando filtro de género');

    http.expectOne(`${environment.baseUrl}/characters/1`).flush('error', { status: 500, statusText: 'Error' });
    fixture.detectChanges();
    expect(page.genderLoadState()).toBe('error');
    expect(fixture.nativeElement.querySelector('app-error-state')).toBeTruthy();

    page.prepareGender();
    http.expectOne(`${environment.baseUrl}/characters/1`).flush({ id: 1, gender: 'Female' });
    fixture.detectChanges();
    expect(page.needsGender()).toBeFalse();
    expect(page.filteredFavorites().map((favorite) => favorite.id)).toEqual([1]);
    expect(JSON.parse(localStorage.getItem(key) ?? '')[0].gender).toBe('Female');
  });
});
