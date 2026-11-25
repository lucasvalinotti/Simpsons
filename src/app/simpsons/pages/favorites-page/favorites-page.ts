import { Component, computed, inject, signal } from '@angular/core';
import { EMPTY, catchError, from, mergeMap, tap } from 'rxjs';
import { CharacterCard } from '../../components/character-card/character-card';
import { CharacterFilters, CharacterFiltersValue } from '../../components/character-filters/character-filters';
import { CharacterPagination } from '../../components/character-pagination/character-pagination';
import { ErrorState } from '../../components/error-state/error-state';
import { NoResultsState } from '../../components/no-results-state/no-results-state';
import { CharacterService } from '../../services/character.service';
import { FavoritesService } from '../../services/favorites.service';
import { FavoriteCharacter } from '../../interfaces/FavoriteCharacter';


@Component({
  selector: 'app-favorites-page',
  imports: [CharacterCard, CharacterFilters, CharacterPagination, ErrorState, NoResultsState],
  templateUrl: './favorites-page.html',
  styleUrl: './favorites-page.css',
})
export default class FavoritesPage {
  readonly favoritesService = inject(FavoritesService);
  private readonly characterService = inject(CharacterService);
  private readonly pageSize = 20;
  private genderRequestRunning = false;
  readonly filters = signal<CharacterFiltersValue>({ name: '', status: '', gender: '' });
  readonly page = signal(1);
  readonly genderLoadState = signal<'idle' | 'loading' | 'error'>('idle');
  readonly needsGender = computed(() => !!this.filters().gender &&
    this.favoritesService.favorites().some((favorite) => !favorite.gender?.trim()));

  readonly filteredFavorites = computed(() => {
    const { name, status, gender } = this.filters();
    const search = name.trim().toLocaleLowerCase('es');
    return this.favoritesService.favorites().filter((favorite) =>
      favorite.name.toLocaleLowerCase('es').includes(search) &&
      (!status || this.displayStatus(favorite) === status) &&
      (!gender || this.displayGender(favorite) === gender)
    );
  });
  readonly totalMatches = computed(() => this.filteredFavorites().length);
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.totalMatches() / this.pageSize)));
  readonly currentPage = computed(() => Math.min(this.page(), this.totalPages()));
  readonly visibleFavorites = computed(() => this.filteredFavorites().slice(
    (this.currentPage() - 1) * this.pageSize, this.currentPage() * this.pageSize
  ));
  readonly firstResult = computed(() => this.visibleFavorites().length
    ? (this.currentPage() - 1) * this.pageSize + 1 : 0);
  readonly lastResult = computed(() => this.visibleFavorites().length
    ? Math.min(this.currentPage() * this.pageSize, this.totalMatches()) : 0);

  updateFilters(filters: CharacterFiltersValue): void {
    this.filters.set(filters);
    this.page.set(1);
    if (filters.gender) this.prepareGender();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) this.page.set(page);
  }

  toggleFavorite(favorite: FavoriteCharacter): void {
    this.favoritesService.toggleFavorites(favorite);
    this.page.update((page) => Math.min(page, this.totalPages()));
  }

  prepareGender(): void {
    if (this.genderRequestRunning) return;
    const missing = this.favoritesService.favorites().filter((favorite) => !favorite.gender?.trim());
    if (!missing.length) {
      this.genderLoadState.set('idle');
      return;
    }

    this.genderRequestRunning = true;
    this.genderLoadState.set('loading');
    from(missing).pipe(
      mergeMap((favorite) => this.characterService.getCharacterById(String(favorite.id)).pipe(
        tap((character) => this.favoritesService.updateGender(favorite.id, character.gender)),
        catchError(() => EMPTY),
      ), 3),
    ).subscribe({
      complete: () => {
        this.genderRequestRunning = false;
        this.genderLoadState.set(this.favoritesService.favorites().some((favorite) => !favorite.gender?.trim())
          ? 'error' : 'idle');
      },
    });
  }

  private displayStatus(favorite: FavoriteCharacter): string {
    if (favorite.status === 'Alive') return 'Vivo';
    if (favorite.status === 'Dead' || favorite.status === 'Deceased') return 'Fallecido';
    return favorite.status;
  }

  private displayGender(favorite: FavoriteCharacter): string {
    if (favorite.gender === 'Male') return 'Masculino';
    if (favorite.gender === 'Female') return 'Femenino';
    return favorite.gender ?? 'Desconocido';
  }
}
