import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface CharacterFiltersValue {
  name: string;
  status: string;
  gender: string;
}

@Component({
  selector: 'app-character-filters',
  imports: [FormsModule],
  templateUrl: './character-filters.html',
  styleUrl: './character-filters.css',
})
export class CharacterFilters implements OnDestroy {
  @Output() filtersChange = new EventEmitter<CharacterFiltersValue>();
  private searchTimer: ReturnType<typeof setTimeout> | undefined;

  name = '';
  status = '';
  gender = '';

  scheduleSearch(): void {
    this.cancelSearch();
    this.searchTimer = setTimeout(() => this.emitFilters(), 300);
  }

  emitFilters(): void {
    this.cancelSearch();
    this.filtersChange.emit({ name: this.name, status: this.status, gender: this.gender });
  }

  clear(): void {
    this.name = '';
    this.status = '';
    this.gender = '';
    this.emitFilters();
  }

  ngOnDestroy(): void {
    this.cancelSearch();
  }

  private cancelSearch(): void {
    if (this.searchTimer !== undefined) clearTimeout(this.searchTimer);
    this.searchTimer = undefined;
  }
}
