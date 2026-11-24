import { Component, computed, inject, signal } from '@angular/core';
import { CharacterCard } from '../../components/character-card/character-card';
import { CharacterFilters, CharacterFiltersValue } from '../../components/character-filters/character-filters';
import { CharacterPagination } from '../../components/character-pagination/character-pagination';
import { NoResultsState } from '../../components/no-results-state/no-results-state';
import { CHARACTERS, Character } from '../../characters.data';
import { FavoritesService } from '../../favorites.service';
import { ErrorState } from '../../components/error-state/error-state';

@Component({
  selector: 'app-characters-page',
  imports: [CharacterCard, CharacterFilters, CharacterPagination, NoResultsState, ErrorState],
  templateUrl: './characters-page.html',
  styleUrl: './characters-page.css',
})
export default class CharactersPage {
  readonly favorites = inject(FavoritesService);
  private readonly pageSize = 6;
  readonly characters = signal<Character[]>([]);
  readonly loadError = signal(false);
  readonly filters = signal<CharacterFiltersValue>({ name: '', status: '', gender: '' });
  readonly page = signal(1);

  constructor() {
    this.retryLoad();
  }

  readonly filteredCharacters = computed(() => {
    const { name, status, gender } = this.filters();
    const search = name.trim().toLocaleLowerCase('es');
    return this.characters().filter((character) =>
      character.name.toLocaleLowerCase('es').includes(search) &&
      (!status || character.status === status) &&
      (!gender || character.gender === gender)
    );
  });
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredCharacters().length / this.pageSize)));
  readonly visibleCharacters = computed(() => this.filteredCharacters().slice((this.page() - 1) * this.pageSize, this.page() * this.pageSize));
  readonly firstResult = computed(() => this.filteredCharacters().length ? (this.page() - 1) * this.pageSize + 1 : 0);
  readonly lastResult = computed(() => Math.min(this.page() * this.pageSize, this.filteredCharacters().length));

  updateFilters(value: CharacterFiltersValue): void {
    this.filters.set(value);
    this.page.set(1);
  }

  toggleFavorite(id: number): void {
    this.favorites.toggle(id);
  }

  retryLoad(): void {
    try {
      if (!Array.isArray(CHARACTERS)) throw new Error('Datos de personajes inválidos');
      this.characters.set(CHARACTERS);
      this.loadError.set(false);
    } catch {
      this.loadError.set(true);
    }
  }
}
