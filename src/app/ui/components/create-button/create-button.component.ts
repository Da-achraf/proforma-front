import { Component, input, output } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-create-button',
  templateUrl: 'create-button.component.html',
  styleUrl: 'create-button.component.css',
  imports: [MatTooltip],
})
export class CreateButtonComponent {
  title = input('request', {
    transform: (v: string) => `Create a new ${v}`,
  });

  create = output<void>();
}
