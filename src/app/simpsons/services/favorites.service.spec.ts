import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FavoriteCharacter } from '../interfaces/FavoriteCharacter';
import { FavoritesService } from './favorites.service';

describe('FavoritesService', () => {
  const key = 'favorites_charactes';
  const homer: FavoriteCharacter = {
    id: 1, name: 'Homero Simpson', occupation: 'Inspector',
    portrait_path: '/homer.png', status: 'Alive',
  };

  beforeEach(() => {
    localStorage.removeItem(key);
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  afterEach(() => localStorage.removeItem(key));

  it('recovers from the invalid value saved by the old implementation', () => {
    localStorage.setItem(key, 'undefined');
    const service = TestBed.inject(FavoritesService);

    expect(service.favorites()).toEqual([]);
    service.toggleFavorites(homer);
    expect(service.isFavorite(homer.id)).toBeTrue();
    expect(JSON.parse(localStorage.getItem(key) ?? '')).toEqual([homer]);

    service.toggleFavorites(homer);
    expect(service.isFavorite(homer.id)).toBeFalse();
    expect(JSON.parse(localStorage.getItem(key) ?? '')).toEqual([]);
  });

  it('loads saved favorites when the service starts', () => {
    localStorage.setItem(key, JSON.stringify([homer]));
    const service = TestBed.inject(FavoritesService);

    expect(service.favorites()).toEqual([homer]);
    expect(service.isFavorite(homer.id)).toBeTrue();
  });
});
