import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CharacterNotFound } from '../../components/character-not-found/character-not-found';
import { CHARACTERS } from '../../characters.data';
import { FavoritesService } from '../../favorites.service';

@Component({
  selector: 'app-detail-page',
  imports: [CharacterNotFound, RouterLink],
  templateUrl: './detail-page.html',
  styleUrl: './detail-page.css',
})
export default class DetailPage {
  private readonly route = inject(ActivatedRoute);
  readonly favorites = inject(FavoritesService);
  private readonly params = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });
  readonly character = computed(() => CHARACTERS.find((item) => item.id === Number(this.params().get('id'))));
  readonly imageFailedFor = signal<number | null>(null);

  readonly details = computed(() => {
    const character = this.character();
    if (!character) return null;

    return {
      id: character.id,
      name: character.name?.trim() || 'Personaje de ejemplo',
      age: character.age == null ? 'Sin datos' : `${character.age} años`,
      gender: character.gender?.trim() || 'Sin datos',
      occupation: character.occupation?.trim() || 'Sin datos',
      status: character.status?.trim() || 'Desconocido',
      image: character.image?.trim() || '',
      color: character.color || '#d9c0f5',
      phrases: character.phrases?.filter((phrase) => phrase?.trim()) ?? [],
    };
  });
}
