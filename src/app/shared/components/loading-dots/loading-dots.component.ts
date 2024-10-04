import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'loading-dots',
  template: `
    <div class="p-4 flex justify-center items-center">
      <mat-spinner [diameter]="diameter()" color="warn"></mat-spinner>
    </div>
    <!-- <span class="loading loading-dots loading-sm"></span> -->
  `
})
export class LoadingDotsComponent {
  diameter = input<number>(30)
}
