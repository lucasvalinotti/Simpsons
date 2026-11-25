import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, combineLatest, EMPTY, map, of, startWith, Subject, switchMap } from 'rxjs';
import { ErrorState } from '../../components/error-state/error-state';
import { EpisodeDetail } from '../../interfaces/EpisodeResponse';
import { SpanishDatePipe } from '../../pipes/spanish-date.pipe';
import { EpisodeService } from '../../services/episode.service';

@Component({
  selector: 'app-episode-detail-page',
  imports: [ErrorState, RouterLink, SpanishDatePipe],
  templateUrl: './episode-detail-page.html',
  styleUrl: './episode-detail-page.css',
})
export default class EpisodeDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly episodeService = inject(EpisodeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly retry = new Subject<void>();
  readonly episode = signal<EpisodeDetail | null>(null);
  readonly loadState = signal<'loading' | 'ready' | 'notFound' | 'error'>('loading');
  readonly imageFailed = signal(false);
  readonly imageUrl = computed(() => {
    const path = this.episode()?.image_path?.trim();
    return path ? `https://cdn.thesimpsonsapi.com/1280${path.startsWith('/') ? '' : '/'}${path}` : '';
  });

  ngOnInit(): void {
    combineLatest([this.route.paramMap, this.retry.pipe(startWith(undefined))]).pipe(
      switchMap(([params]) => {
        const rawId = params.get('id');
        this.episode.set(null);
        this.imageFailed.set(false);
        if (!rawId || !/^[1-9]\d*$/.test(rawId) || !Number.isSafeInteger(Number(rawId))) {
          this.loadState.set('notFound');
          return EMPTY;
        }

        this.loadState.set('loading');
        return this.episodeService.getEpisodeById(Number(rawId)).pipe(
          map((episode) => ({ kind: 'success' as const, episode })),
          catchError((error: HttpErrorResponse) => of({ kind: 'error' as const, status: error.status })),
        );
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((result) => {
      if (result.kind === 'success') {
        this.episode.set(result.episode);
        this.loadState.set(result.episode ? 'ready' : 'notFound');
      } else {
        this.loadState.set(result.status === 404 ? 'notFound' : 'error');
      }
    });
  }

  retryLoad(): void {
    this.retry.next();
  }
}
