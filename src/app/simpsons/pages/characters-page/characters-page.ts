import { Component, computed, inject, signal } from '@angular/core';
import { catchError, from, map, mergeMap, of, toArray } from 'rxjs';
import { CharacterCard } from '../../components/character-card/character-card';
import { CharacterFilters, CharacterFiltersValue } from '../../components/character-filters/character-filters';
import { CharacterPagination } from '../../components/character-pagination/character-pagination';
import { NoResultsState } from '../../components/no-results-state/no-results-state';
import { ErrorState } from '../../components/error-state/error-state';
import { FavoritesService } from '../../services/favorites.service';
import { CharacterService } from '../../services/character.service';
import { Character, CharacterResponse, Result } from '../../interfaces/CharacterResponse';
import { FavoriteCharacter } from '../../interfaces/FavoriteCharacter';

@Component({
  selector: 'app-characters-page',
  imports: [CharacterCard, CharacterFilters, CharacterPagination, NoResultsState, ErrorState],
  templateUrl: './characters-page.html',
  styleUrl: './characters-page.css',
})
export default class CharactersPage {
  private readonly characterService = inject(CharacterService);
  readonly favorites = inject(FavoritesService);
  private readonly pageSize = 20;
  private preloadRunning = false;
  private readonly cacheRevision = signal(0);
  readonly metadataLoaded = signal(false);
  private readonly currentResponse = signal<CharacterResponse | null>(null);
  readonly loading = signal(true);
  readonly loadError = signal(false);
  readonly catalogState = signal<'loading' | 'error' | 'complete'>('loading');
  readonly filters = signal<CharacterFiltersValue>({ name: '', status: '', gender: '' });
  readonly apiPages = signal(1);
  readonly totalCharacters = signal(0);
  readonly page = signal(1);

  readonly hasActiveFilters = computed(() => Object.values(this.filters()).some((value) => value.trim() !== ''));
  readonly catalog = computed(() => {
    this.cacheRevision();
    if (!this.metadataLoaded()) return null;
    const responses = this.characterService.getCachedCatalog(this.apiPages());
    return responses?.flatMap((response) => response.results.map((result) => this.toCharacter(result))) ?? null;
  });
  readonly filteredCharacters = computed(() => {
    const { name, status, gender } = this.filters();
    const search = name.trim().toLocaleLowerCase('es');
    return (this.catalog() ?? []).filter((character) =>
      character.name.toLocaleLowerCase('es').includes(search) &&
      (!status || character.status === status) &&
      (!gender || character.gender === gender)
    );
  });
  readonly totalMatches = computed(() => this.hasActiveFilters() ? this.filteredCharacters().length : this.totalCharacters());
  readonly totalPages = computed(() => this.hasActiveFilters()
    ? Math.max(1, Math.ceil(this.totalMatches() / this.pageSize))
    : this.apiPages());
  readonly visibleCharacters = computed(() => this.hasActiveFilters()
    ? this.filteredCharacters().slice((this.page() - 1) * this.pageSize, this.page() * this.pageSize)
    : (this.currentResponse()?.results ?? []).map((result) => this.toCharacter(result)));
  readonly firstResult = computed(() => this.visibleCharacters().length ? (this.page() - 1) * this.pageSize + 1 : 0);
  readonly lastResult = computed(() => this.visibleCharacters().length
    ? Math.min((this.page() - 1) * this.pageSize + this.visibleCharacters().length, this.totalMatches())
    : 0);

  constructor() {
    this.loadPage(1);
  }

  updateFilters(value: CharacterFiltersValue): void {
    this.filters.set(value);
    this.page.set(1);
    if (!this.hasActiveFilters()) this.loadPage(1);
  }

  toggleFavorite(character: Character): void {
    const favoriteCharacter: FavoriteCharacter = {
      id: character.id,
      name: character.name,
      occupation: character.occupation,
      portrait_path: character.image,
      status: character.status
    }
    this.favorites.toggleFavorites(favoriteCharacter);
  }

  retryLoad(): void {
    if (this.hasActiveFilters() && this.metadataLoaded()) {
      this.preloadMissingPages();
    } else {
      this.loadPage(this.page());
    }
  }

  changePage(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages() || newPage === this.page()) return;
    this.page.set(newPage);
    if (!this.hasActiveFilters()) this.loadPage(newPage);
  }

  private loadPage(page: number): void {
    const cached = this.characterService.getCachedPage(page);
    if (cached) {
      this.showPage(page, cached);
      return;
    }

    this.loading.set(true);
    this.loadError.set(false);
    this.currentResponse.set(null);
    this.characterService.getCharacters(page).subscribe({
      next: (response) => {
        this.cacheRevision.update((revision) => revision + 1);
        if (this.page() === page) this.showPage(page, response);
      },
      error: () => {
        if (this.page() === page) {
          this.loadError.set(true);
          this.loading.set(false);
        }
      },
    });
  }

  private showPage(page: number, response: CharacterResponse): void {
    if (this.page() !== page) return;
    this.apiPages.set(response.pages);
    this.totalCharacters.set(response.count);
    this.metadataLoaded.set(true);
    this.currentResponse.set(response);
    this.loadError.set(false);
    this.loading.set(false);
    if (page === 1 && this.catalogState() === 'loading') this.preloadMissingPages(response.pages);
  }

  private preloadMissingPages(totalPages = this.apiPages()): void {
    if (this.preloadRunning) return;
    const missing = Array.from({ length: totalPages }, (_, index) => index + 1)
      .filter((page) => !this.characterService.getCachedPage(page));
    if (!missing.length) {
      this.cacheRevision.update((revision) => revision + 1);
      this.catalogState.set('complete');
      return;
    }

    this.catalogState.set('loading');
    this.preloadRunning = true;
    from(missing).pipe(
      mergeMap((page) => this.characterService.getCharacters(page).pipe(
        map(() => true),
        catchError(() => of(false)),
      ), 3),
      toArray(),
    ).subscribe((results) => {
      this.preloadRunning = false;
      this.cacheRevision.update((revision) => revision + 1);
      this.catalogState.set(results.every(Boolean) && !!this.characterService.getCachedCatalog(totalPages)
        ? 'complete' : 'error');
    });
  }

  private toCharacter(result: Result): Character {
    return {
      id: result.id,
      name: result.name,
      age: result.age ?? undefined,
      occupation: result.occupation || 'Sin datos',
      status: result.status === 'Alive' ? 'Vivo' : result.status === 'Deceased' || result.status === 'Dead' ? 'Fallecido' : 'Desconocido',
      gender: result.gender === 'Male' ? 'Masculino' : result.gender === 'Female' ? 'Femenino' : 'Desconocido',
      image: result.portrait_path ? `https://cdn.thesimpsonsapi.com/500${result.portrait_path}` : '',
      color: '#a9dffc',
      phrases: result.phrases ?? [],
    };
  }
}
