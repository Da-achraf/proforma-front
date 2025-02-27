import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-create-button',
  templateUrl: 'create-button.component.html',
  styleUrl: 'create-button.component.css',
  standalone: false
})
export class CreateButtonComponent {
  title = input('request', {
    transform: (v: string) => `Create a new ${v}`,
  });

  create = output<void>();
}
