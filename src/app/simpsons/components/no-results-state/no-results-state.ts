import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-no-results-state',
  imports: [RouterLink],
  templateUrl: './no-results-state.html',
  styleUrl: '../state-panel.css',
})
export class NoResultsState {
  @Input() favoritesEmpty = false;
  @Output() clear = new EventEmitter<void>();
}
