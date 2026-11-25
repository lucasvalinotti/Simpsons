import { Component, inject } from '@angular/core';
import { CharacterCard } from '../../components/character-card/character-card';
import { NoResultsState } from '../../components/no-results-state/no-results-state';
import { FavoritesService } from '../../services/favorites.service';


@Component({
  selector: 'app-favorites-page',
  imports: [CharacterCard, NoResultsState],
  templateUrl: './favorites-page.html',
  styleUrl: './favorites-page.css',
})
export default class FavoritesPage {
  readonly favoritesService = inject(FavoritesService);
}
