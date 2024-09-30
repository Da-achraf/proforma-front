import { Component, computed, input } from '@angular/core';

type Size = 'xs' | 'sm' | 'md' | 'lg'

@Component({
  selector: 'loading-dots',
  template: `
    <div class="p-4 flex justify-center items-center">
      <mat-spinner diameter="30" color="accent"></mat-spinner>
    </div>
    <!-- <span class="loading loading-dots loading-sm"></span> -->
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `
  ]
})
export class LoadingDotsComponent {
  size = input<Size>('sm')
  class = computed(() => {
    const size = this.size()
    return `loading-${size}`
  })
}
