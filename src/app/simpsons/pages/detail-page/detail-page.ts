import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CharacterNotFound } from '../../components/character-not-found/character-not-found';
import { ErrorState } from '../../components/error-state/error-state';
import { FavoritesService } from '../../services/favorites.service';
import { CharacterByID } from '../../interfaces/CharacterByIdResponse';
import { CharacterService } from '../../services/character.service';

@Component({
  selector: 'app-detail-page',
  imports: [CharacterNotFound, ErrorState, RouterLink],
  templateUrl: './detail-page.html',
  styleUrl: './detail-page.css',
})
export default class DetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly favorites = inject(FavoritesService);
  private readonly params = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });
  character?: CharacterByID = undefined;
  characterService = inject(CharacterService);
  id = this.params().get('id');
  readonly loadState = signal<'loading' | 'ready' | 'notFound' | 'error'>('loading');
  readonly portraitUrl = signal('');

  readonly imageFailedFor = signal<number | null>(null);

  ngOnInit(): void {
    this.loadCharacter();
  }

  loadCharacter(): void {
    if (!this.id) {
      this.loadState.set('notFound');
      return;
    }

    this.character = undefined;
    this.portraitUrl.set('');
    this.imageFailedFor.set(null);
    this.loadState.set('loading');
    this.characterService.getCharacterById(this.id).subscribe({
      next: (character) => {
        this.character = character;
        const path = character?.portrait_path?.trim();
        this.portraitUrl.set(path
          ? `https://cdn.thesimpsonsapi.com/1280${path.startsWith('/') ? '' : '/'}${path}`
          : '');
        this.loadState.set(character ? 'ready' : 'notFound');
      },
      error: (error: HttpErrorResponse) => {
        this.loadState.set(error.status === 404 ? 'notFound' : 'error');
      },
    });
  }
}
