import { Component, computed, inject, signal } from '@angular/core';
import { CharacterCard } from '../../components/character-card/character-card';
import { CharacterFilters, CharacterFiltersValue } from '../../components/character-filters/character-filters';
import { CharacterPagination } from '../../components/character-pagination/character-pagination';
import { NoResultsState } from '../../components/no-results-state/no-results-state';
import { ErrorState } from '../../components/error-state/error-state';
import { FavoritesService } from '../../favorites.service';
import { CharacterService } from '../../services/character.service';
import { Character, Result } from '../../interfaces/CharacterResponse';

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
  readonly characters = signal<Character[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal(false);
  readonly filters = signal<CharacterFiltersValue>({ name: '', status: '', gender: '' });
  totalPages = signal<number>(1);
  readonly totalCharacters = signal(0);
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

  readonly visibleCharacters = computed(() => this.filteredCharacters());
  readonly hasActiveFilters = computed(() => Object.values(this.filters()).some((value) => value.trim() !== ''));
  readonly firstResult = computed(() => this.filteredCharacters().length ? (this.page() - 1) * this.pageSize + 1 : 0);
  readonly lastResult = computed(() => Math.min((this.page() - 1) * this.pageSize + this.characters().length, this.totalCharacters()));

  updateFilters(value: CharacterFiltersValue): void {
    this.filters.set(value);
  }

  toggleFavorite(id: number): void {
    this.favorites.toggle(id);
  }

  retryLoad(): void {
    this.loading.set(true);
    this.loadError.set(false);
    this.characterService.getCharacters(this.page()).subscribe({
      next: (response) => {
        this.totalPages.set(response.pages);
        this.totalCharacters.set(response.count);
        this.characters.set(response.results.map((result) => this.toCharacter(result)));
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set(true);
        this.loading.set(false);
      },
    });
  }

  changePage(newPage: number) {
    this.page.set(newPage);
    this.retryLoad();
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
