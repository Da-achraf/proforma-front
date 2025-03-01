import { Component, inject, input, output, signal } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { PageEvent } from '@angular/material/paginator';
import {
  PAGE_SIZE_OPTIONS,
  TABLE_PAGE_SIZE,
} from '../../shared/components/tables/data';

@Component({
  selector: 'ba-paginator',
  template: `
    <mat-paginator
      [color]="color()"
      [length]="total()"
      [pageSize]="_rows()"
      [showFirstLastButtons]="showFirstLastButtons()"
      [pageSizeOptions]="pageSizeOptions()"
      (page)="onPageChange($event)"
      aria-label="Select page"
    >
    </mat-paginator>
  `,
})
export class PaginatorComponent {
  readonly total = input.required<number>();
  readonly showFirstLastButtons = input<boolean>(true);
  readonly color = input<ThemePalette>('primary');
  readonly pageSizeOptions = input<number[]>(inject(PAGE_SIZE_OPTIONS));

  readonly page = output<number>();
  readonly pageSize = output<number>();

  protected readonly rows = input<number>(inject(TABLE_PAGE_SIZE));
  protected readonly _rows = signal(this.rows());
  protected first = signal(0);

  protected onPageChange(event: PageEvent) {
    const { pageIndex, pageSize } = event;

    if (typeof pageIndex === 'number' && typeof pageSize === 'number') {
      this.first.set(pageIndex * pageSize);
      this._rows.set(pageSize);

      this.page.emit(pageIndex + 1);
      this.pageSize.emit(pageSize);
    }
  }
}
