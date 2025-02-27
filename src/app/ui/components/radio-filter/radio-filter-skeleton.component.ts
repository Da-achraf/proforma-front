import { Component } from '@angular/core';

@Component({
  selector: 'app-radio-filter-skeleton',
  template: `
    <div
      class="flex items-center select-none box-border overflow-hidden border border-gray-300 rounded-md animate-pulse py-2"
    >
      @for (option of [1, 2, 3, 4]; track $index; let isLast = $last) {
      <div
        class="flex-1 border-r border-gray-300 transition-colors duration-150 ease-in-out"
        [ngClass]="{ 'border-none': isLast }"
      >
        <div class="flex flex-grow items-center justify-center p-2">
          <div class="flex items-center gap-x-2">
            <!-- Placeholder for the tab label -->
            <div class="h-4 w-16 bg-gray-200 rounded"></div>

            <!-- Placeholder for the count (optional) -->
            <div class="h-4 w-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
      }
    </div>
  `,
  standalone: false
})
export class RadioFilterSkeletonComponent {}
