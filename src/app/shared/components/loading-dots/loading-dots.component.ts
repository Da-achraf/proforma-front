import { Component, input } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'loading-dots',
  template: `
    <div class="flex items-center justify-center p-4">
      <mat-spinner [diameter]="diameter()" color="warn"></mat-spinner>
    </div>
  `,
  imports: [MatProgressSpinner],
})
export class LoadingDotsComponent {
  diameter = input<number>(30);
}
