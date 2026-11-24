import { Injectable, signal } from '@angular/core';

// Estado local de ejemplo: se comparte entre las páginas sin servicios externos.
@Injectable({ providedIn: 'root' })
export class FavoritesService {
  readonly ids = signal(new Set<number>());

  toggle(id: number): void {
    this.ids.update((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
}
