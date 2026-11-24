import { Component, EventEmitter, Output } from '@angular/core';
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
export class CharacterFilters {
  @Output() filtersChange = new EventEmitter<CharacterFiltersValue>();

  name = '';
  status = '';
  gender = '';

  emitFilters(): void {
    this.filtersChange.emit({ name: this.name, status: this.status, gender: this.gender });
  }

  clear(): void {
    this.name = '';
    this.status = '';
    this.gender = '';
    this.emitFilters();
  }
}
