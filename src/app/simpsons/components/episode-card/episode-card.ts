import { Component, Input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Episode } from '../../interfaces/EpisodeResponse';
import { SpanishDatePipe } from '../../pipes/spanish-date.pipe';

@Component({
  selector: 'app-episode-card',
  imports: [RouterLink, SpanishDatePipe],
  templateUrl: './episode-card.html',
  styleUrl: './episode-card.css',
})
export class EpisodeCard {
  @Input({ required: true }) episode!: Episode;
  readonly imageFailed = signal(false);

  get imageUrl(): string {
    const path = this.episode.image_path?.trim();
    return path ? `https://cdn.thesimpsonsapi.com/500${path.startsWith('/') ? '' : '/'}${path}` : '';
  }
}
