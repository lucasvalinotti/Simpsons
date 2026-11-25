import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, combineLatest, EMPTY, map, of, startWith, Subject, switchMap } from 'rxjs';
import { ErrorState } from '../../components/error-state/error-state';
import { LocationDetail } from '../../interfaces/LocationResponse';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-location-detail-page',
  imports: [ErrorState, RouterLink],
  templateUrl: './location-detail-page.html',
  styleUrl: './location-detail-page.css',
})
export default class LocationDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly locationService = inject(LocationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly retry = new Subject<void>();
  readonly location = signal<LocationDetail | null>(null);
  readonly loadState = signal<'loading' | 'ready' | 'notFound' | 'error'>('loading');
  readonly imageFailed = signal(false);
  readonly imageUrl = computed(() => {
    const path = this.location()?.image_path?.trim();
    return path ? `https://cdn.thesimpsonsapi.com/1280${path.startsWith('/') ? '' : '/'}${path}` : '';
  });

  ngOnInit(): void {
    combineLatest([this.route.paramMap, this.retry.pipe(startWith(undefined))]).pipe(
      switchMap(([params]) => {
        const rawId = params.get('id');
        this.location.set(null);
        this.imageFailed.set(false);
        if (!rawId || !/^[1-9]\d*$/.test(rawId) || !Number.isSafeInteger(Number(rawId))) {
          this.loadState.set('notFound');
          return EMPTY;
        }

        this.loadState.set('loading');
        return this.locationService.getLocationById(Number(rawId)).pipe(
          map((location) => ({ kind: 'success' as const, location })),
          catchError((error: HttpErrorResponse) => of({ kind: 'error' as const, status: error.status })),
        );
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((result) => {
      if (result.kind === 'success') {
        this.location.set(result.location);
        this.loadState.set(result.location ? 'ready' : 'notFound');
      } else {
        this.loadState.set(result.status === 404 ? 'notFound' : 'error');
      }
    });
  }

  retryLoad(): void {
    this.retry.next();
  }
}
