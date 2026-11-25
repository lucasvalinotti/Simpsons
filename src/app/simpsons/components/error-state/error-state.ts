import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error-state',
  templateUrl: './error-state.html',
  styleUrl: '../state-panel.css',
})
export class ErrorState {
  @Input() title = 'No pudimos cargar los personajes';
  @Input() message = 'Hubo un problema de conexión. Podés intentar de nuevo.';
  @Output() retry = new EventEmitter<void>();
}
