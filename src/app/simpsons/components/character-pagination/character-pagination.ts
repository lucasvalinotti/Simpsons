import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-character-pagination',
  templateUrl: './character-pagination.html',
  styleUrl: './character-pagination.css',
})
export class CharacterPagination {
  @Input() page = 1;
  @Input() totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }
}
