import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
    selector: 'app-no-data-found',
    templateUrl: 'no-data-found.component.html',
    styleUrl: 'no-data-found.component.css',
    imports: [NgClass]
})
export class NoDataFoundComponent {
  icon = input<string>('fa-solid fa-table-list');
  iconColor = input<string>('text-gray-400');
  title = input<string>('No data found');
  titleClass = input<string>('text-base font-semibold text-gray-600');
  description = input<string>('Try changing your search criteria');
  actionLabel = input<string>('');
  onAction = output<void>();
}
