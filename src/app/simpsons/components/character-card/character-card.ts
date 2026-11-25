import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Character } from '../../interfaces/CharacterResponse';
import { FavoriteCharacter } from '../../interfaces/FavoriteCharacter';

@Component({
  selector: 'app-character-card',
  imports: [RouterLink],
  templateUrl: './character-card.html',
  styleUrl: './character-card.css',
})
export class CharacterCard implements OnInit {
  @Input({ required: true }) character!: Character | FavoriteCharacter;
  @Input() isFavorite = false;
  @Output() favoriteToggle = new EventEmitter<number>();

  readonly loading = signal(true);
  readonly imageFailed = signal(false);

  get imageUrl(): string {
    if ('image' in this.character) {
      return this.character.image;
    }

    const path = this.character.portrait_path;
    if (!path) return '';
    if (path.startsWith('https://') || path.startsWith('http://')) return path;
    return `https://cdn.thesimpsonsapi.com/500${path.startsWith('/') ? '' : '/'}${path}`;
  }

  get portraitColor(): string {
    return 'color' in this.character ? this.character.color : '#a9dffc';
  }

  get displayStatus(): string {
    const status = this.character.status;

    switch (status) {
      case 'Alive':
        return 'Vivo';
      case 'Dead':
      case 'Deceased':
        return 'Fallecido';
      case 'Unknown':
        return 'Desconocido';
      default:
        return status;
    }
  }

  ngOnInit(): void {
    if (!this.imageUrl) {
      this.imageFailed.set(true);
      this.loading.set(false);
    }
  }

  onImageLoad(): void {
    this.loading.set(false);
  }

  onImageError(): void {
    this.imageFailed.set(true);
    this.loading.set(false);
  }
}
