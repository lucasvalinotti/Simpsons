import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-error-state',
  templateUrl: './error-state.html',
  styleUrl: '../state-panel.css',
})
export class ErrorState {
  @Output() retry = new EventEmitter<void>();
}
