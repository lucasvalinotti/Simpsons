import { Injectable, signal } from '@angular/core';
import { FavoriteCharacter } from '../interfaces/FavoriteCharacter';


@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly localStorageKey = 'favorites_charactes';
  readonly favorites = signal<FavoriteCharacter[]>([]);

  constructor() {
    this.loadLocalStorage();
  }

  private loadLocalStorage(): void {
    try {
      const stored = localStorage.getItem(this.localStorageKey);
      if (!stored) return;

      const parsed: unknown = JSON.parse(stored);
      if (!Array.isArray(parsed) || !parsed.every((item) =>
        item && typeof item.id === 'number' && typeof item.name === 'string'
      )) {
        localStorage.removeItem(this.localStorageKey);
        return;
      }
      this.favorites.set(parsed as FavoriteCharacter[]);
    } catch {
      // Un valor viejo o corrupto no debe impedir agregar favoritos.
      try { localStorage.removeItem(this.localStorageKey); } catch { /* almacenamiento no disponible */ }
    }
  }

  toggleFavorites(character: FavoriteCharacter): void {
    this.favorites.update((favorites) => {
      const alreadyFavorite = favorites.some((c) => c.id === character.id);

      return alreadyFavorite
        ? favorites.filter((c) => c.id !== character.id)
        : [...favorites, character];
    });

    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.favorites()));
    } catch {
      // Si el navegador bloquea el almacenamiento, conserva el estado en memoria.
    }
  }

  isFavorite(id: number): boolean {
    return this.favorites().some((character) => character.id === id);
  }
}
