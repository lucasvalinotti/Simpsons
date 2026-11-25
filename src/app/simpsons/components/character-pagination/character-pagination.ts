import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-character-pagination',
  templateUrl: './character-pagination.html',
  styleUrl: './character-pagination.css',
})
export class CharacterPagination {
  @Input() page = 1;
  @Input() totalPages = 1;
  @Input() ariaLabel = 'Páginas de personajes';
  @Output() pageChange = new EventEmitter<number>();

  get pages(): (number | '…')[] {
    const numbers = [...new Set([1, 2, this.page, this.totalPages - 1, this.totalPages])]
      .filter((number) => number >= 1 && number <= this.totalPages)
      .sort((a, b) => a - b);
    const pages: (number | '…')[] = [];

    for (const number of numbers) {
      const previous = pages.at(-1);
      if (typeof previous === 'number') {
        if (number - previous === 2) pages.push(previous + 1);
        else if (number - previous > 2) pages.push('…');
      }
      pages.push(number);
    }

    return pages;
  }
}
