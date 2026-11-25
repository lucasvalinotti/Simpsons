import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { CharacterPagination } from '../../components/character-pagination/character-pagination';
import { EpisodeCard } from '../../components/episode-card/episode-card';
import { ErrorState } from '../../components/error-state/error-state';
import { Episode } from '../../interfaces/EpisodeResponse';
import { EpisodeService } from '../../services/episode.service';

@Component({
  selector: 'app-episodes-page',
  imports: [CharacterPagination, EpisodeCard, ErrorState],
  templateUrl: './episodes-page.html',
  styleUrl: './episodes-page.css',
})
export default class EpisodesPage implements OnDestroy {
  private readonly episodeService = inject(EpisodeService);
  private request?: Subscription;
  readonly page = signal(1);
  readonly totalPages = signal(1);
  readonly totalEpisodes = signal(0);
  readonly episodes = signal<Episode[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal(false);
  readonly firstResult = computed(() => this.episodes().length ? (this.page() - 1) * 20 + 1 : 0);
  readonly lastResult = computed(() => this.episodes().length
    ? Math.min(this.firstResult() + this.episodes().length - 1, this.totalEpisodes()) : 0);

  constructor() {
    this.loadPage(1);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.page()) return;
    this.loadPage(page);
  }

  retryLoad(): void {
    this.loadPage(this.page());
  }

  ngOnDestroy(): void {
    this.request?.unsubscribe();
  }

  private loadPage(page: number): void {
    this.request?.unsubscribe();
    this.page.set(page);
    this.episodes.set([]);
    this.loading.set(true);
    this.loadError.set(false);
    this.request = this.episodeService.getEpisodes(page).subscribe({
      next: (response) => {
        this.totalPages.set(response.pages);
        this.totalEpisodes.set(response.count);
        this.episodes.set(response.results);
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set(true);
        this.loading.set(false);
      },
    });
  }
}
