import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Character } from '../../characters.data';

@Component({
  selector: 'app-character-card',
  imports: [RouterLink],
  templateUrl: './character-card.html',
  styleUrl: './character-card.css',
})
export class CharacterCard implements OnInit {
  @Input({ required: true }) character!: Character;
  @Input() isFavorite = false;
  @Output() favoriteToggle = new EventEmitter<number>();

  readonly loading = signal(true);
  readonly imageFailed = signal(false);

  ngOnInit(): void {
    if (!this.character.image) {
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
