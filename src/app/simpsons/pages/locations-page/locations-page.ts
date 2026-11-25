import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { CharacterPagination } from '../../components/character-pagination/character-pagination';
import { ErrorState } from '../../components/error-state/error-state';
import { LocationCard } from '../../components/location-card/location-card';
import { Location } from '../../interfaces/LocationResponse';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-locations-page',
  imports: [CharacterPagination, ErrorState, LocationCard],
  templateUrl: './locations-page.html',
  styleUrl: './locations-page.css',
})
export default class LocationsPage implements OnDestroy {
  private readonly locationService = inject(LocationService);
  private request?: Subscription;
  readonly page = signal(1);
  readonly totalPages = signal(1);
  readonly totalLocations = signal(0);
  readonly locations = signal<Location[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal(false);
  readonly firstResult = computed(() => this.locations().length ? (this.page() - 1) * 20 + 1 : 0);
  readonly lastResult = computed(() => this.locations().length
    ? Math.min(this.firstResult() + this.locations().length - 1, this.totalLocations()) : 0);

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
    this.locations.set([]);
    this.loading.set(true);
    this.loadError.set(false);
    this.request = this.locationService.getLocations(page).subscribe({
      next: (response) => {
        this.totalPages.set(response.pages);
        this.totalLocations.set(response.count);
        this.locations.set(response.results);
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set(true);
        this.loading.set(false);
      },
    });
  }
}
