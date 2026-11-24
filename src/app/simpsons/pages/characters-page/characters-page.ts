import { Component, computed, inject, signal } from '@angular/core';
import { CharacterCard } from '../../components/character-card/character-card';
import { CharacterFilters, CharacterFiltersValue } from '../../components/character-filters/character-filters';
import { CharacterPagination } from '../../components/character-pagination/character-pagination';
import { NoResultsState } from '../../components/no-results-state/no-results-state';
import { ErrorState } from '../../components/error-state/error-state';
import { Character } from '../../characters.data';
import { FavoritesService } from '../../favorites.service';
import { CharacterService } from '../../services/character.service';
import { Result } from '../../interfaces/CharacterResponse';

@Component({
  selector: 'app-characters-page',
  imports: [CharacterCard, CharacterFilters, CharacterPagination, NoResultsState, ErrorState],
  templateUrl: './characters-page.html',
  styleUrl: './characters-page.css',
})
export default class CharactersPage {
  private readonly characterService = inject(CharacterService);
  readonly favorites = inject(FavoritesService);
  private readonly pageSize = 6;
  readonly characters = signal<Character[]>([]);
  readonly loading = signal(true);
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
    this.loading.set(true);
    this.loadError.set(false);
    this.characterService.getCharacters().subscribe({
      next: (response) => {
        this.characters.set(response.results.map((result) => this.toCharacter(result)));
        this.page.set(1);
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set(true);
        this.loading.set(false);
      },
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
