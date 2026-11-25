import { Component, Input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Location } from '../../interfaces/LocationResponse';

@Component({
  selector: 'app-location-card',
  imports: [RouterLink],
  templateUrl: './location-card.html',
  styleUrl: './location-card.css',
})
export class LocationCard {
  @Input({ required: true }) location!: Location;
  readonly imageFailed = signal(false);

  get imageUrl(): string {
    const path = this.location.image_path?.trim();
    return path ? `https://cdn.thesimpsonsapi.com/500${path.startsWith('/') ? '' : '/'}${path}` : '';
  }
}
